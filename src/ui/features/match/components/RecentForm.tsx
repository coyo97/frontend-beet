import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  RecentResult,
} from "../../../../types/matchContext";

interface Props {
  form:
    RecentResult[];
}

function symbol(
  result:
    RecentResult
) {

  switch (
    result
  ) {
    case "W":
      return "🟢";

    case "D":
      return "⚪";

    case "L":
      return "🔴";
  }
}

export default function RecentForm({
  form,
}: Props) {

  if (
    form.length ===
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
      {form
        .slice(
          0,
          5
        )
        .map(
          (
            result,
            index
          ) => (
            <Text
              key={
                `${result}-${index}`
              }
              style={
                styles.result
              }
            >
              {symbol(
                result
              )}
            </Text>
          )
        )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    row: {
      flexDirection:
        "row",

      gap:
        2,
    },

    result: {
      fontSize:
        12,
    },

    empty: {
      color:
        "#626B78",

      fontSize:
        10,
    },
  });
