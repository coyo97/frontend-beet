import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      backgroundColor:
        "#11151B",

      borderWidth:
        1,

      borderColor:
        "#292F39",

      borderRadius:
        14,

      padding:
        12,

      marginBottom:
        12,
    },

    top: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "flex-start",

      gap:
        10,
    },

    competitionContainer: {
      flex:
        1,
    },

    competition: {
      color:
        "#E3E8EF",

      fontSize:
        11,

      fontWeight:
        "800",
    },

    country: {
      color:
        "#77818E",

      fontSize:
        9,

      marginTop:
        2,
    },

    statusBadge: {
      borderRadius:
        999,

      borderWidth:
        1,

      paddingHorizontal:
        8,

      paddingVertical:
        4,
    },

    confirmedBadge: {
      backgroundColor:
        "#13241A",

      borderColor:
        "#315A3E",
    },

    unconfirmedBadge: {
      backgroundColor:
        "#292514",

      borderColor:
        "#655B2D",
    },

    statusText: {
      fontSize:
        8,

      fontWeight:
        "900",
    },

    confirmedText: {
      color:
        "#70D391",
    },

    unconfirmedText: {
      color:
        "#D6C06A",
    },

    matchRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop:
        14,
    },

    team: {
      flex:
        1,
    },

    awayTeam: {
      alignItems:
        "flex-end",
    },

    teamName: {
      color:
        "#F1F4F8",

      fontSize:
        12,

      fontWeight:
        "800",
    },

    awayText: {
      textAlign:
        "right",
    },

    scoreContainer: {
      width:
        92,

      alignItems:
        "center",

      paddingHorizontal:
        8,
    },

    score: {
      color:
        "#FFFFFF",

      fontSize:
        23,

      fontWeight:
        "900",
    },

    scoreCaption: {
      color:
        "#737D89",

      fontSize:
        7,

      textAlign:
        "center",

      marginTop:
        1,
    },

    meta: {
      marginTop:
        12,

      paddingTop:
        9,

      borderTopWidth:
        1,

      borderTopColor:
        "#252B34",
    },

    metaText: {
      color:
        "#78828F",

      fontSize:
        8,
    },

    warning: {
      color:
        "#C6AD55",

      fontSize:
        8,

      marginTop:
        4,

      lineHeight:
        12,
    },
  });
