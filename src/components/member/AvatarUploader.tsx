"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AvatarUploader({
  userId,
  currentUrl,
  initials
}: {
  userId: string;
  currentUrl: string | null;
  initials: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [url, setUrl] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (upErr) {
      setError(upErr.message);
      setStatus("error");
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setUrl(data.publicUrl);
    setPreview(URL.createObjectURL(file));
    setStatus("idle");
  }

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name="avatar_url" value={url} />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Profile photo"
          className="h-20 w-20 object-cover"
        />
      ) : (
        <span className="flex h-20 w-20 items-center justify-center bg-flame font-display text-2xl text-ink">
          {initials}
        </span>
      )}
      <div>
        <label className="btn-outline cursor-pointer text-lg">
          {status === "uploading" ? "Uploading…" : "Upload Photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPick}
            disabled={status === "uploading"}
          />
        </label>
        {status === "error" && (
          <p className="mt-2 font-body text-xs text-flame">{error}</p>
        )}
        {url && (
          <p className="mt-2 font-body text-xs text-bone/40">
            Photo ready — save to apply.
          </p>
        )}
      </div>
    </div>
  );
}
