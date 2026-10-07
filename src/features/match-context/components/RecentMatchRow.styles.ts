import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      minHeight:
        32,

      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        7,
    },

    score: {
      width:
        38,

      alignItems:
        "center",
    },

    scoreText: {
      color:
        "#DDE2E9",

      fontSize:
        10,

      fontWeight:
        "800",
    },

    venue: {
      color:
        "#626B77",

      fontSize:
        7,

      fontWeight:
        "700",
    },

    opponent: {
      flex:
        1,

      color:
        "#9CA5B2",

      fontSize:
        10,
    },

    position: {
      color:
        "#B1A15C",

      fontSize:
        8,

      fontWeight:
        "700",
    },
  });
