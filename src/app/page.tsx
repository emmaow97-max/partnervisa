import Link from "next/link";
import { differenceInCalendarDays, intervalToDuration, format } from "date-fns";
import { getAppSettings, getEvidence, getProfiles, getSignedFileUrl } from "@/lib/data/evidence";
import { CATEGORIES } from "@/lib/categories";
import { EvidenceCard } from "@/components/EvidenceCard";
import { LinkButton } from "@/components/ui";

export default async function HomePage() {
  const [evidence, profiles, settings] = await Promise.all([
    getEvidence(),
    getProfiles(),
    getAppSettings(),
  ]);

  const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.display_name]));

  const withUrls = await Promise.all(
    evidence.slice(0, 60).map(async (item) => ({
      item,
      url: item.kind === "photo" && item.file_path ? await getSignedFileUrl(item.file_path) : null,
    }))
  );

  const groups = new Map<string, typeof withUrls>();
  for (const entry of withUrls) {
    const key = format(new Date(entry.item.event_date), "MMMM yyyy");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }

  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.value, 0])) as Record<
    string,
    number
  >;
  for (const item of evidence) counts[item.category] = (counts[item.category] ?? 0) + 1;

  let daysCounter: { days: number; duration: string } | null = null;
  if (settings.relationship_start_date) {
    const start = new Date(settings.relationship_start_date);
    const days = differenceInCalendarDays(new Date(), start);
    const dur = intervalToDuration({ start, end: new Date() });
    const parts = [];
    if (dur.years) parts.push(`${dur.years} yr${dur.years > 1 ? "s" : ""}`);
    if (dur.months) parts.push(`${dur.months} mo${dur.months > 1 ? "s" : ""}`);
    if (!dur.years) parts.push(`${dur.days} day${dur.days !== 1 ? "s" : ""}`);
    daysCounter = { days, duration: parts.join(", ") };
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <section className="mb-10 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-blush/15 via-background-alt to-sage/10 p-8 text-center sm:p-12">
        <p className="mb-2 text-3xl">💛</p>
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Every little piece of &ldquo;us&rdquo;
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted sm:text-base">
          A private archive of our life together — and everything we need for the partner visa.
        </p>

        {daysCounter ? (
          <div className="mt-6 inline-flex flex-col items-center gap-1 rounded-2xl bg-background-alt/70 px-6 py-4">
            <span className="font-heading text-2xl font-semibold text-blush-dark">
              {daysCounter.days.toLocaleString()} days together
            </span>
            <span className="text-xs text-muted">that&apos;s {daysCounter.duration} ✨</span>
          </div>
        ) : (
          <Link
            href="/settings"
            className="mt-6 inline-block text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-blush-dark"
          >
            Set your anniversary date to start the counter
          </Link>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/upload">+ Add evidence</LinkButton>
          <LinkButton href="/export" variant="secondary">
            Export PDFs
          </LinkButton>
        </div>
      </section>

      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/evidence?category=${cat.value}`}
            className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-background-alt/70 px-3 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className="text-2xl font-bold"
              style={{ color: cat.colorVar }}
            >
              {counts[cat.value] ?? 0}
            </span>
            <span className="text-xs font-medium text-muted">{cat.label}</span>
          </Link>
        ))}
      </section>

      {evidence.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-background-alt/50 px-6 py-16 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-3 font-heading text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">
            Start your archive by adding your first piece of evidence.
          </p>
          <LinkButton href="/upload" className="mt-5">
            + Add your first entry
          </LinkButton>
        </div>
      ) : (
        <section className="flex flex-col gap-10">
          {Array.from(groups.entries()).map(([month, items]) => (
            <div key={month}>
              <h2 className="mb-4 font-heading text-lg font-semibold text-foreground/80">
                {month}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(({ item, url }) => (
                  <EvidenceCard
                    key={item.id}
                    evidence={item}
                    imageUrl={url}
                    uploaderName={profileMap[item.uploader_id]}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
