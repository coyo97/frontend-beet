
import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      padding: 16,
      borderRadius: 16,
      backgroundColor: "#171C27",
      gap: 12,
    },

    title: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 17,
    },

    description: {
      color: "#C5CBD5",
      fontSize: 13,
      lineHeight: 20,
    },

    info: {
      backgroundColor: "#222B3B",
      padding: 12,
      borderRadius: 10,
      gap: 6,
    },

    infoText: {
      color: "#DCE4EF",
      fontSize: 12,
    },

    deviceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#303846",
    },

    deviceInfo: {
      flex: 1,
      paddingRight: 12,
      gap: 4,
    },

    deviceName: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },

    deviceStatus: {
      color: "#98A4B7",
      fontSize: 12,
    },

    muted: {
      color: "#98A4B7",
      fontSize: 13,
      lineHeight: 20,
    },

    errorArea: {
      gap: 8,
    },

    error: {
      color: "#FCA5A5",
      fontSize: 12,
    },

    retry: {
      color: "#7DD3FC",
      fontSize: 13,
      fontWeight: "600",
    },

    footer: {
      color: "#98A4B7",
      fontSize: 11,
      lineHeight: 17,
    },
  });

