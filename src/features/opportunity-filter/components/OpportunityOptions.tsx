import React from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import type {
  OpportunityFilters,
} from "../types/opportunity";

import {
  styles,
} from "./OpportunityOptions.styles";

interface Props {
  value:
    OpportunityFilters;

  onChange:
    (
      next:
        OpportunityFilters
    ) =>
      void;
}

type ToggleKey =
  | "excludeFriendly"
  | "excludeYouth"
  | "excludeReserve"
  | "excludeWomen"
  | "requireTable";

const OPTIONS: Array<{
  key:
    ToggleKey;

  activeLabel:
    string;

  inactiveLabel:
    string;
}> = [
  {
    key:
      "excludeFriendly",

    activeLabel:
      "✓ Sin amistosos",

    inactiveLabel:
      "Amistosos",
  },

  {
    key:
      "excludeYouth",

    activeLabel:
      "✓ Sin juveniles",

    inactiveLabel:
      "Juveniles",
  },

  {
    key:
      "excludeReserve",

    activeLabel:
      "✓ Sin reservas",

    inactiveLabel:
      "Reservas",
  },

  {
    key:
      "excludeWomen",

    activeLabel:
      "✓ Sin femenino",

    inactiveLabel:
      "Femenino",
  },

  {
    key:
      "requireTable",

    activeLabel:
      "✓ Solo con tabla",

    inactiveLabel:
      "Permitir sin tabla",
  },
];

export function OpportunityOptions({
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
            value[
              option.key
            ];

          return (
            <TouchableOpacity
              key={
                option.key
              }
              activeOpacity={
                0.8
              }
              onPress={
                () =>
                  onChange({
                    ...value,

                    [option.key]:
                      !active,
                  })
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
                {active
                  ? option.activeLabel
                  : option.inactiveLabel}
              </Text>
            </TouchableOpacity>
          );
        }
      )}
    </ScrollView>
  );
}
