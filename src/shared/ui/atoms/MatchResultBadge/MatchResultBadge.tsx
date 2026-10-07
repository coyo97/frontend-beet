import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  styles,
} from "./MatchResultBadge.styles";

export type MatchResultValue =
  | "W"
  | "D"
  | "L";

interface Props {
  result:
    MatchResultValue;
}

export function MatchResultBadge({
  result,
}: Props) {

  const containerStyle =
    result === "W"
      ? styles.win
      : result === "L"
        ? styles.loss
        : styles.draw;

  const label =
    result === "W"
      ? "G"
      : result === "L"
        ? "P"
        : "E";

  return (
    <View
      style={[
        styles.container,
        containerStyle,
      ]}
    >
      <Text
        style={
          styles.label
        }
      >
        {label}
      </Text>
    </View>
  );
}
