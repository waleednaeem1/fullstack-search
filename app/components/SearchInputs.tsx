import { Input, Button } from "antd";
import { ThunderboltOutlined, RocketOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Search } = Input;

type Props = {
  query: string;
  onChange: (v: string) => void;
  onSearch: (v: string) => void;
  loading: boolean;
};

export default function SearchInput({ query, onChange, onSearch, loading }: Props) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  const handleSearch = () => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
    onSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <Search
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask complex questions... (e.g., How to optimize database performance?)"
          enterButton={
            <Button
              type="primary"
              size="large"
              icon={loading ? <ThunderboltOutlined spin /> : <RocketOutlined />}
              loading={loading}
              onClick={handleSearch}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {loading ? "Analyzing..." : "Explore"}
            </Button>
          }
          size="large"
          loading={loading}
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: isFocused ? '0 8px 32px rgba(59, 130, 246, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onPressEnter={handleSearch}
          className="professional-search-input"
        />
      </div>
    </div>
  );
}
