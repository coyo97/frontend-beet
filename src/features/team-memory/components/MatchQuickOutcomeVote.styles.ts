import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      marginTop:
        5,

      gap:
        5,
    },

    teamRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        5,
    },

    teamName: {
      flex:
        1,

      color:
        "#AAB4C1",

      fontSize:
        10,

      fontWeight:
        "700",
    },

    button: {
      minWidth:
        58,

      paddingHorizontal:
        8,

      paddingVertical:
        6,

      borderRadius:
        8,

      borderWidth:
        1,

      alignItems:
        "center",
    },

    win: {
      backgroundColor:
        "#14231A",

      borderColor:
        "#294B35",
    },

    loss: {
      backgroundColor:
        "#261719",

      borderColor:
        "#513035",
    },

    activeWin: {
      backgroundColor:
        "#28583A",

      borderColor:
        "#55A86C",
    },

    activeLoss: {
      backgroundColor:
        "#642D34",

      borderColor:
        "#B45460",
    },

    disabled: {
      opacity:
        0.45,
    },

    text: {
      color:
        "#D7DFE8",

      fontSize:
        9,

      fontWeight:
        "900",
    },
	teamBlock: {
  gap:
    6,
},

contextBox: {
  marginTop:
    3,

  marginBottom:
    8,

  padding:
    10,

  backgroundColor:
    "#10141A",

  borderWidth:
    1,

  borderColor:
    "#29313C",

  borderRadius:
    9,
},

contextTitle: {
  color:
    "#D9DFE7",

  fontSize:
    11,

  fontWeight:
    "800",
},

contextHelp: {
  color:
    "#747E8C",

  fontSize:
    9,

  lineHeight:
    13,

  marginTop:
    3,

  marginBottom:
    7,
},

contextInput: {
  minHeight:
    58,

  maxHeight:
    110,

  color:
    "#E8ECF2",

  backgroundColor:
    "#0B0E13",

  borderWidth:
    1,

  borderColor:
    "#303845",

  borderRadius:
    8,

  paddingHorizontal:
    9,

  paddingVertical:
    8,

  fontSize:
    11,

  textAlignVertical:
    "top",
},

contextActions: {
  flexDirection:
    "row",

  justifyContent:
    "flex-end",

  gap:
    7,

  marginTop:
    8,
},

cancelButton: {
  paddingHorizontal:
    10,

  paddingVertical:
    7,

  borderRadius:
    7,

  borderWidth:
    1,

  borderColor:
    "#343C48",
},

cancelText: {
  color:
    "#8E98A6",

  fontSize:
    9,

  fontWeight:
    "700",
},

saveButton: {
  paddingHorizontal:
    11,

  paddingVertical:
    7,

  borderRadius:
    7,

  backgroundColor:
    "#1E4930",

  borderWidth:
    1,

  borderColor:
    "#34734D",
},

saveText: {
  color:
    "#BDE8C8",

  fontSize:
    9,

  fontWeight:
    "800",
},
  });
