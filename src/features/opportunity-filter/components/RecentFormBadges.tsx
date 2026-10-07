import React from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  RecentResult,
} from "../types/opportunity";

import {
  styles,
} from "./RecentFormBadges.styles";

interface Props {
  form:
    RecentResult[];
}

export function RecentFormBadges({
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
        Sin forma
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
            <View
              key={
                `${result}-${index}`
              }
              style={[
                styles.badge,

                result ===
                  "W" &&
                  styles.win,

                result ===
                  "D" &&
                  styles.draw,

                result ===
                  "L" &&
                  styles.loss,
              ]}
            >
              <Text
                style={
                  styles.text
                }
              >
                {result ===
                  "W"
                  ? "G"
                  : result ===
                      "D"
                    ? "E"
                    : "P"}
              </Text>
            </View>
          )
        )}
    </View>
  );
}
