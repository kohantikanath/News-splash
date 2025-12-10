import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { AppNavigator } from "./navigation/AppNavigator";
import { BookmarksScreen } from "./screens/BookmarksScreen";
import { EmergencyAlertsScreen } from "./screens/EmergencyAlertsScreen";
import { BookmarksProvider, useBookmarks } from "./context/BookmarksContext";

type RootTabParamList = {
  Home: undefined;
  Bookmarks: undefined;
  Alerts: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const { loading } = useBookmarks();

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: "#2563EB",
            tabBarInactiveTintColor: "#999",
            tabBarStyle: {
              backgroundColor: "#fff",
              borderTopColor: "#eee",
              borderTopWidth: 1,
              paddingBottom: 20,
              paddingTop: 8,
              height: 75,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",
              marginTop: 2,
            },
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "home";

              if (route.name === "Home") {
                iconName = "newspaper";
              } else if (route.name === "Bookmarks") {
                iconName = "bookmark";
              } else if (route.name === "Alerts") {
                iconName = "alert-circle";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={AppNavigator}
            options={{
              title: "News",
            }}
          />
          <Tab.Screen
            name="Bookmarks"
            component={BookmarksScreen}
            options={{
              title: "Saved",
            }}
          />
          <Tab.Screen
            name="Alerts"
            component={EmergencyAlertsScreen}
            options={{
              title: "Alerts",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <BookmarksProvider>
      <AppContent />
    </BookmarksProvider>
  );
}
