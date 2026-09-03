"use client";

export function SelectAllCheckbox({
  category,
  label = "Select all",
}: {
  category?: string;
  label?: string;
}) {
  const selector = category
    ? `.bundle-checkbox[data-category="${category}"]`
    : ".bundle-checkbox";

  return (
    <label className="flex items-center gap-1.5 rounded-full border border-line bg-background-alt px-3 py-1.5 text-xs text-muted">
      <input
        type="checkbox"
        className="accent-[var(--blush-dark)]"
        onChange={(e) => {
          document
            .querySelectorAll<HTMLInputElement>(selector)
            .forEach((cb) => (cb.checked = e.target.checked));
        }}
      />
      {label}
    </label>
  );
}
