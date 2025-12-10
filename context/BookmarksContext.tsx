import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { News, Bookmark } from "../types/types";

const BOOKMARKS_KEY = "city_pulse_bookmarks";

interface BookmarksContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  addBookmark: (news: News) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (url: string) => boolean;
  getBookmarkByUrl: (url: string) => Bookmark | undefined;
  clearAllBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(
  undefined
);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validBookmarks = parsed.filter(
          (bookmark: Bookmark) =>
            !bookmark.news.image.includes("via.placeholder.com")
        );

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
        console.log(`Loaded ${validBookmarks.length} bookmarks`);
      } else {
        console.log("No bookmarks found in storage");
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (news: News) => {
    try {
      // Check if already bookmarked
      if (bookmarks.some((b) => b.news.url === news.url)) {
        console.log("Article already bookmarked:", news.title);
        return;
      }

      const newBookmark: Bookmark = {
        id: `${Date.now()}`,
        news,
        bookmarkedAt: new Date().toISOString(),
      };

      const updated = [...bookmarks, newBookmark];
      setBookmarks(updated);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      console.log(
        "✅ Bookmark added successfully:",
        news.title,
        "Total bookmarks:",
        updated.length
      );
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const updated = bookmarks.filter((b) => b.id !== id);
      setBookmarks(updated);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      console.log(
        "✅ Bookmark removed successfully. Total bookmarks:",
        updated.length
      );
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const isBookmarked = (url: string): boolean => {
    const result = bookmarks.some((b) => b.news.url === url);
    return result;
  };

  const getBookmarkByUrl = (url: string): Bookmark | undefined => {
    return bookmarks.find((b) => b.news.url === url);
  };

  const clearAllBookmarks = async () => {
    try {
      setBookmarks([]);
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
      console.log("✅ All bookmarks cleared");
    } catch (error) {
      console.error("Error clearing bookmarks:", error);
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        loading,
        addBookmark,
        removeBookmark,
        isBookmarked,
        getBookmarkByUrl,
        clearAllBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within BookmarksProvider");
  }
  return context;
};
