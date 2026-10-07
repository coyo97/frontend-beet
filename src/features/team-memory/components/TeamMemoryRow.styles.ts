import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        9,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#252A32",
    },

    header: {
      minHeight:
        28,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        10,
    },

    team: {
      flex:
        1,

      color:
        "#D9DEE6",

      fontSize:
        10,

      fontWeight:
        "700",
    },

    summary: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        7,
    },

    historyCount: {
      color:
        "#9AA3AF",

      fontSize:
        10,

      fontWeight:
        "700",
    },

    chevron: {
      color:
        "#737D89",

      fontSize:
        8,
    },

    loading: {
      color:
        "#68717E",
    },

    actions: {
      flexDirection:
        "row",

      gap:
        6,

      marginTop:
        7,
    },
  });
