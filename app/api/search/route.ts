import { NextResponse } from "next/server";
import { SearchSchema } from "@/lib/validation";
import { SearchService } from "./searchService";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = SearchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { query } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/faqs.json`, {
      cache: "no-store", // disable caching for fresh reads
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to load data file" }, { status: 500 });
    }

    const faqs = await res.json();
    
    const results = SearchService.searchData(query, faqs);
    if (results.length === 0) {
      return NextResponse.json({ message: "No matches found", results: [] });
    }

    const { summary, sources } = SearchService.summarize(results);
    console.log(summary);
    
    return NextResponse.json({ results, summary, sources });
  } catch (err: any) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
