import { createClient } from "@/lib/supabase/server";
import type { Evidence, Profile } from "@/lib/types";
import type { Category } from "@/lib/categories";

const SIGNED_URL_TTL = 60 * 60; // 1 hour

export async function getEvidence(filters?: { category?: Category }) {
  const supabase = await createClient();
  let query = supabase
    .from("evidence")
    .select("*")
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Evidence[];
}

export async function getEvidenceById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("evidence").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Evidence | null;
}

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function getSignedFileUrl(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("evidence")
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error) throw error;
  return data.signedUrl;
}

export async function getAppSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("relationship_start_date, couple_note")
    .maybeSingle();
  return data ?? { relationship_start_date: null, couple_note: null };
}
