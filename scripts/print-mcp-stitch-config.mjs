/**
 * Prints a Cursor MCP JSON snippet using STITCH_API_KEY from .env.local.
 * Run: npm run mcp:stitch-export
 * Copy output into Cursor MCP settings — do not commit keys to git.
 */

import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

const key = process.env.STITCH_API_KEY?.trim();
const url =
  process.env.STITCH_MCP_URL?.trim() || "https://stitch.googleapis.com/mcp";

if (!key) {
  console.error(
    "Missing STITCH_API_KEY. Add it to .env.local (see .env.example), then run again."
  );
  process.exit(1);
}

const out = {
  mcpServers: {
    stitch: {
      url,
      headers: {
        "X-Goog-Api-Key": key,
      },
    },
  },
};

console.log(JSON.stringify(out, null, 2));
