"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const relationshipStartDate = String(formData.get("relationship_start_date") ?? "").trim();
  const coupleNote = String(formData.get("couple_note") ?? "").trim();

  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .update({
      relationship_start_date: relationshipStartDate || null,
      couple_note: coupleNote || null,
    })
    .eq("id", true);

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/settings");
  redirect("/settings?saved=1");
}
