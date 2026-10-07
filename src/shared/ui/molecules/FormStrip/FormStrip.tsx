import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  MatchResultBadge,
  type MatchResultValue,
} from "../../atoms/MatchResultBadge";

import {
  styles,
} from "./FormStrip.styles";

interface Props {
  results:
    MatchResultValue[];

  limit?:
    number;
}

export function FormStrip({
  results,
  limit = 5,
}: Props) {

  const visible =
    results.slice(
      0,
      limit
    );

  if (
    visible.length ===
    0
  ) {
    return (
      <Text
        style={
          styles.empty
        }
      >
        Sin forma reciente
      </Text>
    );
  }

  return (
    <View
      style={
        styles.row
      }
    >
      {visible.map(
        (
          result,
          index
        ) => (
          <MatchResultBadge
            key={
              `${result}-${index}`
            }
            result={
              result
            }
          />
        )
      )}
    </View>
  );
}
