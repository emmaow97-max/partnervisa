import { format } from "date-fns";
import { getEvidence } from "@/lib/data/evidence";
import { CATEGORIES } from "@/lib/categories";
import { Card, Button } from "@/components/ui";
import { SelectAllCheckbox } from "./SelectAllCheckbox";

export default async function ExportPage() {
  const evidence = await getEvidence();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-heading text-2xl font-semibold">Export evidence to PDF</h1>
      <p className="mt-1 text-sm text-muted">
        Pick everything you want in one bundle — great for a visa submission or your migration
        agent.
      </p>

      {evidence.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Nothing to export yet.</p>
      ) : (
        <form action="/api/pdf/bundle" method="GET" className="mt-6 flex flex-col gap-6">
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            <SelectAllCheckbox />
          </div>

          {CATEGORIES.map((cat) => {
            const items = evidence.filter((e) => e.category === cat.value);
            if (items.length === 0) return null;
            return (
              <Card key={cat.value} className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.colorVar }}
                  />
                  <h2 className="font-heading text-base font-semibold">{cat.label}</h2>
                  <span className="text-xs text-muted">({items.length})</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl border border-line px-3 py-2 text-sm hover:bg-cream/50"
                    >
                      <input
                        type="checkbox"
                        name="ids"
                        value={item.id}
                        className="bundle-checkbox accent-[var(--blush-dark)]"
                      />
                      <span className="flex-1">{item.title}</span>
                      <span className="text-xs text-muted">
                        {format(new Date(item.event_date), "d MMM yyyy")}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}

          <div className="sticky bottom-4 flex justify-center">
            <Button type="submit" className="shadow-lg">
              Download selected as PDF
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
