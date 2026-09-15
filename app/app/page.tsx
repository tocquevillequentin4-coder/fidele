import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { addClient } from "@/app/actions/client";
import { createCheckoutSession } from "@/app/actions/stripe";
import { sendReminder, markReminderUsed } from "@/app/actions/reminder";

export default async function AppPage() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { commerce: { include: { clients: true } } },
  });

  const commerceId = user?.commerce?.id;

  const reminders = commerceId
    ? await prisma.reminder.findMany({
        where: { client: { commerceId } },
        include: { client: true },
        orderBy: { envoyeAt: "desc" },
      })
    : [];

  const clientsRevenus = reminders.filter((r) => r.utilisee).length;
  const chiffreGenere = reminders.reduce((sum, r) => sum + (r.montantGenere || 0), 0);
  const remindersEnAttente = reminders.filter((r) => !r.utilisee);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-corail">Connecté</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-marine">Bienvenue, {user?.email}</h1>
      <form action={createCheckoutSession} className="mt-4">
        <button type="submit" className="rounded-full bg-marine px-6 py-2 text-sm font-semibold text-creme">
          S&apos;abonner -- 25€/mois
        </button>
      </form>
      <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
        <div className="rounded-lg border border-marine/10 px-4 py-3">
          <p className="text-2xl font-serif font-semibold text-marine">{clientsRevenus}</p>
          <p className="text-xs text-marine/70">Clients revenus</p>
        </div>
        <div className="rounded-lg border border-marine/10 px-4 py-3">
          <p className="text-2xl font-serif font-semibold text-marine">{chiffreGenere.toFixed(2)}€</p>
          <p className="text-xs text-marine/70">Chiffre généré</p>
        </div>
      </div>

      {remindersEnAttente.length > 0 && (
        <div className="mt-8 w-full max-w-sm text-left">
          <p className="text-sm font-semibold text-marine">Codes en attente</p>
          <ul className="mt-3 space-y-2">
            {remindersEnAttente.map((reminder) => (
              <li key={reminder.id} className="rounded-lg border border-marine/10 px-4 py-3">
                <p className="text-sm text-marine">{reminder.client.nom} -- <span className="font-mono">{reminder.offreCode}</span></p>
                <form action={markReminderUsed} className="mt-2 flex gap-2">
                  <input type="hidden" name="reminderId" value={reminder.id} />
                  <input
                    name="montant"
                    type="number"
                    step="0.01"
                    placeholder="Montant €"
                    className="w-24 rounded-lg border border-marine/20 px-2 py-1 text-sm"
                  />
                  <button type="submit" className="rounded-full bg-corail px-3 py-1 text-xs font-semibold text-creme">
                    Marquer utilisé
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          <li key={client.id} className="flex items-center justify-between gap-3 rounded-lg border border-marine/10 px-4 py-2">
            <span>{client.nom} -- {client.telephone || client.email}</span>
            <form action={sendReminder.bind(null, client.id)}>
              <button type="submit" className="whitespace-nowrap rounded-full border border-corail px-3 py-1 text-xs font-semibold text-corail">
                Envoyer un rappel
              </button>
            </form>
          </li>
        ))}
      </ul>
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
