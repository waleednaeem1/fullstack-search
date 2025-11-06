'use client';
import { useState } from "react";
import { Card, Empty, Spin, Typography, Space } from "antd";
import { RocketOutlined, ThunderboltOutlined } from "@ant-design/icons";
import SearchInput from "../components/SearchInputs";
import { useScrape } from "../hooks/useScrape";

const { Title, Text } = Typography;

export default function ScrapePage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const { scrape, loading, results, message, clearResults } = useScrape();

  const handleSearch = (url: string) => {
    setHasSearched(true);
    if (!url.trim()) {
      clearResults();
      return;
    }
    scrape(url);
  };

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center py-12 px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
            <RocketOutlined className="text-2xl text-cyan-400" />
          </div>
          <div>
            <Title level={1} className="text-white">
              Web Scraper
            </Title>
            <Text className="text-gray-300">
              Enter a URL to extract title, meta description, and H1
            </Text>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mb-8">
        <SearchInput
          query={query}
          onChange={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>

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
          <Text className="text-gray-400 mt-4">Fetching page data...</Text>
        </div>
      )}

      {!loading && hasSearched && results && !results.error && (
        <div className="w-full max-w-2xl space-y-6 mt-8">
          <Card title="Page Title" className="bg-gray-800 text-white">{results.title || "N/A"}</Card>
          <Card title="Meta Description" className="bg-gray-800 text-white">{results.metaDescription || "N/A"}</Card>
          <Card title="H1 Heading" className="bg-gray-800 text-white">{results.h1 || "N/A"}</Card>
          <Text className="text-gray-400 block">Status: {results.status}</Text>
        </div>
      )}

      {!loading && hasSearched && results?.error && (
        <div className="mt-12 w-full max-w-2xl">
          <Empty
            description={
              <Space direction="vertical" size="large" className="text-center">
                <div className="text-6xl">⚠️</div>
                <Text className="text-gray-300">{results.error}</Text>
              </Space>
            }
          />
        </div>
      )}

      {!loading && hasSearched && !results && message && (
        <div className="mt-12 w-full max-w-2xl">
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
    </main>
  );
}
