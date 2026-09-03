import type { Category, Kind } from "@/lib/categories";

export type Evidence = {
  id: string;
  uploader_id: string;
  category: Category;
  kind: Kind;
  title: string;
  description: string;
  file_path: string | null;
  file_mime: string | null;
  file_name: string | null;
  event_date: string;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  color: string;
};
