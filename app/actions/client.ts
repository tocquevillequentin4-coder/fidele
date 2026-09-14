"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function addClient(formData: FormData) {
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

  const nom = String(formData.get("nom") || "").trim();
  const telephone = String(formData.get("telephone") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (!nom || (!telephone && !email)) {
    redirect("/app?erreur=invalide");
  }

  await prisma.client.create({
    data: {
      nom,
      telephone: telephone || null,
      email: email || null,
      dernierAchatAt: new Date(),
      commerceId: commerce.id,
    },
  });

  redirect("/app");
}
