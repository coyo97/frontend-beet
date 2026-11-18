import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({

    container: {
      marginTop: 12,
      marginBottom: 18,
    },

    title: {
      fontSize: 17,
      fontWeight: "700",
      color: "#E5E7EB",
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 12,
      color: "#9CA3AF",
      marginBottom: 12,
    },

    card: {
      backgroundColor: "#1F2937",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#374151",
      padding: 14,
      marginBottom: 10,
    },

    competition: {
      color: "#9CA3AF",
      fontSize: 11,
      marginBottom: 12,
    },

    teams: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    team: {
      color: "#F9FAFB",
      fontSize: 13,
      fontWeight: "600",
      flex: 1,
      textAlign: "center",
    },

    versus: {
      color: "#6B7280",
      fontSize: 11,
      marginHorizontal: 10,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 14,
      gap: 8,
    },

    kickoff: {
      color: "#D1D5DB",
      fontSize: 12,
    },

    countdown: {
      color: "#67E8F9",
      fontSize: 12,
      fontWeight: "700",
      flexShrink: 1,
      textAlign: "right",
    },

  });
