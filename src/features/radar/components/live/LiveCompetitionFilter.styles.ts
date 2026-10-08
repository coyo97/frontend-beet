import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      paddingHorizontal: 14,
      paddingTop: 8,
      paddingBottom: 6,

      borderBottomWidth: 1,

      borderBottomColor:
        "#202630",
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginBottom: 6,
    },

    title: {
      color:
        "#F4F6F8",

      fontSize: 13,

      fontWeight:
        "800",

      letterSpacing:
        0.5,
    },

    counter: {
      color:
        "#8792A2",

      fontSize: 12,

      fontWeight:
        "700",
    },

    sectionLabel: {
      color:
        "#7E8999",

      fontSize: 11,

      fontWeight:
        "700",

      marginTop: 2,

      marginBottom: 4,
    },

    row: {
      gap: 6,

      paddingRight: 14,

      paddingBottom: 5,
    },

    chip: {
      minHeight: 30,

      justifyContent:
        "center",

      paddingHorizontal: 11,

      borderRadius: 15,

      borderWidth: 1,

      borderColor:
        "#303744",

      backgroundColor:
        "#151A21",
    },

    chipActive: {
      backgroundColor:
        "#E5EDF6",

      borderColor:
        "#E5EDF6",
    },

    chipActiveSecondary: {
      backgroundColor:
        "#2D4D70",

      borderColor:
        "#456F9B",
    },

    chipText: {
      color:
        "#A2ACB9",

      fontSize: 11,

      fontWeight:
        "600",
    },

    chipTextActive: {
      color:
        "#11161C",

      fontWeight:
        "800",
    },

    chipTextActiveSecondary: {
      color:
        "#F4F8FC",

      fontWeight:
        "800",
    },

    filterInfo: {
      color:
        "#727D8C",

      fontSize: 10,

      marginTop: 1,

      marginBottom: 1,
    },
  });
