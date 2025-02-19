import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const userSubscription = await db.userSubscription.findUnique({
      where: {
        userId: session?.metadata?.userId,
      },
    });
    if (!userSubscription) {
      await db.userSubscription.create({
        data: {
          userId: session?.metadata?.userId,
          stripeSubscriptionId: session.id,
          stripeCustomerId: session.customer as string,
          stripePriceId: session.amount_total
            ? String(session.amount_total / 100)
            : null,
          stripeCurrentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });
    } else {
      await db.userSubscription.update({
        where: {
          stripeSubscriptionId: session.id,
        },
        data: {
          stripePriceId: session.amount_total?.toString(),
          stripeCurrentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
