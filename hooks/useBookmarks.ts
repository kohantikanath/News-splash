import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { News, Bookmark } from "../types/types";

const BOOKMARKS_KEY = "city_pulse_bookmarks";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from AsyncStorage on app start
  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter out bookmarks with invalid placeholder images
        const validBookmarks = parsed.filter(
          (bookmark: Bookmark) =>
            !bookmark.news.image.includes("via.placeholder.com")
        );

        // If we filtered out any bookmarks, update storage
        if (validBookmarks.length !== parsed.length) {
          console.log(
            `Cleaned up ${
              parsed.length - validBookmarks.length
            } bookmarks with invalid images`
          );
          await AsyncStorage.setItem(
            BOOKMARKS_KEY,
            JSON.stringify(validBookmarks)
          );
        }

        setBookmarks(validBookmarks);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (news: News) => {
    try {
      const newBookmark: Bookmark = {
        id: `${Date.now()}`,
        news,
        bookmarkedAt: new Date().toISOString(),
      };

      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      console.log("Bookmark added successfully:", newBookmark.news.title);
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const updated = bookmarks.filter((b) => b.id !== id);
      setBookmarks(updated);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      console.log("Bookmark removed successfully, ID:", id);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const isBookmarked = (url: string): boolean => {
    return bookmarks.some((b) => b.news.url === url);
  };

  const getBookmarkByUrl = (url: string): Bookmark | undefined => {
    return bookmarks.find((b) => b.news.url === url);
  };

  const clearAllBookmarks = async () => {
    try {
      setBookmarks([]);
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (error) {
      console.error("Error clearing bookmarks:", error);
    }
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarkByUrl,
    clearAllBookmarks,
  };
};
