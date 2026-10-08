import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#12151B",

      borderWidth:
        1,

      borderColor:
        "#282E37",

      borderRadius:
        15,

      padding:
        13,

      marginBottom:
        11,
    },

    meta: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap:
        10,
    },

    competition: {
      flex:
        1,

      color:
        "#747D8B",

      fontSize:
        10,

      fontWeight:
        "600",
    },

    minute: {
      color:
        "#E1C255",

      fontSize:
        11,

      fontWeight:
        "900",
    },

    scoreRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        8,

      marginTop:
        11,
    },

    homeTeam: {
      flex:
        1,

      color:
        "#E9EDF2",

      fontSize:
        12,

      lineHeight:
        16,

      fontWeight:
        "700",
    },

    awayTeam: {
      flex:
        1,

      color:
        "#E9EDF2",

      fontSize:
        12,

      lineHeight:
        16,

      fontWeight:
        "700",

      textAlign:
        "right",
    },

    score: {
      minWidth:
        50,

      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "900",

      textAlign:
        "center",
    },
	cardReviewed: {
  backgroundColor:
    "#10251A",

  borderColor:
    "#2E8B57",

  borderWidth:
    1.5,
},
  });
