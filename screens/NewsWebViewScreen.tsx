import React from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type NewsWebViewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "NewsWebView"
>;

export const NewsWebViewScreen: React.FC<NewsWebViewScreenProps> = ({
  route,
  navigation,
}) => {
  const params = route?.params;

  if (!params || !params.news) {
    // If params are missing, go back
    navigation.goBack();
    return null;
  }

  const { news, onClose, onBookmark, isBookmarked } = params;

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleGoBack}
          activeOpacity={0.6}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={onBookmark}
          activeOpacity={0.6}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isBookmarked ? "#FF6B6B" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: news.url }}
        style={styles.webview}
        startInLoadingState
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerButton: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
});
