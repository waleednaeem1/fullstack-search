import { JSDOM } from "jsdom";

export class ScrapeService {
  static async scrape(url: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000); // 20s timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "NextMicroScraper/1.0 (+https://example.com)",
        },
      });

      clearTimeout(timeout);

      if (!response.ok)
        return {
          status: response.status,
          error: `Failed to fetch page. Status: ${response.status}`,
        };

      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const title = document.querySelector("title")?.textContent || "";
      const metaDescription =
        document.querySelector("meta[name='description']")?.getAttribute("content") || "";
      const h1 = document.querySelector("h1")?.textContent || "";

      return {
        title,
        metaDescription,
        h1,
        status: response.status,
      };
    } catch (err: any) {
      if (err.name === "AbortError") {
        return { error: "Timeout", status: 504 };
      }
      return { error: "Invalid URL or network error", status: 400 };
    } finally {
      clearTimeout(timeout);
    }
  }
}
