import { AdminShell } from "@/components/admin/AdminShell";
import { StitchMcpSetup } from "@/components/admin/StitchMcpSetup";
import Link from "next/link";

export const metadata = {
  title: "Google Stitch & MCP",
};

export const dynamic = "force-dynamic";

export default function AdminStitchPage() {
  const appKey = Boolean(process.env.STITCH_API_KEY?.trim());

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.25em] uppercase text-[var(--muted)]">
          Integrations
        </p>
        <h1 className="mt-2 text-3xl font-light">Google Stitch · MCP</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          Connect Cursor to Google Stitch over HTTP MCP. Keys stay on your machine only
          (Cursor config + optional <code className="rounded px-1">.env.local</code> for
          this app).
        </p>

        <div
          role="status"
          className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--border)] px-5 py-4"
        >
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              appKey ? "bg-green-500" : "bg-amber-500"
            }`}
            aria-hidden
          />
          <div>
            <p className="text-sm font-medium">Next.js server</p>
            <p className="text-xs text-[var(--muted)]">
              {appKey
                ? "STITCH_API_KEY is set — server code can use @google/stitch-sdk."
                : "STITCH_API_KEY not set — add it to .env.local if you call Stitch from API routes."}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-sm font-medium text-amber-900">
            Security
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            If an API key was ever pasted into chat, email, or a public repo, treat it as
            compromised: revoke it and create a new one. Never commit keys to git.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          <StitchMcpSetup />

          <div className="rounded-2xl border border-[var(--border)] p-6">
            <p className="text-sm font-medium">Where to put this in Cursor</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
              <li>Open Cursor Settings → MCP (or edit your MCP config file).</li>
              <li>
                Merge the <code className="rounded px-1">stitch</code> server block from
                the snippet above.
              </li>
              <li>Restart Cursor so the MCP server connects.</li>
            </ol>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Reference file (no secrets):{" "}
              <code className="rounded px-1">docs/cursor-mcp-stitch.example.json</code>
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              <strong className="font-medium text-[var(--foreground)]">
                Export real JSON locally:
              </strong>{" "}
              put your <strong>new</strong> key in{" "}
              <code className="rounded px-1">.env.local</code> as{" "}
              <code className="rounded px-1">STITCH_API_KEY=...</code>, then run in a
              terminal:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs">
              npm run mcp:stitch-export
            </pre>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Copy the printed JSON into Cursor MCP settings. Nothing is written to git.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <a
              href="https://stitch.withgoogle.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Stitch (Google)
            </a>
            <a
              href="https://www.npmjs.com/package/@google/stitch-sdk"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--accent)] underline-offset-4 hover:underline"
            >
              @google/stitch-sdk
            </a>
            <Link
              href="/admin"
              className="text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
            >
              ← Admin overview
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
