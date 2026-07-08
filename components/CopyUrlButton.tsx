"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyUrlButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(`${window.location.origin}/movies/${slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute left-1 top-1 z-10 flex size-6 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}