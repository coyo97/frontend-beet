import {
  StyleSheet,
} from "react-native";

export const styles =
  StyleSheet.create({
    container: {
      flex:
        1,

      minHeight:
        34,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#171B21",

      borderWidth:
        1,

      borderColor:
        "#303640",

      borderRadius:
        10,

      paddingHorizontal:
        9,

      paddingVertical:
        7,
    },

    active: {
      backgroundColor:
        "#272313",

      borderColor:
        "#756329",
    },

    label: {
      color:
        "#9FA8B5",

      fontSize:
        10,

      fontWeight:
        "700",
    },

    activeLabel: {
      color:
        "#F0CE63",
    },
  });
