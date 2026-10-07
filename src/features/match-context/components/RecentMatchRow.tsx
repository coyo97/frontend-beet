import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  MatchResultBadge,
} from "@/shared/ui/atoms/MatchResultBadge";

import type {
  RecentTeamMatch,
} from "@/types/matchContext";

import {
  styles,
} from "./RecentMatchRow.styles";

interface Props {
  match:
    RecentTeamMatch;
}

export function RecentMatchRow({
  match,
}: Props) {

  const venue =
    match.homeAway ===
      "home"
      ? "L"
      : "V";

  return (
    <View
      style={
        styles.container
      }
    >
      <MatchResultBadge
        result={
          match.result
        }
      />

      <View
        style={
          styles.score
        }
      >
        <Text
          style={
            styles.scoreText
          }
        >
          {match.goalsFor}
          -
          {match.goalsAgainst}
        </Text>

        <Text
          style={
            styles.venue
          }
        >
          {venue}
        </Text>
      </View>

      <Text
        numberOfLines={
          1
        }
        style={
          styles.opponent
        }
      >
        {match.opponentName}
      </Text>

      {match.opponentPosition !==
        null && (
        <Text
          style={
            styles.position
          }
        >
          #{match.opponentPosition}
          {" actual"}
        </Text>
      )}
    </View>
  );
}
