import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { News } from "../types/types";
import { NewsCard } from "../components/NewsCard";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { newsApi } from "../services/newsApi";
import { useBookmarks } from "../context/BookmarksContext";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NewsFeedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "NewsFeed"
> & {
  route: {
    params: {
      city: string;
      onNewsSelect: (news: News, navigation: any) => void;
      onChangeCity: () => void;
    };
  };
};

export const NewsFeedScreen: React.FC<NewsFeedScreenProps> = ({
  route,
  navigation,
}) => {
  const { city, onNewsSelect, onChangeCity } = route.params;
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isBookmarked, addBookmark, removeBookmark, getBookmarkByUrl } =
    useBookmarks();

  // Fetch news on mount and when city changes
  useEffect(() => {
    fetchNews(true);
  }, [city]);

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoading(true);
        setPage(1);
        setError(null);
      }

      const fetchedNews = await newsApi.fetchNewsByCity(
        city,
        isRefresh ? 1 : page
      );

      if (isRefresh) {
        setNews(fetchedNews);
      } else {
        setNews((prev) => [...prev, ...fetchedNews]);
      }

      setHasMore(fetchedNews.length === 20);
    } catch (err) {
      const errorMessage = "Failed to fetch news. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNews(true);
  }, [city]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchNews(false);
    }
  }, [loading, hasMore, page]);

  const handleBookmark = (newsItem: News) => {
    if (isBookmarked(newsItem.url)) {
      const bookmark = getBookmarkByUrl(newsItem.url);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark(newsItem);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Ionicons name="location" size={24} color="#2563EB" />
        <Text style={styles.title}>{city}</Text>
      </View>
      <TouchableOpacity
        style={styles.changeButton}
        onPress={onChangeCity}
        activeOpacity={0.6}
      >
        <Ionicons name="swap-horizontal" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loading || news.length === 0) return null;
    return <LoadingIndicator size="small" />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="newspaper-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No news found</Text>
        <Text style={styles.emptySubtext}>Try searching for another city</Text>
      </View>
    );
  };

  if (loading && news.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {renderHeader()}
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={news}
        renderItem={({ item }) => (
          <NewsCard
            news={item}
            onPress={() => onNewsSelect(item, navigation)}
            onBookmark={() => handleBookmark(item)}
            isBookmarked={isBookmarked(item.url)}
          />
        )}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
        contentContainerStyle={styles.listContent}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  changeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
