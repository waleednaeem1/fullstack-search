export interface FAQ {
  id: string;
  title: string;
  body: string;
}

export interface SearchResult extends FAQ {
  score: number;
}
