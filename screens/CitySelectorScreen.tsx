import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type CitySelectorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CitySelector"
> & {
  onCitySelect: (city: string) => void;
};

const POPULAR_CITIES = [
  "New York",
  "Los Angeles",
  "London",
  "Tokyo",
  "Dubai",
  "Paris",
  "Sydney",
  "Berlin"
];

const { width } = Dimensions.get("window");

export const CitySelectorScreen: React.FC<CitySelectorScreenProps> = ({
  navigation,
  onCitySelect,
}) => {
  const [customCity, setCustomCity] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelectCity = (city: string) => {
    if (city.trim()) {
      onCitySelect(city);
      setCustomCity("");
      setShowCustomInput(false);
    }
  };

  const renderCityButton = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.cityButton}
      onPress={() => handleSelectCity(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="location" size={20} color="#2563EB" />
      <Text style={styles.cityButtonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select a City</Text>
        <Text style={styles.headerSubtitle}>
          Choose a city to get started with news
        </Text>
      </View>

      {/* Popular Cities List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Cities</Text>
        <FlatList
          data={POPULAR_CITIES}
          renderItem={renderCityButton}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          contentContainerStyle={styles.citiesGrid}
        />
      </View>

      {/* Custom City Button */}
      {/* <TouchableOpacity
        style={styles.customButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.customButtonText}>Search Custom City</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  citiesGrid: {
    gap: 10,
  },
  cityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cityButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
