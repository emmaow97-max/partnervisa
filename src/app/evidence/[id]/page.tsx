import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getEvidenceById, getProfiles, getSignedFileUrl } from "@/lib/data/evidence";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Card, LinkButton, Button } from "@/components/ui";
import { deleteEvidence } from "./actions";

export default async function EvidenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [evidence, profiles] = await Promise.all([getEvidenceById(id), getProfiles()]);

  if (!evidence) notFound();

  const uploaderName = profiles.find((p) => p.id === evidence.uploader_id)?.display_name;
  const fileUrl = evidence.file_path ? await getSignedFileUrl(evidence.file_path) : null;

  const deleteWithId = deleteEvidence.bind(null, evidence.id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/evidence" className="text-sm text-muted hover:text-blush-dark">
        ← Back to archive
      </Link>

      <Card className="mt-4 overflow-hidden">
        {evidence.kind === "photo" && fileUrl && (
          <div className="relative aspect-[4/3] w-full bg-cream">
            <Image src={fileUrl} alt={evidence.title} fill className="object-contain" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={evidence.category} />
            <span className="text-xs font-medium text-muted">
              {format(new Date(evidence.event_date), "d MMMM yyyy")}
              {uploaderName ? ` · added by ${uploaderName}` : ""}
            </span>
          </div>

          <h1 className="mt-3 font-heading text-2xl font-semibold">{evidence.title}</h1>

          {evidence.description && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
              {evidence.description}
            </p>
          )}

          {evidence.kind === "document" && fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line bg-cream/50 px-4 py-3 text-sm font-medium hover:bg-cream"
            >
              📄 {evidence.file_name ?? "View original document"}
            </a>
          )}

          <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
            <LinkButton href={`/api/pdf/${evidence.id}`} variant="secondary">
              Download as PDF
            </LinkButton>
            <LinkButton href={`/evidence/${evidence.id}/edit`} variant="ghost">
              Edit
            </LinkButton>
            <form action={deleteWithId}>
              <Button
                type="submit"
                variant="ghost"
                className="border-blush-dark/40 text-blush-dark hover:bg-blush/10"
              >
                Delete
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
