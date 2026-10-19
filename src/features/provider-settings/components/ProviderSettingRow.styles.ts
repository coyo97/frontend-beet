import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        12,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#252B34",
    },

    info: {
      flex:
        1,

      paddingRight:
        12,
    },

    titleRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        7,
    },

    dot: {
      width:
        7,

      height:
        7,

      borderRadius:
        4,
    },

    dotEnabled: {
      backgroundColor:
        "#68CA7E",
    },

    dotDisabled: {
      backgroundColor:
        "#717985",
    },

    title: {
      color:
        "#E9EDF2",

      fontSize:
        12,

      fontWeight:
        "800",
    },

    description: {
      color:
        "#737E8C",

      fontSize:
        9,

      lineHeight:
        13,

      marginTop:
        4,
    },

    state: {
      color:
        "#596370",

      fontSize:
        8,

      fontWeight:
        "700",

      marginTop:
        5,
    },

    loader: {
      width:
        48,

      alignItems:
        "center",

      justifyContent:
        "center",
    },
  });
