import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { readFile } from "fs/promises";
import path from "path";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().max(120).optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form" }, { status: 400 });
    }
    const { firstName, lastName, email, subject, message } = parsed.data;
    const fromName = `${firstName} ${lastName}`.trim();

    // If RESEND_API_KEY is not configured, we still accept the form
    // (useful for local dev), but only log the payload.
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.info("[contact]", {
        name: fromName,
        email,
        subject: subject ?? "(none)",
        message: message.slice(0, 200),
        note: "RESEND_API_KEY missing (email not sent)",
      });
      return NextResponse.json({ ok: true, emailSent: false });
    }

    const resend = new Resend(resendKey);

    // IMPORTANT:
    // - The "from" must be a verified sender/domain in your Resend account.
    // - Keep the user's email in reply-to to avoid spoofing issues.
    const adminTo =
      process.env.CONTACT_TO_EMAIL ?? "maharjanpragyan0@gmail.com";
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
    const qr = await loadQr();

    const s = subject?.trim() ? subject.trim() : "New message";
    const safeSubject = `[Contact] ${s}`;

    let adminCopyId: string | null = null;
    let senderReplyId: string | null = null;
    let adminCopyError: unknown = null;
    let senderReplyError: unknown = null;

    // Send a copy to admin inbox
    if (adminTo) {
      const r = await resend.emails.send({
        from,
        to: adminTo,
        subject: safeSubject,
        replyTo: email,
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
            <h2 style="margin:0 0 12px 0;font-weight:600">New contact message</h2>
            <p style="margin:0 0 6px 0"><strong>Name:</strong> ${escapeHtml(fromName)}</p>
            <p style="margin:0 0 6px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p style="margin:0 0 18px 0"><strong>Subject:</strong> ${escapeHtml(s)}</p>
            <div style="white-space:pre-wrap;line-height:1.55;border:1px solid #e8e2d9;padding:14px;border-radius:10px;background:#faf8f4">
              ${escapeHtml(message)}
            </div>
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

    // 2) Auto-reply confirmation to the sender (email entered in the form)
    const r2 = await resend.emails.send({
      from,
      to: email,
      subject: "Thanks — message received",
      html: `
        <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial">
          <p style="margin:0 0 10px 0">Hi ${escapeHtml(firstName)},</p>
          <p style="margin:0 0 10px 0">Thanks for reaching out. We received your message and will reply shortly.</p>
          <p style="margin:0 0 10px 0">The artist will contact you regarding this.</p>
          <p style="margin:0 0 12px 0;font-size:12px;color:#7a7a7a">For reference:</p>
          <div style="white-space:pre-wrap;line-height:1.55;border:1px solid #e8e2d9;padding:14px;border-radius:10px;background:#faf8f4">
            ${escapeHtml(message)}
          </div>
          ${
            qr
              ? `<div style="margin-top:18px;border-top:1px solid #e8e2d9;padding-top:14px">
                  <p style="margin:0 0 10px 0;font-size:12px;color:#3a3a3a"><strong>QR (static):</strong></p>
                  <img src="${qr.dataUri}" alt="QR code" width="220" height="220" style="display:block;border:1px solid #e8e2d9;border-radius:10px;background:#ffffff;padding:10px" />
                </div>`
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
    senderReplyId = (r2 as { data?: { id?: string } }).data?.id ?? null;
    senderReplyError = (r2 as { error?: unknown }).error ?? null;

    console.info("[contact]", {
      name: `${firstName} ${lastName}`.trim(),
      email,
      subject: subject ?? "(none)",
      message: message.slice(0, 200),
      adminCopySent: Boolean(adminTo),
      adminCopyId,
      adminCopyError,
      senderReplyId,
      senderReplyError,
    });
    if (!senderReplyId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Email sending failed. Your Resend sender (CONTACT_FROM_EMAIL) is likely not verified, or Resend rejected the request.",
          details: senderReplyError ?? null,
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      emailSentToSender: true,
      emailSentToAdmin: Boolean(adminTo),
      adminCopyId,
      senderReplyId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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
