import React from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  TeamMemorySummary,
} from "../types/teamMemory";

import {
  styles,
} from "./TeamMemoryCompactLine.styles";

interface Props {
  teamName:
    string;

  summary:
    TeamMemorySummary |
    undefined;

  loading?:
    boolean;

  align?:
    "left" |
    "right";
}

export function TeamMemoryCompactLine({
  teamName,
  summary,
  loading = false,
  align = "left",
}: Props) {

  const wins =
    summary?.wins ??
    0;

  const losses =
    summary?.losses ??
    0;

  const total =
    wins +
    losses;

  return (
    <View
      style={[
        styles.container,

        align ===
          "right" &&
          styles.right,
      ]}
    >
      <Text
        numberOfLines={
          1
        }
        style={[
          styles.team,

          align ===
            "right" &&
            styles.rightText,
        ]}
      >
        {teamName}
      </Text>

      {loading ? (
        <Text
          style={
            styles.loading
          }
        >
          historial...
        </Text>
      ) : total >
        0 ? (
        <View
          style={
            styles.results
          }
        >
          <Text
            style={
              styles.win
            }
          >
            🟢 {wins}
          </Text>

          <Text
            style={
              styles.separator
            }
          >
            ·
          </Text>

          <Text
            style={
              styles.loss
            }
          >
            🔴 {losses}
          </Text>
        </View>
      ) : (
        <Text
          style={
            styles.empty
          }
        >
          sin historial
        </Text>
      )}
    </View>
  );
}
