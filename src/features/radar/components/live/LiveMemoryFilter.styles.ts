import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      paddingHorizontal:
        14,

      paddingTop:
        8,

      paddingBottom:
        5,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#202630",
    },

    label: {
      color:
        "#7E8999",

      fontSize:
        11,

      fontWeight:
        "700",

      marginBottom:
        5,
    },

   row: {
  flexDirection:
    "row",

  flexWrap:
    "wrap",

  gap:
    7,
},

    chip: {
      minHeight:
        31,

      justifyContent:
        "center",

      paddingHorizontal:
        12,

      borderRadius:
        16,

      borderWidth:
        1,

      borderColor:
        "#303744",

      backgroundColor:
        "#151A21",
    },

    chipActive: {
      backgroundColor:
        "#E5EDF6",

      borderColor:
        "#E5EDF6",
    },

    memoryActive: {
      backgroundColor:
        "#20382C",

      borderColor:
        "#3C7956",
    },

    text: {
      color:
        "#A2ACB9",

      fontSize:
        11,

      fontWeight:
        "700",
    },

    textActive: {
      color:
        "#11161C",

      fontWeight:
        "800",
    },

    memoryTextActive: {
      color:
        "#9FE0B4",

      fontWeight:
        "800",
    },

    disabled: {
      opacity:
        0.45,
    },

	opponentActive: {
  backgroundColor:
    "#352A1C",

  borderColor:
    "#8A6634",
},

opponentTextActive: {
  color:
    "#EAC17D",

  fontWeight:
    "800",
},
  });
