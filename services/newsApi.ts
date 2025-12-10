import axios from "axios";
import { News, NewsApiResponse } from "../types/types";

const API_KEY = "2ba569f53402415cb7de41b943fb8383"; // Replace with your NewsAPI.org key
const BASE_URL = "https://newsapi.org/v2";

export const newsApi = {
  /**
   * Fetch news articles for a specific city
   * @param city - City name to search for news
   * @param page - Page number for pagination
   */
  fetchNewsByCity: async (city: string, page: number = 1): Promise<News[]> => {
    try {
      const response = await axios.get<NewsApiResponse>(
        `${BASE_URL}/everything`,
        {
          params: {
            q: city,
            sortBy: "publishedAt",
            language: "en",
            pageSize: 20,
            page: page,
            apiKey: API_KEY,
          },
        }
      );

      if (response.data.status === "ok") {
        return response.data.articles.map((article: any) => ({
          title: article.title || "No title",
          description: article.description || "No description available",
          image:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
          url: article.url || "",
          date: new Date(article.publishedAt || new Date()).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
          source:
            typeof article.source === "object"
              ? article.source?.name
              : article.source || "Unknown",
          content: article.content || "",
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  /**
   * Search for news with custom query
   */
  searchNews: async (query: string, page: number = 1): Promise<News[]> => {
    try {
      const response = await axios.get<NewsApiResponse>(
        `${BASE_URL}/everything`,
        {
          params: {
            q: query,
            sortBy: "publishedAt",
            language: "en",
            pageSize: 20,
            page: page,
            apiKey: API_KEY,
          },
        }
      );

      if (response.data.status === "ok") {
        return response.data.articles.map((article: any) => ({
          title: article.title || "No title",
          description: article.description || "No description available",
          image:
            article.urlToImage ||
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
          url: article.url || "",
          date: new Date(article.publishedAt || new Date()).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
          source:
            typeof article.source === "object"
              ? article.source?.name
              : article.source || "Unknown",
          content: article.content || "",
        }));
      }
      return [];
    } catch (error) {
      console.error("Error searching news:", error);
      throw error;
    }
  },
};
