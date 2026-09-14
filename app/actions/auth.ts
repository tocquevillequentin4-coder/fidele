"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password || password.length < 8) {
    redirect("/inscription?erreur=invalide");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/inscription?erreur=existe");
  }

  const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash } });await prisma.commerce.create({ data: { name: "Mon commerce", ownerId: user.id } });

  await createSession(user.id);
  redirect("/app");

}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/connexion?erreur=invalide");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    redirect("/connexion?erreur=invalide");
  }

  await createSession(user.id);
  redirect("/app");
}

export async function logout() {
  await destroySession();
  redirect("/connexion");
}
