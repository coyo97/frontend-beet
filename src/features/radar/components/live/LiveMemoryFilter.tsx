import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  styles,
} from "./LiveMemoryFilter.styles";

export type LiveMemoryFilterMode =
  | "all"
  | "direct"
  | "opponents";

interface Props {
  mode:
    LiveMemoryFilterMode;

  directCount:
    number;

  opponentCount:
    number;

  loading:
    boolean;

  onChange:
    (
      mode:
        LiveMemoryFilterMode
    ) => void;
}

export function LiveMemoryFilter({
  mode,
  directCount,
  opponentCount,
  loading,
  onChange,
}: Props) {

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.label
        }
      >
        Memoria
      </Text>

      <View
        style={
          styles.row
        }
      >
        <TouchableOpacity
          activeOpacity={
            0.8
          }
          onPress={
            () =>
              onChange(
                "all"
              )
          }
          style={[
            styles.chip,

            mode ===
              "all" &&
              styles.chipActive,
          ]}
        >
          <Text
            style={[
              styles.text,

              mode ===
                "all" &&
                styles.textActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={
            0.8
          }
          disabled={
            loading
          }
          onPress={
            () =>
              onChange(
                "direct"
              )
          }
          style={[
            styles.chip,

            mode ===
              "direct" &&
              styles.memoryActive,

            loading &&
              styles.disabled,
          ]}
        >
          <Text
            style={[
              styles.text,

              mode ===
                "direct" &&
                styles.memoryTextActive,
            ]}
          >
            🧠 Mi memoria{" "}
            {loading
              ? "..."
              : directCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={
            0.8
          }
          disabled={
            loading
          }
          onPress={
            () =>
              onChange(
                "opponents"
              )
          }
          style={[
            styles.chip,

            mode ===
              "opponents" &&
              styles.opponentActive,

            loading &&
              styles.disabled,
          ]}
        >
          <Text
            style={[
              styles.text,

              mode ===
                "opponents" &&
                styles.opponentTextActive,
            ]}
          >
            ⚔️ Rivales{" "}
            {loading
              ? "..."
              : opponentCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
