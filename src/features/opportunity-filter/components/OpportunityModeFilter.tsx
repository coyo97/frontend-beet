import React from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import type {
  BettorFilterMode,
} from "../types/opportunity";

import {
  styles,
} from "./OpportunityModeFilter.styles";

interface Props {
  value:
    BettorFilterMode;

  onChange:
    (
      value:
        BettorFilterMode
    ) =>
      void;
}

const OPTIONS: Array<{
  value:
    BettorFilterMode;

  label:
    string;
}> = [
  {
    value:
      "moderate-favorite",

    label:
      "🎯 Favoritos",
  },

  {
    value:
      "clear-favorite",

    label:
      "🔥 Muy superiores",
  },

  {
    value:
      "form-mismatch",

    label:
      "📈 Forma desigual",
  },

  {
    value:
      "danger-watch",

    label:
      "⚠ Cuidado",
  },

  {
    value:
      "balanced",

    label:
      "⚖ Parejos",
  },

  {
    value:
      "home-strong",

    label:
      "🏠 Local fuerte",
  },

  {
    value:
      "away-strong",

    label:
      "✈ Visitante fuerte",
  },

  {
    value:
      "all",

    label:
      "Todos",
  },
];

export function OpportunityModeFilter({
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
        option => {

          const active =
            value ===
            option.value;

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
                  styles.text,

                  active &&
                    styles.activeText,
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
