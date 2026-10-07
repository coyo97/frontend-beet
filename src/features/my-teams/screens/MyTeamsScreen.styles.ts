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
        12,

      paddingTop:
        18,

      paddingBottom:
        10,

      borderBottomWidth:
        1,

      borderBottomColor:
        "#1E242C",
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
        5,
    },

    backText: {
      color:
        "#ECF0F4",

      fontSize:
        32,
    },

    title: {
      color:
        "#F2F5F8",

      fontSize:
        18,

      fontWeight:
        "900",
    },

    subtitle: {
      color:
        "#737E8A",

      fontSize:
        9,

      marginTop:
        1,
    },

    searchArea: {
      paddingHorizontal:
        12,

      paddingVertical:
        10,
    },

    search: {
      height:
        40,

      color:
        "#E7EBF0",

      backgroundColor:
        "#11151B",

      borderWidth:
        1,

      borderColor:
        "#2B323B",

      borderRadius:
        10,

      paddingHorizontal:
        11,

      fontSize:
        10,
    },

    count: {
      color:
        "#69737F",

      fontSize:
        8,

      marginTop:
        6,

      textAlign:
        "right",
    },

    content: {
      paddingHorizontal:
        12,

      paddingBottom:
        40,
    },

    errorBox: {
      marginHorizontal:
        12,

      marginBottom:
        8,

      padding:
        9,

      backgroundColor:
        "#261416",

      borderRadius:
        9,
    },

    error: {
      color:
        "#DF858A",

      fontSize:
        9,
    },

    loader: {
      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        9,
    },

    loaderText: {
      color:
        "#76818D",

      fontSize:
        9,
    },

    emptyContent: {
      flexGrow:
        1,

      justifyContent:
        "center",

      padding:
        26,
    },

    empty: {
      alignItems:
        "center",
    },

    emptyTitle: {
      color:
        "#DCE2E8",

      fontSize:
        13,

      fontWeight:
        "800",
    },

    emptyText: {
      color:
        "#747E8A",

      fontSize:
        9,

      lineHeight:
        14,

      textAlign:
        "center",

      marginTop:
        7,
    },
  });
