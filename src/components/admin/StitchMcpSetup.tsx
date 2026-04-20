"use client";

import { useState } from "react";

const SNIPPET = `{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "PASTE_YOUR_KEY_HERE"
      }
    }
  }
}`;

export function StitchMcpSetup() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--foreground)_3%,transparent)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Cursor MCP snippet</p>
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Paste your key only in Cursor&apos;s local MCP settings — not in git. Replace{" "}
        <code className="rounded px-1">PASTE_YOUR_KEY_HERE</code> with a fresh key.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left text-xs leading-relaxed">
        {SNIPPET}
      </pre>
    </div>
  );
}
