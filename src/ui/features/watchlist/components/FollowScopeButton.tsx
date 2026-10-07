import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  label:
    string;

  followed:
    boolean;

  loading?:
    boolean;

  onPress:
    () => void;
}

export default function FollowScopeButton({
  label,
  followed,
  loading = false,
  onPress,
}: Props) {

  return (
    <TouchableOpacity
      activeOpacity={
        0.8
      }
      disabled={
        loading
      }
      onPress={
        onPress
      }
      style={[
        styles.button,

        followed &&
          styles.followed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
        />
      ) : (
        <>
          <Text
            style={
              styles.icon
            }
          >
            {followed
              ? "★"
              : "☆"}
          </Text>

          <Text
            numberOfLines={
              1
            }
            style={[
              styles.label,

              followed &&
                styles.followedLabel,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    button: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        "#171A20",

      borderWidth:
        1,

      borderColor:
        "#303640",

      borderRadius:
        12,

      paddingHorizontal:
        12,

      paddingVertical:
        11,

      gap:
        7,

      marginBottom:
        8,
    },

    followed: {
      borderColor:
        "#806D2B",

      backgroundColor:
        "#282313",
    },

    icon: {
      color:
        "#D7B84C",

      fontSize:
        17,
    },

    label: {
      flex:
        1,

      color:
        "#C8CED7",

      fontSize:
        13,

      fontWeight:
        "600",
    },

    followedLabel: {
      color:
        "#F0CD60",
    },
  });
