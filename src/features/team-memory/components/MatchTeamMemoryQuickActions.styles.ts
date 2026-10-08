import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      gap:
        12,

      marginTop:
        5,

      marginBottom:
        4,
    },

    side: {
      flex:
        1,

      alignItems:
        "flex-start",
    },

    sideRight: {
      alignItems:
        "flex-end",
    },

    summary: {
      color:
        "#7F8997",

      fontSize:
        10,

      marginBottom:
        5,
    },

    rightText: {
      textAlign:
        "right",
    },

    actions: {
      flexDirection:
        "row",

      gap:
        5,
    },

    actionsRight: {
      justifyContent:
        "flex-end",
    },

    button: {
      paddingHorizontal:
        7,

      paddingVertical:
        5,

      borderRadius:
        7,

      borderWidth:
        1,
    },

    winButton: {
      borderColor:
        "#28573B",

      backgroundColor:
        "#14231A",
    },

    lossButton: {
      borderColor:
        "#63323A",

      backgroundColor:
        "#29171A",
    },

    buttonText: {
      color:
        "#E7EBF0",

      fontSize:
        9,

      fontWeight:
        "700",
    },
  });
