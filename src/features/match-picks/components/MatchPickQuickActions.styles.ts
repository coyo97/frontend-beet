import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      gap:
        6,

      marginTop:
        7,

      marginBottom:
        4,
    },

    button: {
      flex:
        1,

      minHeight:
        31,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        7,

      borderWidth:
        1,

      borderColor:
        "#303846",

      borderRadius:
        8,

      backgroundColor:
        "#151A21",
    },

    selected: {
      backgroundColor:
        "#222B48",

      borderColor:
        "#657AD1",
    },

    text: {
      color:
        "#AEB7C4",

      fontSize:
        9,

      fontWeight:
        "700",

      textAlign:
        "center",
    },

    selectedText: {
      color:
        "#D8E0FF",

      fontWeight:
        "900",
    },
  });
