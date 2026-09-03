import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getEvidenceById, getSignedFileUrl } from "@/lib/data/evidence";
import { EvidenceDocument } from "@/lib/pdf/EvidenceDocument";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await getEvidenceById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const imageUrl = item.file_path ? await getSignedFileUrl(item.file_path) : null;

  const buffer = await renderToBuffer(
    EvidenceDocument({ items: [{ item, imageUrl }], title: item.title })
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${item.title.replace(/[^a-z0-9 -]/gi, "").slice(0, 60) || "evidence"}.pdf"`,
    },
  });
}
