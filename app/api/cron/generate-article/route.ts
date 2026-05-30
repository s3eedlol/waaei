import { NextResponse } from "next/server";
import { generateAndSaveArticle } from "@/lib/ai/generateArticle";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const rawOffset = parseInt(url.searchParams.get("topicOffset") ?? "0", 10);
  const topicOffset = Number.isNaN(rawOffset) ? 0 : rawOffset;

  try {
    const id = await generateAndSaveArticle(undefined, topicOffset);
    if (id === null) {
      return NextResponse.json({ ok: true, message: "All topics already generated", articleId: null });
    }
    return NextResponse.json({ ok: true, articleId: id, topicOffset });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Generation failed", message }, { status: 500 });
  }
}
