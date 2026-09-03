"use client";

export function SelectAllCheckbox() {
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-line bg-background-alt px-3 py-1.5">
      <input
        type="checkbox"
        className="accent-[var(--blush-dark)]"
        onChange={(e) => {
          document
            .querySelectorAll<HTMLInputElement>(".bundle-checkbox")
            .forEach((cb) => (cb.checked = e.target.checked));
        }}
      />
      Select all
    </label>
  );
}
