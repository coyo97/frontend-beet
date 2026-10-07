import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor:
        "#252B35",
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 10,
    },

    title: {
      color: "#F4F6F8",
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.8,
    },

    counter: {
      color: "#8E99A8",
      fontSize: 12,
      fontWeight: "700",
    },

    sectionLabel: {
      color: "#788391",
      fontSize: 11,
      fontWeight: "700",
      marginBottom: 7,
      marginTop: 4,
    },

    row: {
      gap: 7,
      paddingRight: 18,
      paddingBottom: 9,
    },

    chip: {
      minHeight: 34,
      justifyContent:
        "center",
      paddingHorizontal: 12,
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        "#303743",
      backgroundColor:
        "#151A21",
    },

    chipActive: {
      backgroundColor:
        "#E7EDF5",
      borderColor:
        "#E7EDF5",
    },

    chipActiveSecondary: {
      backgroundColor:
        "#304864",
      borderColor:
        "#496B91",
    },

    chipText: {
      color: "#A5AFBC",
      fontSize: 12,
      fontWeight: "600",
    },

    chipTextActive: {
      color: "#10151B",
      fontWeight: "800",
    },

    filterInfo: {
      color: "#7F8997",
      fontSize: 11,
      marginTop: 2,
    },
  });
