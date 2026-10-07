import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      marginTop:
        8,

      borderTopWidth:
        1,

      borderTopColor:
        "#252A32",

      paddingTop:
        5,
    },

    event: {
      paddingVertical:
        9,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#222730",
    },

    eventHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        10,
    },

    outcome: {
      flex:
        1,

      fontSize:
        10,

      fontWeight:
        "800",
    },

    win: {
      color:
        "#78CE8D",
    },

    loss: {
      color:
        "#E77B83",
    },

    delete: {
      color:
        "#C8757B",

      fontSize:
        9,

      fontWeight:
        "700",
    },

    opponent: {
      color:
        "#C7CDD6",

      fontSize:
        10,

      fontWeight:
        "700",

      marginTop:
        5,
    },

    competition: {
      color:
        "#838D9B",

      fontSize:
        9,

      marginTop:
        2,
    },

    date: {
      color:
        "#68717D",

      fontSize:
        8,

      marginTop:
        4,
    },

    registered: {
      color:
        "#555D68",

      fontSize:
        7,

      marginTop:
        2,
    },

    loading: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        8,

      paddingVertical:
        10,
    },

    loadingText: {
      color:
        "#747D89",

      fontSize:
        9,
    },

    empty: {
      color:
        "#646D79",

      fontSize:
        9,

      paddingVertical:
        10,
    },
  });
