import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
});

/** Optional OpenAI tagging — returns suggested tags when OPENAI_API_KEY is set. */
export async function POST(req: Request) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({
        tags: inferHeuristicTags(parsed.data),
        source: "heuristic",
      });
    }
    const prompt = `Suggest 5-8 short lowercase tags (single words or hyphenated) for an artwork listing. Title: ${parsed.data.title}. Description: ${parsed.data.description ?? ""}. Category: ${parsed.data.category ?? ""}. Respond with JSON only: {"tags":["tag1","tag2"]}`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({
        tags: inferHeuristicTags(parsed.data),
        source: "heuristic",
      });
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content ?? "{}";
    const parsedJson = JSON.parse(text) as { tags?: string[] };
    const tags = Array.isArray(parsedJson.tags) ? parsedJson.tags : [];
    return NextResponse.json({ tags, source: "openai" });
  } catch {
    return NextResponse.json({ error: "Tagging failed" }, { status: 500 });
  }
}

function inferHeuristicTags(input: {
  title: string;
  description?: string;
  category?: string;
}): string[] {
  const base = new Set<string>();
  if (input.category) base.add(input.category.toLowerCase());
  const words = `${input.title} ${input.description ?? ""}`
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);
  for (const w of words.slice(0, 6)) base.add(w);
  return [...base].slice(0, 8);
}
