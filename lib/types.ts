export interface SearchRequest {
  query: string;
}

export interface SearchResult {
  id: string;
  title: string;
  body: string;
}

export interface SearchResponse {
  results: SearchResult[];
  summary?: string;
  sources?: number[];
  message?: string;
  error?: string;
}
