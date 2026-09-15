import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Erreur signature webhook:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const commerceId = session.metadata?.commerceId;
    const customerId = session.customer as string;

    if (commerceId && customerId) {
      await prisma.commerce.update({
        where: { id: commerceId },
        data: { stripeCustomerId: customerId },
      });
    }
  }

  return NextResponse.json({ received: true });
}
