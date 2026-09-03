"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, Kind } from "@/lib/categories";

const CATEGORY_VALUES: Category[] = ["financial", "household", "social", "commitment", "memory"];
const KIND_VALUES: Kind[] = ["photo", "document", "note"];

export async function uploadEvidence(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const kind = String(formData.get("kind") ?? "") as Kind;
  const category = String(formData.get("category") ?? "") as Category;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventDateRaw = String(formData.get("event_date") ?? "");
  const eventDate = eventDateRaw || new Date().toISOString().slice(0, 10);
  const file = formData.get("file");

  const fail = (message: string) => redirect(`/upload?error=${encodeURIComponent(message)}`);

  if (!KIND_VALUES.includes(kind)) return fail("Choose a valid type.");
  if (!CATEGORY_VALUES.includes(category)) return fail("Choose a category.");
  if (!title) return fail("Give it a title.");
  if (kind === "note" && !description) return fail("Write your note first.");

  let filePath: string | null = null;
  let fileMime: string | null = null;
  let fileName: string | null = null;

  if (kind !== "note") {
    if (!(file instanceof File) || file.size === 0) {
      return fail("Choose a file to upload.");
    }
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const path = `${user.id}/${randomUUID()}${ext ? `.${ext}` : ""}`;
    const { error: uploadError } = await supabase.storage
      .from("evidence")
      .upload(path, file, { contentType: file.type || undefined });
    if (uploadError) return fail(uploadError.message);
    filePath = path;
    fileMime = file.type || null;
    fileName = file.name;
  }

  const { error } = await supabase.from("evidence").insert({
    uploader_id: user.id,
    category,
    kind,
    title,
    description,
    file_path: filePath,
    file_mime: fileMime,
    file_name: fileName,
    event_date: eventDate,
  });

  if (error) return fail(error.message);

  revalidatePath("/");
  revalidatePath("/evidence");
  redirect("/?added=1");
}
