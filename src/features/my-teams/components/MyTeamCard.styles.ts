import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#11151B",

      borderWidth:
        1,

      borderColor:
        "#292F38",

      borderRadius:
        13,

      padding:
        12,

      marginBottom:
        10,
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    titleArea: {
      flex:
        1,

      flexDirection:
        "row",

      flexWrap:
        "wrap",

      alignItems:
        "center",

      gap:
        7,
    },

    teamName: {
      color:
        "#EDF1F5",

      fontSize:
        13,

      fontWeight:
        "900",
    },

    label: {
      backgroundColor:
        "#1C222A",

      borderWidth:
        1,

      borderColor:
        "#343C47",

      borderRadius:
        999,

      paddingHorizontal:
        7,

      paddingVertical:
        3,
    },

    labelText: {
      color:
        "#BAC3CD",

      fontSize:
        7,

      fontWeight:
        "900",
    },

    chevron: {
      color:
        "#65707D",

      fontSize:
        8,

      marginLeft:
        8,
    },

    memory: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        12,

      marginTop:
        9,
    },

    win: {
      color:
        "#7BC995",

      fontSize:
        10,

      fontWeight:
        "800",
    },

    loss: {
      color:
        "#E2858A",

      fontSize:
        10,

      fontWeight:
        "800",
    },

    total: {
      color:
        "#68727F",

      fontSize:
        8,
    },

    note: {
      color:
        "#A1AAB5",

      fontSize:
        9,

      lineHeight:
        14,

      marginTop:
        9,

      fontStyle:
        "italic",
    },
  });
