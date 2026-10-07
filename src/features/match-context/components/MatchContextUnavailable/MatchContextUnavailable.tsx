import React from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  getPreferredMatchSource,
  getMatchSourceLabel,
} from "@/ui/features/radar/utils/matchSource";

import {
  styles,
} from "./MatchContextUnavailable.styles";

interface Props {
  match:
    LiveMatch;
}

export function MatchContextUnavailable({
  match,
}: Props) {

  const source =
    getPreferredMatchSource(
      match
    );

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.title
        }
      >
        Contexto limitado
      </Text>

      <Text
        style={
          styles.description
        }
      >
        Partido detectado por{" "}
        {getMatchSourceLabel(
          source
        )}.
        La tabla y estadísticas avanzadas no están disponibles para este encuentro.
      </Text>
    </View>
  );
}
