import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">💌</div>
          <h1 className="font-heading text-3xl font-semibold text-blush-dark">
            Our Evidence Box
          </h1>
          <p className="mt-2 text-sm text-muted">
            A private space, just for the two of you.
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-background-alt/90 p-7 shadow-[0_4px_24px_rgba(150,100,90,0.1)]">
          <form action={signIn} className="flex flex-col gap-4">
            <input type="hidden" name="next" value={params.next ?? "/"} />

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground/80">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground/80">Password</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
                placeholder="••••••••"
              />
            </label>

            {params.error && (
              <p className="rounded-xl bg-blush/10 px-3 py-2 text-sm text-blush-dark">
                {params.error}
              </p>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-blush-dark px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blush active:scale-[0.98]"
            >
              Log in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Accounts are created by an admin — there&apos;s no public sign-up here.
        </p>
      </div>
    </div>
  );
}
