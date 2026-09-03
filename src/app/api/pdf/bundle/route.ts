import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { format } from "date-fns";
import { getSignedFileUrl } from "@/lib/data/evidence";
import { EvidenceDocument } from "@/lib/pdf/EvidenceDocument";
import { createClient } from "@/lib/supabase/server";
import type { Evidence } from "@/lib/types";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ids = request.nextUrl.searchParams.getAll("ids");
  if (ids.length === 0) {
    return NextResponse.json({ error: "No items selected" }, { status: 400 });
  }

  const { data, error } = await supabase.from("evidence").select("*").in("id", ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []) as Evidence[];
  const ordered = ids
    .map((id) => rows.find((r) => r.id === id))
    .filter((r): r is Evidence => Boolean(r));

  const items = await Promise.all(
    ordered.map(async (item) => ({
      item,
      imageUrl: item.file_path ? await getSignedFileUrl(item.file_path) : null,
    }))
  );

  const buffer = await renderToBuffer(
    EvidenceDocument({
      items,
      title: "Our Relationship Evidence",
      subtitle: `${items.length} items · compiled ${format(new Date(), "d MMMM yyyy")}`,
    })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="evidence-bundle-${format(new Date(), "yyyy-MM-dd")}.pdf"`,
    },
  });
}
