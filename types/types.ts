export interface News {
  title: string;
  description: string;
  image: string;
  url: string;
  date: string;
  source?: string;
  content?: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: News[];
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  city: string;
}

export interface Bookmark {
  id: string;
  news: News;
  bookmarkedAt: string;
}
