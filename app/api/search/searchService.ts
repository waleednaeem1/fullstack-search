import fs from "fs";
import path from "path";

export class SearchService {
  static async getData() {
    const filePath = path.join(process.cwd(), "data", "faqs.json");
    const jsonData = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
  }

  static searchData(query: string, data: any[]) {
    const q = query.toLowerCase();
    return data
      .map((item) => {
        const titleScore = item.title.toLowerCase().includes(q) ? 2 : 0;
        const bodyScore = item.body.toLowerCase().includes(q) ? 1 : 0;
        const score = titleScore + bodyScore;
        return { ...item, score };
      })
      .filter((i) => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  static summarize(results: any[]) {
    if (results.length === 0) return { summary: "", sources: [] };

    const summary = results
      .map((r) => r.body.split(".")[0])
      .slice(0, 3)
      .join(". ") + ".";

    const sources = results.map((r) => r.id);
    return { summary, sources };
  }
}
