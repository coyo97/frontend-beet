import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  WatchlistAlertEntry,
} from "../../../../types/watchlist";

interface Props {
  entry:
    WatchlistAlertEntry;

  onPress:
    () => void;

  onDismiss:
    () => void;
}

export default function WatchlistAlertBanner({
  entry,
  onPress,
  onDismiss,
}: Props) {

  const {
    watchlistItem,
    signal,
  } =
    entry.payload;

  const match =
    signal.match;

  return (
    <View
      style={
        styles.container
      }
    >
      <TouchableOpacity
        activeOpacity={
          0.85
        }
        onPress={
          onPress
        }
        style={
          styles.content
        }
      >
        <Text
          style={
            styles.label
          }
        >
          ⭐ WATCHLIST ALERT
        </Text>

        <Text
          style={
            styles.title
          }
        >
          {match.home.name}
          {" vs "}
          {match.away.name}
        </Text>

        <Text
          style={
            styles.description
          }
        >
          🔴 Roja · 🔥 Presión{" "}
          {signal.strength}
        </Text>

        <Text
          style={
            styles.reason
          }
        >
          Siguiendo:{" "}
          {watchlistItem.label}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={
          onDismiss
        }
        style={
          styles.close
        }
      >
        <Text
          style={
            styles.closeText
          }
        >
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      backgroundColor:
        "#2B2110",

      borderColor:
        "#745A20",

      borderWidth:
        1,

      borderRadius:
        15,

      marginBottom:
        16,

      overflow:
        "hidden",
    },

    content: {
      flex:
        1,

      padding:
        14,
    },

    label: {
      color:
        "#E5C457",

      fontSize:
        10,

      fontWeight:
        "900",

      marginBottom:
        5,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        15,

      fontWeight:
        "700",
    },

    description: {
      color:
        "#E7D9B0",

      fontSize:
        12,

      marginTop:
        6,
    },

    reason: {
      color:
        "#A99868",

      fontSize:
        11,

      marginTop:
        5,
    },

    close: {
      width:
        42,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    closeText: {
      color:
        "#B9A875",

      fontSize:
        24,
    },
  });
