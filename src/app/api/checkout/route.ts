import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import Order from "@/models/Order";
import { z } from "zod";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";
import { formatNprFromUsd } from "@/lib/currency";

const itemSchema = z.object({
  artworkId: z.string(),
  quantity: z.number().int().min(1).max(10),
});

const bodySchema = z.object({
  items: z.array(itemSchema).min(1),
  customerEmail: z.string().email(),
});

export async function POST(req: Request) {
  try {
    // This project uses email-based inquiries instead of Stripe checkout.
    // Configure RESEND_API_KEY to enable email sending.
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        {
          error:
            "Email sending is not configured. Set RESEND_API_KEY in .env.local and restart the dev server.",
        },
        { status: 503 }
      );
    }
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }
    await connectDB();
    const lineItems: {
      artworkId: string;
      title: string;
      quantity: number;
      unitPrice: number;
      imageUrl: string;
    }[] = [];
    let subtotal = 0;
    for (const line of parsed.data.items) {
      const art = await Artwork.findById(line.artworkId);
      if (!art || art.sold) {
        return NextResponse.json(
          { error: `Artwork unavailable: ${line.artworkId}` },
          { status: 400 }
        );
      }
      const unit = art.price;
      subtotal += unit * line.quantity;
      lineItems.push({
        artworkId: String(art._id),
        title: art.title,
        quantity: line.quantity,
        unitPrice: unit,
        imageUrl: art.imageUrl,
      });
    }

    const order = await Order.create({
      customerEmail: parsed.data.customerEmail,
      items: lineItems.map((l) => ({
        artworkId: l.artworkId,
        title: l.title,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        imageUrl: l.imageUrl,
      })),
      total: subtotal,
      status: "pending",
    });

    const resend = new Resend(resendKey);
    const adminTo =
      process.env.CONTACT_TO_EMAIL ?? "maharjanpragyan0@gmail.com";
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
    const qr = await loadQr();

    const linesHtml = lineItems
      .map(
        (l) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #e8e2d9">${escapeHtml(
              l.title
            )}</td>
            <td style="padding:8px 0;border-bottom:1px solid #e8e2d9;text-align:center">${l.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #e8e2d9;text-align:right">${escapeHtml(
              formatNprFromUsd(l.unitPrice)
            )}</td>
          </tr>`
      )
      .join("");

    let adminCopyId: string | null = null;
    let customerReceiptId: string | null = null;
    let adminCopyError: unknown = null;
    let customerReceiptError: unknown = null;

    // Send inquiry copy to admin inbox
    if (adminTo) {
      const r = await resend.emails.send({
        from,
        to: adminTo,
        replyTo: parsed.data.customerEmail,
        subject: `New purchase inquiry (${lineItems.length} item${lineItems.length === 1 ? "" : "s"})`,
        attachments: qr
          ? [
              {
                filename: "qr.png",
                content: qr.base64,
              },
            ]
          : undefined,
        html: `
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
            <h2 style="margin:0 0 12px 0;font-weight:600">New purchase inquiry</h2>
            <p style="margin:0 0 6px 0"><strong>Customer email:</strong> ${escapeHtml(
              parsed.data.customerEmail
            )}</p>
            <p style="margin:0 0 18px 0"><strong>Order ID:</strong> ${escapeHtml(
              String(order._id)
            )}</p>
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th style="text-align:left;padding:8px 0;border-bottom:1px solid #e8e2d9">Artwork</th>
                  <th style="text-align:center;padding:8px 0;border-bottom:1px solid #e8e2d9">Qty</th>
                  <th style="text-align:right;padding:8px 0;border-bottom:1px solid #e8e2d9">Price</th>
                </tr>
              </thead>
              <tbody>${linesHtml}</tbody>
            </table>
          <p style="margin:14px 0 0 0;text-align:right"><strong>Total:</strong> ${escapeHtml(
            formatNprFromUsd(subtotal)
          )}</p>
            ${
              qr
                ? `<div style="margin-top:18px;border-top:1px solid #e8e2d9;padding-top:14px">
                    <p style="margin:0 0 10px 0;font-size:12px;color:#3a3a3a"><strong>QR (static):</strong></p>
                    <img src="${qr.dataUri}" alt="QR code" width="220" height="220" style="display:block;border:1px solid #e8e2d9;border-radius:10px;background:#ffffff;padding:10px" />
                    <p style="margin:10px 0 0 0;font-size:12px;color:#7a7a7a">If your email client blocks images, the QR is also attached as <strong>qr.png</strong>.</p>
                  </div>`
                : ""
            }
          </div>
        `,
      });
      adminCopyId = (r as { data?: { id?: string } }).data?.id ?? null;
      adminCopyError = (r as { error?: unknown }).error ?? null;
    }

    // 2) Send confirmation to the customer (email entered in the field)
    const r2 = await resend.emails.send({
      from,
      to: parsed.data.customerEmail,
      subject: "Inquiry received — receipt",
      html: `
        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
          <h2 style="margin:0 0 12px 0;font-weight:600">Receipt (inquiry)</h2>
          <p style="margin:0 0 10px 0">Thanks — we received your request and will email you back with availability and next steps.</p>
          <p style="margin:0 0 10px 0">The artist will contact you regarding this.</p>
          <p style="margin:0 0 6px 0"><strong>Reference:</strong> ${escapeHtml(String(order._id))}</p>
          <p style="margin:0 0 18px 0"><strong>Email:</strong> ${escapeHtml(parsed.data.customerEmail)}</p>

          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px 0;border-bottom:1px solid #e8e2d9">Artwork</th>
                <th style="text-align:center;padding:8px 0;border-bottom:1px solid #e8e2d9">Qty</th>
                <th style="text-align:right;padding:8px 0;border-bottom:1px solid #e8e2d9">Price</th>
              </tr>
            </thead>
            <tbody>${linesHtml}</tbody>
          </table>
          <p style="margin:14px 0 0 0;text-align:right"><strong>Total:</strong> ${escapeHtml(
            formatNprFromUsd(subtotal)
          )}</p>
          ${
            qr
              ? `<p style="margin:16px 0 10px 0;font-size:12px;color:#3a3a3a"><strong>QR (static):</strong></p>
                 <img src="${qr.dataUri}" alt="QR code" width="220" height="220" style="display:block;border:1px solid #e8e2d9;border-radius:10px;background:#ffffff;padding:10px" />`
              : ""
          }
        </div>
      `,
      attachments: qr
        ? [
            {
              filename: "qr.png",
              content: qr.base64,
            },
          ]
        : undefined,
    });
    customerReceiptId = (r2 as { data?: { id?: string } }).data?.id ?? null;
    customerReceiptError = (r2 as { error?: unknown }).error ?? null;

    console.info("[checkout-email]", {
      orderId: String(order._id),
      customerEmail: parsed.data.customerEmail,
      adminCopySent: Boolean(adminTo),
      adminCopyId,
      adminCopyError,
      customerReceiptId,
      customerReceiptError,
    });

    if (!customerReceiptId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email sending failed. Your Resend sender (CONTACT_FROM_EMAIL) is likely not verified, or Resend rejected the request.",
          details: customerReceiptError ?? null,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderId: String(order._id),
      emailSentToAdmin: Boolean(adminTo),
      emailSentToCustomer: true,
      adminCopyId,
      customerReceiptId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadQr(): Promise<{ base64: string; dataUri: string } | null> {
  try {
    const fp = path.join(process.cwd(), "public", "qr.png");
    const buf = await readFile(fp);
    const base64 = buf.toString("base64");
    return { base64, dataUri: `data:image/png;base64,${base64}` };
  } catch {
    return null;
  }
}
