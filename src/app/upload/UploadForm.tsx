"use client";

import { useState } from "react";
import { CATEGORIES, KINDS, type Category, type Kind } from "@/lib/categories";
import { uploadEvidence } from "./actions";
import { Button } from "@/components/ui";

export function UploadForm({ error }: { error?: string }) {
  const [kind, setKind] = useState<Kind>("photo");
  const [category, setCategory] = useState<Category>("social");

  return (
    <form action={uploadEvidence} className="flex flex-col gap-6">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="category" value={category} />

      <div>
        <span className="mb-2 block text-sm font-medium text-foreground/80">What is it?</span>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              type="button"
              key={k.value}
              onClick={() => setKind(k.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                kind === k.value
                  ? "border-blush-dark bg-blush-dark text-white"
                  : "border-line bg-background-alt text-foreground/70 hover:bg-cream"
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-foreground/80">Category</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setCategory(c.value)}
              title={c.blurb}
              className="rounded-full border px-4 py-2 text-sm font-medium transition"
              style={
                category === c.value
                  ? { backgroundColor: c.colorVar, borderColor: c.colorVar, color: "white" }
                  : { borderColor: "var(--line)", color: "var(--foreground)" }
              }
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {CATEGORIES.find((c) => c.value === category)?.blurb}
        </p>
      </div>

      {kind !== "note" ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground/80">
            {kind === "photo" ? "Photo / screenshot" : "Document"}
          </span>
          <input
            type="file"
            name="file"
            required
            accept={kind === "photo" ? "image/*" : "image/*,application/pdf,.doc,.docx"}
            className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-blush-dark file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
          />
        </label>
      ) : null}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/80">Title</span>
        <input
          type="text"
          name="title"
          required
          maxLength={140}
          placeholder={kind === "note" ? "e.g. How we met" : "e.g. Joint bank statement, March"}
          className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/80">
          {kind === "note" ? "Your note" : "Description (optional)"}
        </span>
        <textarea
          name="description"
          rows={kind === "note" ? 6 : 3}
          required={kind === "note"}
          placeholder={
            kind === "note"
              ? "Write the story, the memory, the context..."
              : "Any context worth remembering"
          }
          className="rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/80">Date</span>
        <input
          type="date"
          name="event_date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="w-fit rounded-xl border border-line bg-cream/40 px-4 py-2.5 text-sm outline-none focus:border-blush-dark focus:ring-2 focus:ring-blush/30"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-blush/10 px-3 py-2 text-sm text-blush-dark">{error}</p>
      )}

      <Button type="submit" className="self-start">
        Save to our archive
      </Button>
    </form>
  );
}
