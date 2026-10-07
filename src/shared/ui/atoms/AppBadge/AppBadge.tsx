import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  styles,
} from "./AppBadge.styles";

export type AppBadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

interface Props {
  label:
    string;

  tone?:
    AppBadgeTone;
}

export function AppBadge({
  label,
  tone = "neutral",
}: Props) {

  return (
    <View
      style={[
        styles.container,
        styles[
          `${tone}Container`
        ],
      ]}
    >
      <Text
        style={[
          styles.label,
          styles[
            `${tone}Label`
          ],
        ]}
      >
        {label}
      </Text>
    </View>
  );
}
