import Link from "next/link";
import { getEvidence, getProfiles, getSignedFileUrl } from "@/lib/data/evidence";
import { CATEGORIES, type Category } from "@/lib/categories";
import { EvidenceCard } from "@/components/EvidenceCard";

export default async function EvidenceListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = CATEGORIES.some((c) => c.value === params.category)
    ? (params.category as Category)
    : undefined;

  const [evidence, profiles] = await Promise.all([
    getEvidence(category ? { category } : undefined),
    getProfiles(),
  ]);
  const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.display_name]));

  const withUrls = await Promise.all(
    evidence.map(async (item) => ({
      item,
      url: item.kind === "photo" && item.file_path ? await getSignedFileUrl(item.file_path) : null,
    }))
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="font-heading text-2xl font-semibold">Browse the archive</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/evidence"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            !category ? "border-foreground bg-foreground text-white" : "border-line hover:bg-cream"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={`/evidence?category=${c.value}`}
            className="rounded-full border px-4 py-1.5 text-sm font-medium transition"
            style={
              category === c.value
                ? { backgroundColor: c.colorVar, borderColor: c.colorVar, color: "white" }
                : { borderColor: "var(--line)", color: "var(--foreground)" }
            }
          >
            {c.label}
          </Link>
        ))}
      </div>

      {withUrls.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">Nothing in this category yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withUrls.map(({ item, url }) => (
            <EvidenceCard
              key={item.id}
              evidence={item}
              imageUrl={url}
              uploaderName={profileMap[item.uploader_id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
