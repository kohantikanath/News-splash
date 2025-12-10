import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Bookmark, News } from "../types/types";
import { NewsCard } from "../components/NewsCard";
import { useBookmarks } from "../context/BookmarksContext";

interface BookmarksScreenProps {
  navigation?: any;
  route?: {
    params?: {
      onNewsSelect?: (news: News | Bookmark, navigation: any) => void;
    };
  };
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  navigation,
  route,
}) => {
  const onNewsSelect = route?.params?.onNewsSelect;
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmarks();

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Bookmarks",
      "Are you sure you want to remove all bookmarks?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Clear",
          onPress: clearAllBookmarks,
          style: "destructive",
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Bookmarks</Text>
      {bookmarks.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
          activeOpacity={0.6}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No Bookmarks Yet</Text>
      <Text style={styles.emptySubtext}>
        Bookmark your favorite news articles to read them later
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <View>
            <NewsCard
              news={item.news}
              onPress={() =>
                onNewsSelect && navigation && onNewsSelect(item, navigation)
              }
              onBookmark={() => handleRemoveBookmark(item.id)}
              isBookmarked={true}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          bookmarks.length === 0 && styles.emptyList,
        ]}
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
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  clearButton: {
    padding: 8,
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
