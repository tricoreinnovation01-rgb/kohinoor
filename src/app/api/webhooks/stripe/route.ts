import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Artwork from "@/models/Artwork";
import Stripe from "stripe";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = (await headers()).get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !whSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (e) {
    console.error("Webhook signature failed", e);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const email =
      session.customer_details?.email ??
      session.customer_email ??
      undefined;
    try {
      await connectDB();
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.status = "paid";
          order.stripeSessionId = session.id;
          if (email) order.customerEmail = email;
          await order.save();
          for (const item of order.items) {
            await Artwork.findByIdAndUpdate(item.artworkId, { sold: true });
          }
        }
      }
      if (email) {
        await Customer.findOneAndUpdate(
          { email },
          { $setOnInsert: { email }, $set: { stripeCustomerId: session.customer as string } },
          { upsert: true, new: true }
        );
      }
    } catch (e) {
      console.error("Webhook handler error", e);
      return NextResponse.json({ received: true, error: String(e) }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";
