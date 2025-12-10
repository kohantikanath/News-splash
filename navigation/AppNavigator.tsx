import React, { useState, useEffect, useRef } from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { News, Bookmark } from "../types/types";
import { CitySelectorScreen } from "../screens/CitySelectorScreen";
import { NewsFeedScreen } from "../screens/NewsFeedScreen";
import { NewsWebViewScreen } from "../screens/NewsWebViewScreen";
import { BookmarksScreen } from "../screens/BookmarksScreen";
import { EmergencyAlertsScreen } from "../screens/EmergencyAlertsScreen";
import { useBookmarks } from "../context/BookmarksContext";

export type RootStackParamList = {
  CitySelector: { onCitySelect?: (city: string) => void };
  NewsFeed: {
    city: string;
    onNewsSelect?: (news: News, navigation: any) => void;
    onChangeCity?: () => void;
  };
  NewsWebView: {
    news: News;
    onClose: () => void;
    onBookmark: () => void;
    isBookmarked: boolean;
  };
  Bookmarks: {
    onNewsSelect?: (news: News | Bookmark, navigation: any) => void;
  };
  EmergencyAlerts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleChangeCity = () => {
    setSelectedCity(null);
  };

  const handleNewsSelect = (news: News | Bookmark, navigation: any) => {
    console.log("handleNewsSelect called with:", news);
    if ("news" in news) {
      setSelectedBookmark(news);
      setSelectedNews(news.news);
      console.log("Setting bookmark news:", news.news.title);
    } else {
      setSelectedNews(news);
      setSelectedBookmark(null);
      console.log("Setting news:", news.title);
    }
    // Navigate to NewsWebView screen
    navigation.navigate("NewsWebView");
  };

  const handleNewsClose = () => {
    setSelectedNews(null);
    setSelectedBookmark(null);
  };

  const handleBookmarkToggle = () => {
    if (selectedNews) {
      if (isBookmarked(selectedNews.url)) {
        const bookmarkToRemove = selectedBookmark?.id;
        if (bookmarkToRemove) {
          removeBookmark(bookmarkToRemove);
        }
      } else {
        addBookmark(selectedNews);
      }
    }
  };

  useEffect(() => {
    console.log("selectedNews changed:", selectedNews?.title || "null");
    console.log("NewsWebView should render:", selectedNews !== null);
  }, [selectedNews]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {selectedCity === null ? (
        <Stack.Screen name="CitySelector" options={{}}>
          {(props) => (
            <CitySelectorScreen {...props} onCitySelect={handleCitySelect} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="NewsFeed" options={{}}>
            {(props) => (
              <NewsFeedScreen
                {...props}
                route={{
                  ...props.route,
                  params: {
                    city: selectedCity,
                    onNewsSelect: handleNewsSelect,
                    onChangeCity: handleChangeCity,
                  },
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="NewsWebView" options={{}}>
            {(props) => (
              <NewsWebViewScreen
                {...props}
                route={{
                  ...props.route,
                  params: selectedNews
                    ? {
                        news: selectedNews,
                        onClose: handleNewsClose,
                        onBookmark: handleBookmarkToggle,
                        isBookmarked: isBookmarked(selectedNews.url),
                      }
                    : props.route.params,
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Bookmarks" options={{}}>
            {(props) => (
              <BookmarksScreen
                {...props}
                route={{
                  ...props.route,
                  params: { onNewsSelect: handleNewsSelect },
                }}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="EmergencyAlerts"
            component={EmergencyAlertsScreen}
            options={{}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
