import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";

export async function preparePdfImage(filePath: string): Promise<Buffer | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("evidence").download(filePath);
  if (error || !data) return null;

  try {
    const bytes = Buffer.from(await data.arrayBuffer());
    return await sharp(bytes)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch {
    return null;
  }
}
