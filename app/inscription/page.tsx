import { signup } from "@/app/actions/auth";

export default function InscriptionPage({
  searchParams,
}: {
  searchParams: { erreur?: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-serif text-3xl font-semibold text-marine">
          Créer votre compte
        </h1>
        <p className="mt-2 text-center text-marine/70">
          Commencez gratuitement, sans carte bancaire.
        </p>

        {searchParams.erreur === "existe" && (
          <p className="mt-4 rounded-lg bg-corail/10 px-4 py-3 text-sm text-corail">
            Un compte existe déjà avec cet email.
          </p>
        )}
        {searchParams.erreur === "invalide" && (
          <p className="mt-4 rounded-lg bg-corail/10 px-4 py-3 text-sm text-corail">
            Email invalide ou mot de passe trop court (8 caractères minimum).
          </p>
        )}

        <form action={signup} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-marine">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-marine/20 bg-white px-4 py-3 text-marine outline-none focus:border-corail"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-marine">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-marine/20 bg-white px-4 py-3 text-marine outline-none focus:border-corail"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-corail px-6 py-3 font-semibold text-creme transition hover:opacity-90"
          >
            Créer mon compte
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-marine/70">
          Déjà un compte ?{" "}
          <a href="/connexion" className="font-semibold text-corail">
            Se connecter
          </a>
        </p>
      </div>
    </main>
  );
}
