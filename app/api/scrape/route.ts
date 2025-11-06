import { NextResponse } from "next/server";
import { ScrapeService } from "./scrapeService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url || !/^https?:\/\/.+/.test(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const result = await ScrapeService.scrape(url);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Scrape API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
