'use client';
import { useState, useRef, useEffect } from "react";
import { Card, Empty, Spin, Tag, Divider, Typography, Space, FloatButton, Tooltip, Grid } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  CrownOutlined,
  BulbOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { useSearch } from "./hooks/useSearch";
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

    const ctx = canvas.getContext('2d');
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
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(180, 180, 197, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 150, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 50%, #16213e 100%)' }}
    />
  );
};




export default function Page() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { search, loading, results, message, summary, sources, clearResults } = useSearch();
  const screens = useBreakpoint();
  const [hasSearched, setHasSearched] = useState(false);


const handleSearch = (value: string) => {
  if (value.trim()) {
    setRecentSearches(prev => [value, ...prev.filter(s => s !== value)].slice(0, 4));
    setHasSearched(true);
    search(value); 
  } else {
    clearResults();
    setHasSearched(true); 
  }
};


  const handleQuickSearch = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">

      <ParticleBackground />

      <div className="fixed top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-75 animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-700">
                <RocketOutlined className="text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" />
              </div>
            </div>
            <div>
              <Title
                level={1}
                className="!mb-3 !text-5xl lg:!text-6xl font-bold 
               bg-gradient-to-r from-red-300 via-white-500 to-pink-500 
               bg-clip-text text-transparent animate-gradient"
              >
                Neural Search
              </Title>
              <Text className="text-cyan-200 text-xl font-light">
                Advanced AI-powered knowledge discovery
              </Text>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <SearchInput
            query={query}
            onChange={setQuery}
            onSearch={handleSearch}
            loading={loading}
          />

          {recentSearches.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <HistoryOutlined className="text-gray-500" />
              <Text className="text-gray-500 text-sm">Recent:</Text>
              <Space size="small">
                {recentSearches.map((searchTerm, index) => (
                  <Text
                    key={index}
                    className="text-gray-400 hover:text-blue-400 text-sm cursor-pointer transition-colors"
                    onClick={() => handleQuickSearch(searchTerm)}
                  >
                    {searchTerm}
                  </Text>
                ))}
              </Space>
            </div>
          )}
        </div>

        {message && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 bg-gray-800/60 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-700/50 shadow-2xl">
              <InfoCircleOutlined className="text-cyan-400 text-lg" />
              <Text className="text-cyan-100 text-lg font-medium">{message}</Text>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Spin
                size="large"
                indicator={
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                    <ThunderboltOutlined className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-xl" />
                  </div>
                }
              />
            </div>
            <Text className="text-gray-400 mt-6 text-lg font-light">
              Scanning neural networks for optimal results...
            </Text>
            <div className="w-64 h-1 bg-gray-700 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {!loading && query && results.length > 0 && (
          <div className="space-y-8">
            {summary && (
              <SummaryCard
                summary={summary}
                sources={sources.map(String)}
              />
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircleOutlined className="text-green-400 text-2xl" />
                </div>
                <div>
                  <Title level={2} className="!mb-1 !text-white">
                    {results.length} Intelligence Result{results.length !== 1 ? 's' : ''}
                  </Title>
                  <Text className="text-gray-400">Ranked by neural relevance</Text>
                </div>
              </div>
              <Tag
                color="blue"
                icon={<FileTextOutlined />}
                className="bg-blue-500/20 border-blue-400/50 text-blue-300 text-lg px-4 py-2 rounded-xl"
              >
                {results.length} neural matches
              </Tag>
            </div>

            <Divider className="!border-gray-700" />

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {results.map((r, index) => (
                <ResultCard
                  key={r.id}
                  title={r.title}
                  body={r.body}
                  index={index + 1}
                  relevance={Math.max(50, 98 - index * 4)}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="flex justify-center py-20">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical" size="large" className="text-center">
                  <div className="text-6xl">🔍</div>
                  <div>
                    <Text className="text-gray-300 text-xl block mb-2">
                      No neural matches found for "{query}"
                    </Text>
                    <Text className="text-gray-500">
                      Try rephrasing your query or explore different keywords
                    </Text>
                  </div>
                  <button
                    onClick={() => handleSearch(query + " tutorial")}
                    className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <BulbOutlined className="mr-2" />
                    Search with "tutorial"
                  </button>
                </Space>
              }
              className="text-gray-400"
            />
          </div>
        )}
      </div>


    </main>
  );
}