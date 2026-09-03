export type Category = "financial" | "household" | "social" | "commitment" | "memory";
export type Kind = "photo" | "document" | "note";

export const CATEGORIES: {
  value: Category;
  label: string;
  blurb: string;
  colorVar: string;
}[] = [
  {
    value: "financial",
    label: "Financial",
    blurb: "Shared accounts, bills, expenses split between you",
    colorVar: "var(--cat-financial)",
  },
  {
    value: "household",
    label: "Household",
    blurb: "Living together — lease, mail, chores, shared address",
    colorVar: "var(--cat-household)",
  },
  {
    value: "social",
    label: "Social",
    blurb: "Known as a couple — friends, family, events, photos",
    colorVar: "var(--cat-social)",
  },
  {
    value: "commitment",
    label: "Commitment",
    blurb: "Future plans and how serious you are about each other",
    colorVar: "var(--cat-commitment)",
  },
  {
    value: "memory",
    label: "Just Us",
    blurb: "Purely sentimental — no visa purpose, just your story",
    colorVar: "var(--cat-memory)",
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c])) as Record<
  Category,
  (typeof CATEGORIES)[number]
>;

export const KINDS: { value: Kind; label: string }[] = [
  { value: "photo", label: "Photo / screenshot" },
  { value: "document", label: "Document (PDF, statement...)" },
  { value: "note", label: "Written note" },
];
