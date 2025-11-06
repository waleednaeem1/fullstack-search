'use client';
import { useState } from "react";

export type ScrapeResult = {
  title: string;
  metaDescription: string;
  h1: string;
  status: number;
  error?: string;
};

export function useScrape() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScrapeResult | null>(null);
  const [message, setMessage] = useState<string>("");

  const scrape = async (url: string) => {
    setLoading(true);
    setResults(null);
    setMessage("");

    if (!url.trim()) {
      setMessage("Please enter a valid URL.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error or invalid URL");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setMessage("");
    setLoading(false);
  };

  return { scrape, loading, results, message, clearResults };
}
