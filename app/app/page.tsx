import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { addClient } from "@/app/actions/client";
import { createCheckoutSession } from "@/app/actions/stripe";

export default async function AppPage() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { commerce: { include: { clients: true } } },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-corail">Connecté</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-marine">Bienvenue, {user?.email}</h1>
      <form action={createCheckoutSession} className="mt-4">
        <button type="submit" className="rounded-full bg-marine px-6 py-2 text-sm font-semibold text-creme">
          S&apos;abonner -- 25€/mois
        </button>
      </form>
      <form action={addClient} className="mt-8 w-full max-w-sm space-y-3 text-left">
        <input name="nom" placeholder="Nom du client" required className="w-full rounded-lg border border-marine/20 px-4 py-2" />
        <input name="telephone" placeholder="Téléphone" className="w-full rounded-lg border border-marine/20 px-4 py-2" />
        <input name="email" placeholder="Email" className="w-full rounded-lg border border-marine/20 px-4 py-2" />
        <button type="submit" className="w-full rounded-full bg-corail px-6 py-2 text-sm font-semibold text-creme">
          Ajouter un client
        </button>
      </form>
      <ul className="mt-8 w-full max-w-sm space-y-2 text-left text-sm text-marine/80">
        {user?.commerce?.clients.map((client) => (
          <li key={client.id} className="rounded-lg border border-marine/10 px-4 py-2">
            {client.nom} -- {client.telephone || client.email}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-marine/70">Le tableau de bord arrive à l&apos;étape suivante.</p>
      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="rounded-full border border-marine/20 px-6 py-2 text-sm font-semibold text-marine transition hover:bg-marine/5"
        >
          Se déconnecter
        </button>
      </form>
    </main>
  );
}
