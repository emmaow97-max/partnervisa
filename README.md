# Our Evidence Box 💌

A private, just-the-two-of-you website for gathering Australian partner visa evidence —
and, since you're building the archive anyway, a bit of a time capsule of your relationship
too.

- **Private** — only accounts you create can log in. There's no public sign-up.
- **Shared** — anything either of you uploads is visible to both of you.
- **Organised** — every entry is tagged against the four things the visa actually
  assesses (financial, household, social, commitment), plus a "Just Us" category for
  pure memories.
- **Exportable** — download any single item, or bundle a selection, as a clean PDF.

Built with Next.js (App Router) + Supabase (auth, database, private file storage).
It's designed to deploy on Vercel with your domain's DNS on Cloudflare — but any host
that runs Next.js will work.

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account/project.
   Pick any name and a strong database password (save it somewhere safe — you won't
   need it day-to-day, Supabase manages the connection for you).
2. Once the project is ready, open **SQL Editor** → **New query**, paste in the
   contents of [`supabase/schema.sql`](./supabase/schema.sql) from this repo, and run
   it. This creates the `evidence`, `profiles` and `app_settings` tables, a private
   `evidence` storage bucket, and the access rules that keep it locked to signed-in
   users only.
3. Go to **Authentication → Providers → Email** and turn **off** "Allow new users to
   sign up". This is what makes the site private — the only way in is an account you
   create yourself.
4. Go to **Authentication → Users → Add user** and create one account for yourself and
   one for Max (email + password each, "Auto Confirm User" on). A `profiles` row is
   created automatically for each — that's what shows "added by [name]" around the
   site. You can edit the `display_name` in the `profiles` table afterwards if you'd
   like it to say something other than the part of the email before the `@`.
5. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key

   You'll need both in the next step.

## 2. Configure the app

Copy `.env.local.example` to `.env.local` and fill in the two values from above:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then run it locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with one of the
accounts you created in Supabase. First thing worth doing: go to **Settings** in the
nav and set the date your relationship began, so the "days together" counter on the
home page has something to count.

## 3. Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Under **Environment Variables**, add the same two variables from your `.env.local`.
4. Deploy. Vercel will give you a `*.vercel.app` URL to confirm everything works.

## 4. Point your domain at it (Cloudflare)

Since your domain is registered through Cloudflare:

1. In Vercel, open your project → **Settings → Domains** → add your domain (e.g.
   `evidence.yourdomain.com` or the bare domain). Vercel will show you the DNS record
   it needs — usually a `CNAME` pointing to `cname.vercel-dns.com` (for a subdomain) or
   an `A` record (for the bare/apex domain).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), open your domain → **DNS
   → Records**, and add exactly the record Vercel showed you.
3. **Important:** set the record's proxy status to **DNS only** (grey cloud, not
   orange) while Vercel issues its SSL certificate. You can switch it to "Proxied"
   (orange cloud) afterwards once Vercel shows the domain as valid, if you want
   Cloudflare's CDN/protection in front of it too — either works.
4. Wait a few minutes for DNS to propagate, then Vercel will mark the domain as
   ready and issue HTTPS automatically.

## Using the site

- **Timeline** (home) — a chronological, month-grouped view of everything you've
  added, plus your days-together counter and category counts.
- **Add** — upload a photo/screenshot, a document, or write a note. Tag it with a
  category and a date.
- **Browse** — filter the archive by category.
- **Export** — tick whichever items you want (e.g. everything under "Financial", or
  a hand-picked selection) and download them as one combined PDF, cover page
  included — handy for a migration agent or the visa application itself.
- Every entry also has its own **Download as PDF** button on its detail page.
- **Settings** — set your relationship start date and a little private note.

## Notes on privacy

- The storage bucket is **private** — files are only ever served via short-lived
  signed URLs generated for a logged-in user, never a public link.
- Both accounts see the same shared archive (uploads aren't siloed to whoever added
  them) — the `uploaded by` label is just for your own reference.
- With public sign-up disabled in Supabase, only the two accounts you create in the
  dashboard can ever log in.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind CSS v4)
- [Supabase](https://supabase.com) — Postgres database, auth, private file storage
- [@react-pdf/renderer](https://react-pdf.org) — PDF generation
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) (headings) +
  [Nunito](https://fonts.google.com/specimen/Nunito) (body)
