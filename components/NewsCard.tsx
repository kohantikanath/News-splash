import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { News } from "../types/types";
import { Ionicons } from "@expo/vector-icons";

interface NewsCardProps {
  news: News;
  onPress: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}

const { width } = Dimensions.get("window");
const cardWidth = width - 32;

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onPress,
  onBookmark,
  isBookmarked,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Image */}
      <Image
        source={{ uri: news.image }}
        style={styles.image}
        onError={(e) => {
          console.log("Image error:", e.nativeEvent.error);
        }}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {news.description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.dateSource}>
            <Ionicons name="calendar" size={14} color="#666" />
            <Text style={styles.date}>{news.date}</Text>
            {news.source && (
              <>
                <Text style={styles.dot}> • </Text>
                <Text style={styles.source} numberOfLines={1}>
                  {news.source}
                </Text>
              </>
            )}
          </View>

          {/* Bookmark Button */}
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={onBookmark}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isBookmarked ? "#FF6B6B" : "#999"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateSource: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  dot: {
    color: "#ccc",
  },
  source: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "600",
    flex: 1,
  },
  bookmarkBtn: {
    padding: 8,
    marginLeft: 8,
  },
});
