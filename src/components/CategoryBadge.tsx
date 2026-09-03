import { CATEGORY_MAP, type Category } from "@/lib/categories";

export function CategoryBadge({ category }: { category: Category }) {
  const cat = CATEGORY_MAP[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
      style={{ backgroundColor: cat.colorVar }}
    >
      {cat.label}
    </span>
  );
}
