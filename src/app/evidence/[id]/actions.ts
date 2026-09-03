"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/categories";

const CATEGORY_VALUES: Category[] = ["financial", "household", "social", "commitment", "memory"];

export async function updateEvidence(id: string, formData: FormData) {
  const supabase = await createClient();

  const category = String(formData.get("category") ?? "") as Category;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "");

  if (!title || !CATEGORY_VALUES.includes(category) || !eventDate) {
    redirect(`/evidence/${id}/edit?error=${encodeURIComponent("Fill in all required fields.")}`);
  }

  const { error } = await supabase
    .from("evidence")
    .update({ category, title, description, event_date: eventDate })
    .eq("id", id);

  if (error) {
    redirect(`/evidence/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/evidence");
  revalidatePath(`/evidence/${id}`);
  redirect(`/evidence/${id}`);
}

export async function deleteEvidence(id: string) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("evidence")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  if (item?.file_path) {
    await supabase.storage.from("evidence").remove([item.file_path]);
  }

  await supabase.from("evidence").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/evidence");
  redirect("/evidence");
}
