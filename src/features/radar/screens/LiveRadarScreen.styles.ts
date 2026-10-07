import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,

      backgroundColor:
        "#0E1015",
    },

    listContent: {
      flexGrow:
        1,

      paddingHorizontal:
        18,

      paddingTop:
        54,

      paddingBottom:
        100,
    },

    /*
     * =========================
     * HEADER
     * =========================
     */

    header: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom:
        22,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        26,

      fontWeight:
        "800",
    },

    subtitle: {
      color:
        "#7E8796",

      marginTop:
        4,
    },

    /*
     * =========================
     * CONNECTION
     * =========================
     */

    connection: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        6,
    },

    dot: {
      width:
        8,

      height:
        8,

      borderRadius:
        4,
    },

    dotOnline: {
      backgroundColor:
        "#52D273",
    },

    dotOffline: {
      backgroundColor:
        "#F06464",
    },

    connectionText: {
      color:
        "#A8AFBA",

      fontSize:
        12,
    },

    /*
     * =========================
     * FILTER
     * =========================
     */

    filter: {
      marginBottom:
        16,
    },

    input: {
      backgroundColor:
        "#171A21",

      borderColor:
        "#292E39",

      borderWidth:
        1,

      borderRadius:
        13,

      paddingHorizontal:
        14,

      paddingVertical:
        12,

      color:
        "#FFFFFF",
    },

    filterActions: {
      flexDirection:
        "row",

      gap:
        8,

      marginTop:
        8,
    },

    filterButton: {
      flex:
        1,

      backgroundColor:
        "#2458E8",

      borderRadius:
        12,

      alignItems:
        "center",

      paddingVertical:
        12,

      paddingHorizontal:
        16,
    },

    filterButtonText: {
      color:
        "#FFFFFF",

      fontWeight:
        "700",
    },

    clearButton: {
      paddingHorizontal:
        20,

      borderRadius:
        12,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#20242D",
    },

    clearText: {
      color:
        "#A8B7E8",

      fontWeight:
        "600",
    },

    /*
     * =========================
     * QUICK ACTIONS
     * =========================
     */

    quickActions: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      gap:
        9,

      marginTop:
        4,

      marginBottom:
        18,
    },

    quickActionButton: {
      flexGrow:
        1,

      flexBasis:
        "47%",

      minHeight:
        44,

      borderWidth:
        1,

      borderRadius:
        12,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        10,

      paddingVertical:
        10,
    },

    watchlistShortcut: {
      backgroundColor:
        "#1A1E27",

      borderColor:
        "#303745",
    },

    watchlistShortcutText: {
      color:
        "#E6C55A",

      fontWeight:
        "700",

      fontSize:
        12,
    },

    alertCenterButton: {
      backgroundColor:
        "#201C13",

      borderColor:
        "#4A4024",
    },

    alertCenterText: {
      color:
        "#E4C75B",

      fontWeight:
        "700",

      fontSize:
        12,
    },

    settingsButton: {
      backgroundColor:
        "#181B21",

      borderColor:
        "#303540",
    },

    settingsButtonText: {
      color:
        "#B9C0CC",

      fontWeight:
        "700",

      fontSize:
        12,
    },

    rulesButton: {
      backgroundColor:
        "#181B21",

      borderColor:
        "#303540",
    },

    rulesButtonText: {
      color:
        "#B9C0CC",

      fontWeight:
        "700",

      fontSize:
        12,
    },

    /*
     * =========================
     * ERROR
     * =========================
     */

    errorBox: {
      backgroundColor:
        "#321A1E",

      borderWidth:
        1,

      borderColor:
        "#603038",

      padding:
        12,

      borderRadius:
        10,

      marginBottom:
        16,
    },

    error: {
      color:
        "#FF8790",
    },

    /*
     * =========================
     * LOADING
     * =========================
     */

    initialLoader: {
      alignItems:
        "center",

      justifyContent:
        "center",

      paddingVertical:
        30,

      gap:
        10,
    },

    loadingText: {
      color:
        "#777F8C",

      fontSize:
        11,
    },

    /*
     * =========================
     * EMPTY
     * =========================
     */

    empty: {
      color:
        "#747D8B",

      textAlign:
        "center",

      paddingVertical:
        50,
    },
  });
