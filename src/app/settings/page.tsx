import { getAppSettings } from "@/lib/data/evidence";
import { updateSettings } from "@/lib/actions/settings";
import { Card, Button } from "@/components/ui";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [settings, params] = await Promise.all([getAppSettings(), searchParams]);

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-heading text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted">Little details that make this feel like yours.</p>

      <Card className="mt-6 p-6">
        <form action={updateSettings} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">
              When did your relationship begin?
            </span>
            <input
              type="date"
              name="relationship_start_date"
              defaultValue={settings.relationship_start_date ?? ""}
              className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
            />
            <span className="text-xs text-muted">Powers the days-together counter on your timeline.</span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">A little note (optional)</span>
            <textarea
              name="couple_note"
              defaultValue={settings.couple_note ?? ""}
              rows={3}
              className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
              placeholder="Something sweet, just for the two of you"
            />
          </label>

          {params.saved && (
            <p className="rounded-xl bg-sage/10 px-3 py-2 text-sm text-sage-dark">Saved ✓</p>
          )}
          {params.error && (
            <p className="rounded-xl bg-blush/10 px-3 py-2 text-sm text-blush-dark">
              {params.error}
            </p>
          )}

          <Button type="submit" className="self-start">
            Save
          </Button>
        </form>
      </Card>
    </div>
  );
}
