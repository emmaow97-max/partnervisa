import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Evidence } from "@/lib/types";

const KIND_ICON: Record<Evidence["kind"], string> = {
  photo: "📷",
  document: "📄",
  note: "📝",
};

export function EvidenceCard({
  evidence,
  imageUrl,
  uploaderName,
}: {
  evidence: Evidence;
  imageUrl?: string | null;
  uploaderName?: string;
}) {
  return (
    <Link
      href={`/evidence/${evidence.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-background-alt/80 shadow-[0_2px_12px_rgba(150,100,90,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(150,100,90,0.15)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
        {evidence.kind === "photo" && imageUrl ? (
          <Image
            src={imageUrl}
            alt={evidence.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
            <span className="text-4xl">{KIND_ICON[evidence.kind]}</span>
          </div>
        )}
        <div className="absolute left-2 top-2">
          <CategoryBadge category={evidence.category} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium text-muted">
          {format(new Date(evidence.event_date), "d MMM yyyy")}
          {uploaderName ? ` · ${uploaderName}` : ""}
        </span>
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
          {evidence.title}
        </h3>
        {evidence.description && (
          <p className="line-clamp-2 text-sm text-muted">{evidence.description}</p>
        )}
      </div>
    </Link>
  );
}
