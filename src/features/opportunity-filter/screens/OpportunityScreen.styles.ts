import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,

      backgroundColor:
        "#080C11",
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        10,

      paddingTop:
        16,

      paddingBottom:
        7,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#1D242C",
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
    },

    backText: {
      color:
        "#E7EBF0",

      fontSize:
        31,
    },

    headerText: {
      flex:
        1,
    },

    title: {
      color:
        "#F0F3F6",

      fontSize:
        17,

      fontWeight:
        "900",
    },

    subtitle: {
      color:
        "#707B87",

      fontSize:
        8,

      marginTop:
        2,
    },

    actionRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal:
        12,

      paddingBottom:
        10,

      gap:
        10,
    },

    summaryArea: {
      flex:
        1,
    },

    summaryMain: {
      color:
        "#CDD4DB",

      fontSize:
        10,

      fontWeight:
        "900",
    },

    summarySub: {
      color:
        "#68737F",

      fontSize:
        7,

      marginTop:
        2,
    },

    analyzeButton: {
      paddingHorizontal:
        16,

      paddingVertical:
        9,

      borderRadius:
        9,

      backgroundColor:
        "#342C0F",

      borderWidth:
        1,

      borderColor:
        "#7D6826",
    },

    analyzeButtonDisabled: {
      opacity:
        0.5,
    },

    analyzeText: {
      color:
        "#EACB59",

      fontSize:
        9,

      fontWeight:
        "900",
    },

    errorBox: {
      marginHorizontal:
        12,

      marginBottom:
        10,

      padding:
        9,

      borderRadius:
        8,

      backgroundColor:
        "#281518",
    },

    errorText: {
      color:
        "#E39499",

      fontSize:
        8,
    },

    loadingArea: {
      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        10,
    },

    loadingText: {
      color:
        "#727E8A",

      fontSize:
        9,
    },

    listContent: {
      paddingTop:
        2,

      paddingBottom:
        40,
    },

    emptyContent: {
      flexGrow:
        1,

      justifyContent:
        "center",

      padding:
        30,
    },

    empty: {
      alignItems:
        "center",
    },

    emptyTitle: {
      color:
        "#D7DDE3",

      fontSize:
        12,

      fontWeight:
        "800",

      textAlign:
        "center",
    },

    emptyText: {
      color:
        "#6F7984",

      fontSize:
        9,

      lineHeight:
        14,

      marginTop:
        7,

      textAlign:
        "center",
    },
  });
