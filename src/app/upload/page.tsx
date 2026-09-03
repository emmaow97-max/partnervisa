import { Card } from "@/components/ui";
import { UploadForm } from "./UploadForm";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <h1 className="font-heading text-2xl font-semibold">Add to the archive</h1>
      <p className="mt-1 text-sm text-muted">
        A photo, a document, or just a memory worth keeping.
      </p>

      <Card className="mt-6 p-6">
        <UploadForm />
      </Card>
    </div>
  );
}
