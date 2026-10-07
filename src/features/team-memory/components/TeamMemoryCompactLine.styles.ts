import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      flex:
        1,

      minWidth:
        0,
    },

    right: {
      alignItems:
        "flex-end",
    },

    team: {
      color:
        "#AAB2BE",

      fontSize:
        9,

      fontWeight:
        "700",
    },

    rightText: {
      textAlign:
        "right",
    },

    results: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        3,

      marginTop:
        3,
    },

    win: {
      color:
        "#79C98C",

      fontSize:
        9,

      fontWeight:
        "800",
    },

    loss: {
      color:
        "#DB7A82",

      fontSize:
        9,

      fontWeight:
        "800",
    },

    separator: {
      color:
        "#59616D",

      fontSize:
        8,
    },

    empty: {
      color:
        "#555E6A",

      fontSize:
        8,

      marginTop:
        3,
    },

    loading: {
      color:
        "#626B77",

      fontSize:
        8,

      marginTop:
        3,
    },
  });
