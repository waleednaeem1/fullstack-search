'use client';
import { useState, useRef, useEffect } from "react";
import { Card, Empty, Spin, Tag, Divider, Typography, Space, Grid, Segmented } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  HistoryOutlined,
  GlobalOutlined
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

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(8, 8, 24, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
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
        background: "linear-gradient(135deg, #0a0a18 0%, #151528 50%, #1a1a35 100%)",
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

    if (mode === "search" && value.trim()) {
      setRecentSearches(prev => [value, ...prev.filter(s => s !== value)].slice(0, 4));
    }

    if (mode === "search") {
      search(value);  
    } else {
      scrape(value);  
    }

    if (!value.trim()) {
      if (mode === "search") clearSearchResults();
      else clearScrapeResults();
    }
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const handleModeChange = (newMode: "search" | "scrape") => {
    setMode(newMode);
    if (newMode === "search") clearScrapeResults();
    else clearSearchResults();
    setQuery("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 relative overflow-hidden">
      <ParticleBackground />

      <div className="fixed top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gray-900/80 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-gray-700/50">
                {mode === "search" ? 
                  <RocketOutlined className="text-3xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" /> :
                  <GlobalOutlined className="text-3xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" />
                }
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-700 rounded-2xl p-6 px-8">
              <Title level={1} className="!m-0 !text-4xl lg:!text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                {mode === "search" ? "Neural Search" : "Web Scraper"}
              </Title>
              <Text className="text-gray-400 text-xl font-light tracking-wide">
                {mode === "search" 
                  ? "Advanced AI-powered knowledge discovery" 
                  : "Intelligent web content extraction"
                }
              </Text>
            </div>
          </div>

          <Segmented
            options={[
              {
                label: (
                  <div className="flex items-center gap-2 px-3 py-1">
                    <RocketOutlined />
                    <span>AI Search</span>
                  </div>
                ),
                value: "search",
              },
              {
                label: (
                  <div className="flex items-center gap-2 px-3 py-1">
                    <GlobalOutlined />
                    <span>Web Scrape</span>
                  </div>
                ),
                value: "scrape",
              },
            ]}
            value={mode}
            onChange={handleModeChange}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-1"
            size="large"
          />
        </div>

        <div className="mb-8 w-full max-w-4xl mx-auto">
          <SearchInput
            query={query}
            onChange={setQuery}
            onSearch={handleSearch}
            loading={loading}
            mode={mode}
          />
        </div>

        {mode === "search" && recentSearches.length > 0 && (
          <div className="flex justify-center items-center gap-3 mb-8">
            <HistoryOutlined className="text-gray-500 text-lg " />
            <Text className="text-white font-medium bg-gray-100 px-3 rounded-2xl">Recent searches:</Text>
            <Space size="middle">
              {recentSearches.map((term, i) => (
                <Tag
                  key={i}
                  className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-blue-600/20 hover:border-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-300 px-3 py-1 rounded-lg backdrop-blur-sm"
                  onClick={() => handleQuickSearch(term)}
                >
                  {term}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <Spin 
                size="large" 
                indicator={
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
                    <ThunderboltOutlined className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-2xl" />
                  </div>
                } 
              />
            </div>
            <Text className="text-gray-400 text-lg font-light tracking-wide">
              {mode === "search" ? "Scanning neural networks for optimal results..." : "Extracting web content with precision..."}
            </Text>
            <div className="w-80 h-1.5 bg-gray-800 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {!loading && hasSearched && message && (
          <div className="flex justify-center py-16">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size="large" className="text-center">
                  <div className="text-6xl">🔍</div>
                  <Text className="text-gray-800 bg-gray-700 p-4 rounded-2xl text-lg font-medium">{message}!</Text>
                </Space>
              }
            />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="w-full max-w-7xl mx-auto space-y-10">
            {mode === "search" && (
              <>
                {summary && (
                  <SummaryCard 
                    summary={summary} 
                    sources={sources.map(String)} 
                  />
                )}
                
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-2xl">
                      <CheckCircleOutlined className="text-green-400 text-2xl" />
                    </div>
                    <div>
                      <Title level={2} className="!m-0 !text-white">
                        {searchResults.length} Intelligence Result{searchResults.length !== 1 ? 's' : ''}
                      </Title>
                      <Text className="text-gray-400">Ranked by neural relevance</Text>
                    </div>
                  </div>
                  <Tag 
                    color="blue" 
                    icon={<FileTextOutlined />}
                    className="bg-blue-500/20 border-blue-400/50 text-blue-300 text-base px-4 py-2 rounded-xl"
                  >
                    {searchResults.length} matches
                  </Tag>
                </div>

                <Divider className="!border-gray-700/50" />

                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {searchResults.map((r, i) => (
                    <ResultCard
                      key={r.id}
                      title={r.title}
                      body={r.body}
                      index={i + 1}
                      relevance={Math.min(98, 90 + i * 3)}
                    />
                  ))}
                </div>
              </>
            )}

            {mode === "scrape" && scrapeResults && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <Card 
                  className="bg-gray-800/40 backdrop-blur-sm border-gray-700/50 shadow-2xl"
                  bodyStyle={{ padding: '0' }}
                >
                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <FileTextOutlined className="text-blue-400 text-lg" />
                        </div>
                        <div>
                          <Text className="text-gray-400 text-sm font-medium">Page Title</Text>
                          <Text className="text-white text-lg font-semibold block">{scrapeResults.title || "N/A"}</Text>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center p-2">
                          <BulbOutlined className="text-purple-400 text-lg" />
                        </div>
                        <div>
                          <Text className="text-gray-400 text-sm font-medium">Meta Description</Text>
                          <Text className="text-white text-lg block">{scrapeResults.metaDescription || "N/A"}</Text>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                          <InfoCircleOutlined className="text-cyan-400 text-lg" />
                        </div>
                        <div>
                          <Text className="text-gray-400 text-sm font-medium">H1 Heading</Text>
                          <Text className="text-white text-lg font-medium block">{scrapeResults.h1 || "N/A"}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}