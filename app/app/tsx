import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default async function AppPage() {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-corail">
        Connecté
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-marine">
        Bienvenue, {user?.email}
      </h1>
      <p className="mt-2 text-marine/70">
        Le tableau de bord arrive à l&apos;étape suivante.
      </p>
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
