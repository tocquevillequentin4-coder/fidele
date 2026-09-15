"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createCheckoutSession() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const commerce = await prisma.commerce.findUnique({
    where: { ownerId: session.userId },
  });
  if (!commerce) {
    redirect("/app");
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    subscription_data: { trial_period_days: 30 },
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: "Fidèle -- abonnement mensuel" },
          unit_amount: 2500,
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: "https://fidele-xi.vercel.app/app?paiement=succes",
    cancel_url: "https://fidele-xi.vercel.app/app?paiement=annule",
    metadata: { commerceId: commerce.id },
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }
}

export async function openBillingPortal() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const commerce = await prisma.commerce.findUnique({
    where: { ownerId: session.userId },
  });

  if (!commerce?.stripeCustomerId) {
    redirect("/app");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: commerce.stripeCustomerId,
    return_url: "https://fidele-xi.vercel.app/app",
  });

  redirect(portalSession.url);
}
