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
    from
