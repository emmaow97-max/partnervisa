import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

const NAV = [
  { href: "/", label: "Timeline" },
  { href: "/evidence", label: "Browse" },
  { href: "/upload", label: "Add" },
  { href: "/export", label: "Export" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();
    displayName = profile?.display_name ?? user.email ?? "";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="font-heading text-xl font-semibold text-blush-dark">
          Our Evidence Box
        </Link>

        {user && (
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-cream hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">Hi, {displayName}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-foreground/70 transition hover:bg-cream"
              >
                Log out
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {user && (
        <nav className="flex items-center gap-1 overflow-x-auto border-t border-line px-5 py-2 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/80 hover:bg-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
