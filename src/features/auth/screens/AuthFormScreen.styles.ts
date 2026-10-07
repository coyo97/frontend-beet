import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#090C11",
      justifyContent: "center",
      padding: 24,
    },

    card: {
      padding: 22,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#29313C",
      backgroundColor: "#171C24",
    },

    brand: {
      textAlign: "center",
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: "800",
      color: "#78B5FF",
      marginBottom: 25,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 25,
      fontWeight: "800",
    },

    subtitle: {
      color: "#99A4B2",
      fontSize: 13,
      marginTop: 7,
      marginBottom: 22,
    },

    input: {
      color: "#FFFFFF",
      backgroundColor: "#0C1118",
      borderWidth: 1,
      borderColor: "#333D4B",
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 13,
      marginBottom: 13,
    },

    hint: {
      fontSize: 11,
      color: "#98A3B2",
      marginBottom: 12,
    },

    error: {
      color: "#FF8791",
      fontSize: 12,
      marginBottom: 13,
    },

    submit: {
      minHeight: 48,
      borderRadius: 12,
      backgroundColor: "#E9F1FA",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },

    submitText: {
      color: "#101419",
      fontSize: 14,
      fontWeight: "800",
    },

    link: {
      color: "#8CBFFF",
      textAlign: "center",
      fontSize: 13,
      marginTop: 20,
    },
  });
