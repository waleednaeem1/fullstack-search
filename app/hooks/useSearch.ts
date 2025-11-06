import { useState } from "react";
import { SearchRequest, SearchResponse, SearchResult } from "../../lib/types";

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");  
  const [sources, setSources] = useState<number[]>([]); 


  const clearResults = () => setResults([]);
  
  const search = async (query: string) => {
    setLoading(true);
    setMessage("");
    setSummary("");
    try {
      const payload: SearchRequest = { query };
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: SearchResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");

      setResults(data.results);
      setMessage(data.message || "");
      setSummary(data.summary || "");
      setSources(data.sources || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, results, message, summary, sources ,clearResults};
}
