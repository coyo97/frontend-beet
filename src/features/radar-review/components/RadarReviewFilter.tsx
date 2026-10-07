import React from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import type {
  RadarReviewStatus,
} from "../types/radarReview";

import {
  styles,
} from "./RadarReviewFilter.styles";

export type RadarReviewFilterValue =
  | "all"
  | RadarReviewStatus;

interface Props {
  value:
    RadarReviewFilterValue;

  onChange:
    (
      value:
        RadarReviewFilterValue
    ) => void;
}

const OPTIONS: Array<{
  value:
    RadarReviewFilterValue;

  label:
    string;
}> = [
  {
    value:
      "all",

    label:
      "Todas",
  },

  {
    value:
      "new",

    label:
      "● Nuevas",
  },

  {
    value:
      "marked",

    label:
      "★ Marcadas",
  },

  {
    value:
      "reviewed",

    label:
      "✓ Revisadas",
  },

  {
    value:
      "dismissed",

    label:
      "✕ Descartadas",
  },
];

export function RadarReviewFilter({
  value,
  onChange,
}: Props) {

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={
        false
      }
      contentContainerStyle={
        styles.content
      }
    >
      {OPTIONS.map(
        (
          option
        ) => {

          const active =
            option.value ===
            value;

          return (
            <TouchableOpacity
              key={
                option.value
              }
              activeOpacity={
                0.8
              }
              onPress={
                () =>
                  onChange(
                    option.value
                  )
              }
              style={[
                styles.button,

                active &&
                  styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.label,

                  active &&
                    styles.activeLabel,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        }
      )}
    </ScrollView>
  );
}
