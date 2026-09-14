import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const commerces = await prisma.commerce.findMany({
    include: { clients: true },
  });

  let envoyes = 0;

  for (const commerce of commerces) {
    const seuil = new Date();
    seuil.setDate(seuil.getDate() - commerce.delaiRappelJours);

    for (const client of commerce.clients) {
      if (!client.email) continue;
      if (client.dernierAchatAt > seuil) continue;

      const dejaRappele = await prisma.reminder.findFirst({
        where: { clientId: client.id },
        orderBy: { envoyeAt: "desc" },
      });
      if (dejaRappele && dejaRappele.envoyeAt > seuil) continue;

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
        subject: `${commerce.name} pense à vous !`,
        html: `<p>Bonjour ${client.nom},</p><p>Ça fait un moment qu'on ne vous a pas vu chez ${commerce.name}. Revenez nous voir avec ce code pour une offre spéciale : <strong>${code}</strong></p>`,
      });

      envoyes++;
    }
  }

  return NextResponse.json({ envoyes });
}
