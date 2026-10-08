import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#171A21",

      borderWidth:
        1,

      borderColor:
        "#282E38",

      borderRadius:
        14,

      padding:
        14,

      marginBottom:
        10,
    },

    header: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap:
        12,

      marginBottom:
        8,
    },

    user: {
      color:
        "#F4F6F8",

      fontSize:
        13,

      fontWeight:
        "800",

      flex:
        1,
    },

    time: {
      color:
        "#6F7987",

      fontSize:
        10,
    },

    action: {
      color:
        "#AAB4C2",

      fontSize:
        12,

      marginBottom:
        9,
    },

    teams: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "800",

      marginBottom:
        5,
    },

    competition: {
      color:
        "#7E8997",

      fontSize:
        11,

      marginBottom:
        8,
    },

    note: {
      color:
        "#B7C1CD",

      fontSize:
        12,

      lineHeight:
        17,

      marginBottom:
        8,
    },

    openButton: {
      alignSelf:
        "flex-start",

      paddingHorizontal:
        12,

      paddingVertical:
        7,

      borderRadius:
        9,

      backgroundColor:
        "#283D55",
    },

    openButtonText: {
      color:
        "#EDF5FD",

      fontSize:
        11,

      fontWeight:
        "800",
    },
  });
