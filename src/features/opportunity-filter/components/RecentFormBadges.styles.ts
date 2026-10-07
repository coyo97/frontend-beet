import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    row: {
      flexDirection:
        "row",

      gap:
        4,
    },

    badge: {
      width:
        20,

      height:
        20,

      borderRadius:
        5,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    win: {
      backgroundColor:
        "#1E5A34",
    },

    draw: {
      backgroundColor:
        "#56502B",
    },

    loss: {
      backgroundColor:
        "#652C33",
    },

    text: {
      color:
        "#FFFFFF",

      fontSize:
        8,

      fontWeight:
        "900",
    },

    empty: {
      color:
        "#59636F",

      fontSize:
        8,
    },
  });
