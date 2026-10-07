import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    backdrop: {
      flex:
        1,

      backgroundColor:
        "rgba(0,0,0,0.72)",

      alignItems:
        "center",

      justifyContent:
        "center",

      padding:
        20,
    },

    card: {
      width:
        "100%",

      maxWidth:
        520,

      backgroundColor:
        "#171A21",

      borderWidth:
        1,

      borderColor:
        "#2A303A",

      borderRadius:
        16,

      padding:
        18,
    },

    title: {
      color:
        "#F5F7FA",

      fontSize:
        18,

      fontWeight:
        "700",

      marginBottom:
        6,
    },

    win: {
      color:
        "#58C783",

      fontSize:
        13,

      fontWeight:
        "800",

      marginBottom:
        18,
    },

    loss: {
      color:
        "#FF6B76",

      fontSize:
        13,

      fontWeight:
        "800",

      marginBottom:
        18,
    },

    label: {
      color:
        "#B7BEC9",

      fontSize:
        13,

      marginBottom:
        8,
    },

    input: {
      minHeight:
        100,

      color:
        "#F5F7FA",

      backgroundColor:
        "#101318",

      borderWidth:
        1,

      borderColor:
        "#2B313C",

      borderRadius:
        12,

      padding:
        12,

      textAlignVertical:
        "top",
    },

    help: {
      color:
        "#737B87",

      fontSize:
        11,

      marginTop:
        8,
    },

    actions: {
      flexDirection:
        "row",

      justifyContent:
        "flex-end",

      gap:
        10,

      marginTop:
        18,
    },

    cancelButton: {
      paddingHorizontal:
        14,

      paddingVertical:
        10,
    },

    cancelText: {
      color:
        "#AEB6C2",

      fontWeight:
        "600",
    },

    saveButton: {
      backgroundColor:
        "#E9EDF3",

      borderRadius:
        10,

      paddingHorizontal:
        16,

      paddingVertical:
        10,
    },

    saveText: {
      color:
        "#111419",

      fontWeight:
        "800",
    },
  });
