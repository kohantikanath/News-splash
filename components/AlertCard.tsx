import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmergencyAlert } from "../types/types";

interface AlertCardProps {
  alert: EmergencyAlert;
}

const { width } = Dimensions.get("window");

const getSeverityColor = (severity: "low" | "medium" | "high" | "critical") => {
  switch (severity) {
    case "low":
      return "#FFB800";
    case "medium":
      return "#FF9500";
    case "high":
      return "#FF6B6B";
    case "critical":
      return "#DC2626";
    default:
      return "#999";
  }
};

const getSeverityIcon = (severity: "low" | "medium" | "high" | "critical") => {
  switch (severity) {
    case "critical":
      return "alert-circle";
    case "high":
      return "warning";
    case "medium":
      return "alert";
    default:
      return "information-circle";
  }
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const severityColor = getSeverityColor(alert.severity);
  const severityIcon = getSeverityIcon(alert.severity);
  const date = new Date(alert.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.card, { borderLeftColor: severityColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[styles.iconContainer, { backgroundColor: severityColor }]}
        >
          <Ionicons name={severityIcon as any} size={20} color="#fff" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.cityDate}>
            {alert.city} • {date}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{alert.description}</Text>

      {/* Badge */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: severityColor,
          },
        ]}
      >
        <Text style={styles.badgeText}>{alert.severity.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cityDate: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 10,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
