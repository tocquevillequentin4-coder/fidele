"use server";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function sendReminder(clientId: string) {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { commerce: true },
  });

  if (!client || client.commerce.ownerId !== session.userId) {
    redirect("/app");
  }

  if (!client.email) {
    redirect("/app?erreur=pas-email");
  }

  const code = generateCode();

  await prisma.reminder.create({
    data: {
      offreCode: code,
      client: { connect: { id: client.id } },
    },
  });

  await resend.emails.send({
    from: "Fidèle <onboarding@resend.dev>",
    to: client.email,
    subject: `${client.commerce.name} pense à vous !`,
    html: `<p>Bonjour ${client.nom},</p><p>Ça fait un moment qu'on ne vous a pas vu chez ${client.commerce.name}. Revenez nous voir avec ce code pour une offre spéciale : <strong>${code}</strong></p>`,
  });

  revalidatePath("/app");
}

export async function markReminderUsed(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const reminderId = String(formData.get("reminderId") || "");
  const montant = parseFloat(String(formData.get("montant") || "0"));

  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
    include: { client: { include: { commerce: true } } },
  });

  if (!reminder || reminder.client.commerce.ownerId !== session.userId) {
    redirect("/app");
  }

  await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      utilisee: true,
      utiliseeAt: new Date(),
      montantGenere: isNaN(montant) ? 0 : montant,
    },
  });

  await prisma.client.update({
    where: { id: reminder.client.id },
    data: { dernierAchatAt: new Date() },
  });

  revalidatePath("/app");
}
