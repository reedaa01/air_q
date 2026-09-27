"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

export function ShareCity({ slug, name }: { slug: string; name: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [url, setUrl] = useState("");

  async function copyLink() {
    const link = new URL(`/cities/${encodeURIComponent(slug)}`, window.location.origin).href;
    setUrl(link);
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  }

  return (
    <div className="share-city">
      <button
        type="button"
        className="share-city-button"
        onClick={copyLink}
        aria-label={`Copier le lien de ${name}`}
      >
        {status === "copied" ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <LinkIcon size={16} aria-hidden="true" />
        )}
        Partager cette ville
      </button>
      <span role="status" className={status === "manual" ? "share-help" : "sr-only"}>
        {status === "copied"
          ? "Lien copié."
          : status === "manual"
            ? "Copiez le lien ci-dessous pour partager cette ville."
            : ""}
      </span>
      {status === "manual" && (
        <input
          aria-label={`Lien de partage de ${name}`}
          value={url}
          readOnly
          onFocus={(event) => event.target.select()}
        />
      )}
    </div>
  );
}
