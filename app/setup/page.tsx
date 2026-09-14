import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const existing = await prisma.commerce.findUnique({
    where: { ownerId: session.userId },
  });

  if (!existing) {
    await prisma.commerce.create({
      data: { name: "Mon commerce", ownerId: session.userId },
    });
  }

  redirect("/app");
}
