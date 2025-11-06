'use client';
import { useState, useRef, useEffect } from "react";
import { Card, Empty, Spin, Tag, Divider, Typography, Space, Grid } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { useSearch } from "./hooks/useSearch";
import { useScrape } from "./hooks/useScrape";
import SearchInput from "./components/SearchInputs";
import ResultCard from "./components/ResultCard";
import SummaryCard from "./components/SummaryCard";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(180,180,197,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,150,255,${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background:
          "linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #16213e 100%)",
      }}
    />
  );
};

export default function Page() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [mode, setMode] = useState<"search" | "scrape">("search");

  const { search, loading: searchLoading, results: searchResults, message: searchMessage, summary, sources, clearResults: clearSearchResults } = useSearch();
  const { scrape, loading: scrapeLoading, results: scrapeResults, message: scrapeMessage, clearResults: clearScrapeResults } = useScrape();

  const screens = useBreakpoint();
  const loading = mode === "search" ? searchLoading : scrapeLoading;
  const results = mode === "search" ? searchResults : scrapeResults ? [scrapeResults] : [];
  const message = mode === "search" ? searchMessage : scrapeMessage;

  const handleSearch = (value: string) => {
    setHasSearched(true);

    if (!value.trim()) {
      if (mode === "search") clearSearchResults();
      else clearScrapeResults();
      return;
    }

    if (mode === "search") {
      setRecentSearches(prev => [value, ...prev.filter(s => s !== value)].slice(0, 4));
      search(value);
    } else {
      scrape(value);
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <ParticleBackground />

      <div className="fixed top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="relative w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
              <RocketOutlined className="text-2xl text-cyan-400" />
            </div>
            <div>
              <Title level={1} className="text-white">
                {mode === "search" ? "Neural Search" : "Web Scraper"}
              </Title>
              <Text className="text-gray-300 text-lg">
                {mode === "search"
                  ? "Advanced AI-powered knowledge discovery"
                  : "Extract page metadata quickly"}
              </Text>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-2">
            <button
              className={`px-4 py-2 rounded ${mode === "search" ? "bg-cyan-400 text-black" : "bg-gray-700 text-gray-300"}`}
              onClick={() => {
                setMode("search");
                clearScrapeResults();
                setQuery("");
              }}
            >
              Search
            </button>
            <button
              className={`px-4 py-2 rounded ${mode === "scrape" ? "bg-cyan-400 text-black" : "bg-gray-700 text-gray-300"}`}
              onClick={() => {
                setMode("scrape");
                clearSearchResults();
                setQuery("");
              }}
            >
              Scrape
            </button>
          </div>
        </div>

        <div className="mb-6 w-full max-w-2xl mx-auto">
          <SearchInput
            query={query}
            onChange={setQuery}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {mode === "search" && recentSearches.length > 0 && (
          <div className="flex justify-center items-center gap-2 mb-6">
            <HistoryOutlined className="text-gray-500" />
            <Text className="text-gray-500 text-sm">Recent:</Text>
            <Space size="small">
              {recentSearches.map((term, i) => (
                <Text
                  key={i}
                  className="text-gray-400 hover:text-blue-400 text-sm cursor-pointer transition-colors"
                  onClick={() => handleQuickSearch(term)}
                >
                  {term}
                </Text>
              ))}
            </Space>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center mt-12">
            <Spin
              size="large"
              indicator={
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                  <ThunderboltOutlined className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-xl" />
                </div>
              }
            />
            <Text className="text-gray-400 mt-4">
              {mode === "search" ? "Scanning neural networks..." : "Fetching page data..."}
            </Text>
          </div>
        )}

        {!loading && hasSearched && message && (
          <div className="mt-12 w-full max-w-2xl mx-auto">
            <Empty
              description={
                <Space direction="vertical" size="large" className="text-center">
                  <div className="text-6xl">ℹ️</div>
                  <Text className="text-gray-300">{message}</Text>
                </Space>
              }
            />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="w-full max-w-7xl mx-auto space-y-8">
            {mode === "search" && (
              <>
                {summary && <SummaryCard summary={summary} sources={sources.map(String)} />}
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mt-10">
                  {searchResults.map((r, i) => (
                    <ResultCard
                      key={r.id}
                      title={r.title}
                      body={r.body}
                      index={i + 1}
                      relevance={Math.min(100, 88 + i * 4)}
                    />
                  ))}
                </div>
              </>
            )}

            {mode === "scrape" && scrapeResults && (
              <div className="space-y-4">
                <Card title="Page Title" className="bg-gray-800 text-white">{scrapeResults.title || "N/A"}</Card>
                <Card title="Meta Description" className="bg-gray-800 text-white">{scrapeResults.metaDescription || "N/A"}</Card>
                <Card title="H1 Heading" className="bg-gray-800 text-white">{scrapeResults.h1 || "N/A"}</Card>
                <Text className="text-gray-400 block">Status: {scrapeResults.status}</Text>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
