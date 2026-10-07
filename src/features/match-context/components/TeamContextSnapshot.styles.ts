import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      paddingVertical:
        10,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#252A32",
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        10,
    },

    teamName: {
      flex:
        1,

      color:
        "#E6EAF0",

      fontSize:
        12,

      fontWeight:
        "800",
    },

    metrics: {
      flexDirection:
        "row",

      gap:
        8,

      marginTop:
        9,
    },

    form: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        9,

      marginTop:
        9,
    },

    formLabel: {
      color:
        "#6E7785",

      fontSize:
        9,

      fontWeight:
        "700",

      textTransform:
        "uppercase",
    },

    recent: {
      marginTop:
        9,

      paddingTop:
        7,

      borderTopWidth:
        1,

      borderTopColor:
        "#232831",
    },
  });
