import { notFound } from "next/navigation";
import { getEvidenceById } from "@/lib/data/evidence";
import { CATEGORIES } from "@/lib/categories";
import { Card, Button } from "@/components/ui";
import { updateEvidence } from "../actions";

export default async function EditEvidencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const evidence = await getEvidenceById(id);
  if (!evidence) notFound();

  const updateWithId = updateEvidence.bind(null, evidence.id);

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <h1 className="font-heading text-2xl font-semibold">Edit entry</h1>

      <Card className="mt-6 p-6">
        <form action={updateWithId} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">Category</span>
            <select
              name="category"
              defaultValue={evidence.category}
              className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">Title</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={evidence.title}
              className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">Description / note</span>
            <textarea
              name="description"
              rows={5}
              defaultValue={evidence.description}
              className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">Date</span>
            <input
              type="date"
              name="event_date"
              required
              defaultValue={evidence.event_date}
              className="w-fit rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-blush/10 px-3 py-2 text-sm text-blush-dark">{error}</p>
          )}

          <div className="flex gap-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
