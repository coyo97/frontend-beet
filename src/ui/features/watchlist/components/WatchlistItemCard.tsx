import React from "react";

import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  WatchlistItem,
} from "../../../../types/watchlist";

interface Props {
  item:
    WatchlistItem;

  disabled?:
    boolean;

  onToggle:
    (
      enabled:
        boolean
    ) => void;

  onDelete:
    () => void;
  onPress?:
  () => void;
}

export default function WatchlistItemCard({
  item,
  disabled = false,
  onToggle,
  onDelete,
  onPress,
}: Props) {

  return (
<TouchableOpacity
  activeOpacity={
    0.85
  }
  disabled={
    disabled ||
    !onPress
  }
  onPress={
    onPress
  }
  style={
    styles.card
  }
>
      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.content
          }
        >
          <Text
            style={
              styles.type
            }
          >
            {item.type ===
            "match"
              ? "⚽ PARTIDO"
              : item.type ===
                "team"
              ? "⭐ EQUIPO"
              : item.type ===
                "competition"
              ? "🏆 COMPETICIÓN"
              : item.type ===
                "country"
              ? "🌎 PAÍS"
              : "🔔 REGLA"}
          </Text>

          <Text
            style={
              styles.label
            }
          >
            {item.label}
          </Text>

          {!!item.target
            .competition && (
            <Text
              style={
                styles.meta
              }
            >
              {item.target.country}
              {" · "}
              {item.target
                .competition}
            </Text>
          )}
        </View>

        <Switch
          disabled={
            disabled
          }
          value={
            item.enabled
          }
          onValueChange={
            onToggle
          }
        />
      </View>

      <TouchableOpacity
        disabled={
          disabled
        }
        onPress={
          onDelete
        }
        style={
          styles.deleteButton
        }
      >
        <Text
          style={
            styles.deleteText
          }
        >
          Eliminar
        </Text>
      </TouchableOpacity>
	</TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#171A21",

      borderWidth:
        1,

      borderColor:
        "#292E39",

      borderRadius:
        16,

      padding:
        16,

      marginBottom:
        12,
    },

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        14,
    },

    content: {
      flex:
        1,
    },

    type: {
      color:
        "#8A95A6",

      fontSize:
        10,

      fontWeight:
        "800",

      marginBottom:
        6,
    },

    label: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "700",
    },

    meta: {
      color:
        "#737D8C",

      fontSize:
        12,

      marginTop:
        5,
    },

    deleteButton: {
      marginTop:
        14,

      alignSelf:
        "flex-start",
    },

    deleteText: {
      color:
        "#FF727D",

      fontWeight:
        "600",
    },
  });
