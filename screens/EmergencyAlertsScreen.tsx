import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmergencyAlert } from "../types/types";
import { AlertCard } from "../components/AlertCard";

// Hardcoded emergency alerts for demonstration
const EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: "1",
    title: "Heavy Traffic Alert",
    description:
      "Major congestion on Main Street due to road construction. Avoid the area if possible.",
    severity: "high",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    city: "New York",
  },
  {
    id: "2",
    title: "Severe Weather Warning",
    description:
      "Thunderstorms expected with heavy rainfall and strong winds. Stay indoors and secure loose items.",
    severity: "critical",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    city: "Los Angeles",
  },
  {
    id: "3",
    title: "Power Outage",
    description:
      "Temporary power outage in downtown area. Utility company working on repairs.",
    severity: "medium",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    city: "Chicago",
  },
  {
    id: "4",
    title: "Water Supply Advisory",
    description:
      "Boil water advisory issued. Use bottled water for consumption.",
    severity: "high",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    city: "Houston",
  },
  {
    id: "5",
    title: "Air Quality Alert",
    description:
      "Air quality index reaching unhealthy levels. Sensitive groups advised to stay indoors.",
    severity: "medium",
    timestamp: new Date().toISOString(),
    city: "Phoenix",
  },
  {
    id: "6",
    title: "Minor Road Accident",
    description:
      "Minor vehicular accident on Highway 101. One lane closed. Expect minor delays.",
    severity: "low",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    city: "San Francisco",
  },
];

export const EmergencyAlertsScreen: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<
    "all" | "critical" | "high" | "medium" | "low"
  >("all");

  const filteredAlerts =
    selectedSeverity === "all"
      ? EMERGENCY_ALERTS
      : EMERGENCY_ALERTS.filter((alert) => alert.severity === selectedSeverity);

  const sortedAlerts = [...filteredAlerts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedBySeverity = [...sortedAlerts].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Emergency Alerts</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {(["all", "critical", "high", "medium", "low"] as const).map(
          (severity) => (
            <TouchableOpacity
              key={severity}
              style={[
                styles.filterButton,
                selectedSeverity === severity && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedSeverity(severity)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedSeverity === severity &&
                    styles.filterButtonTextActive,
                ]}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No Alerts</Text>
      <Text style={styles.emptySubtext}>
        Everything seems fine at the moment
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={sortedBySeverity}
        renderItem={({ item }) => <AlertCard alert={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          sortedBySeverity.length === 0 && styles.emptyList,
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#fff",
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
