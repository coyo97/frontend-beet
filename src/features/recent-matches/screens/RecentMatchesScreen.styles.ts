import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,

      backgroundColor:
        "#080B10",
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        14,

      paddingTop:
        18,

      paddingBottom:
        12,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#1D222A",
    },

    backButton: {
      width:
        38,

      height:
        38,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight:
        6,
    },

    backText: {
      color:
        "#E8EDF3",

      fontSize:
        32,

      lineHeight:
        32,
    },

    headerText: {
      flex:
        1,
    },

    title: {
      color:
        "#F4F7FA",

      fontSize:
        18,

      fontWeight:
        "900",
    },

    subtitle: {
      color:
        "#747F8D",

      fontSize:
        10,

      marginTop:
        2,
    },

    content: {
      padding:
        12,

      paddingBottom:
        40,
    },

    loader: {
      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        12,
    },

    loaderText: {
      color:
        "#78828E",

      fontSize:
        10,
    },

    errorBox: {
      margin:
        12,

      padding:
        10,

      backgroundColor:
        "#251415",

      borderWidth:
        1,

      borderColor:
        "#593033",

      borderRadius:
        10,
    },

    error: {
      color:
        "#E8868B",

      fontSize:
        10,
    },

    emptyContent: {
      flexGrow:
        1,

      justifyContent:
        "center",

      padding:
        24,
    },

    empty: {
      alignItems:
        "center",
    },

    emptyTitle: {
      color:
        "#DDE3EA",

      fontSize:
        14,

      fontWeight:
        "800",
    },

    emptyText: {
      color:
        "#737D89",

      fontSize:
        10,

      textAlign:
        "center",

      marginTop:
        7,

      lineHeight:
        15,
    },
	searchContainer: {
  marginHorizontal:
    16,

  marginTop:
    10,

  marginBottom:
    4,

  minHeight:
    44,

  borderWidth:
    1,

  borderColor:
    "#2D333D",

  backgroundColor:
    "#15191F",

  borderRadius:
    12,

  flexDirection:
    "row",

  alignItems:
    "center",
},

searchInput: {
  flex:
    1,

  color:
    "#F1F3F5",

  fontSize:
    14,

  paddingHorizontal:
    14,

  paddingVertical:
    10,
},

searchClear: {
  width:
    40,

  height:
    40,

  alignItems:
    "center",

  justifyContent:
    "center",
},

searchClearText: {
  color:
    "#89929F",

  fontSize:
    14,

  fontWeight:
    "700",
},

searchSummary: {
  color:
    "#737B87",

  fontSize:
    11,

  marginHorizontal:
    18,

  marginBottom:
    6,
},
  });
