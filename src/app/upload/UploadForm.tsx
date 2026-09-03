"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, KINDS, type Category, type Kind } from "@/lib/categories";
import { Button } from "@/components/ui";

function isHeic(file: File) {
  const type = file.type.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    /\.hei[cf]$/i.test(file.name)
  );
}

export function UploadForm() {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("photo");
  const [category, setCategory] = useState<Category>("social");
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "converting" | "saving">("idle");
  const submitting = stage !== "idle";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const eventDate =
      String(formData.get("event_date") ?? "") || new Date().toISOString().slice(0, 10);
    const file = formData.get("file");

    if (!title) return setError("Give it a title.");
    if (kind === "note" && !description) return setError("Write your note first.");

    setStage("saving");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      let filePath: string | null = null;
      let fileMime: string | null = null;
      let fileName: string | null = null;

      if (kind !== "note") {
        if (!(file instanceof File) || file.size === 0) {
          setError("Choose a file to upload.");
          return;
        }

        let uploadFile: File | Blob = file;
        let uploadName = file.name;

        if (kind === "photo" && isHeic(file)) {
          setStage("converting");
          try {
            const heic2any = (await import("heic2any")).default;
            const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
            uploadFile = Array.isArray(converted) ? converted[0] : converted;
            uploadName = file.name.replace(/\.\w+$/, "") + ".jpg";
          } catch {
            setError(
              "This iPhone photo (HEIC) couldn't be converted — try sharing it as a JPEG from your Photos app first."
            );
            return;
          }
          setStage("saving");
        }

        const ext = uploadName.includes(".") ? uploadName.split(".").pop() : "";
        const path = `${user.id}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(path, uploadFile, { contentType: uploadFile.type || undefined });
        if (uploadError) {
          setError(uploadError.message);
          return;
        }
        filePath = path;
        fileMime = uploadFile.type || null;
        fileName = uploadName;
      }

      const { error: insertError } = await supabase.from("evidence").insert({
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
      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/?added=1");
      router.refresh();
    } finally {
      setStage("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

      <Button type="submit" disabled={submitting} className="self-start">
        {stage === "converting"
          ? "Converting photo…"
          : stage === "saving"
            ? "Saving…"
            : "Save to our archive"}
      </Button>
    </form>
  );
}
