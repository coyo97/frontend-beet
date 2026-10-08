import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  SharedMatchInsight,
} from "../types/sharedMatch";

import {
  styles,
} from "./SharedMatchCard.styles";

import {
  MatchContextSummary,
} from "@/features/match-context/components/MatchContextSummary";

import {
  MatchTeamMemory,
} from "@/features/team-memory/components/MatchTeamMemory";

import {
  sharedMatchToLiveMatch,
} from "../utils/sharedMatchToLiveMatch";

interface Props {
  item:
    SharedMatchInsight;

  onPress:
    () => void;
}

function getSelectedTeam(
  item:
    SharedMatchInsight
): string | null {

  if (
    item.selectedSide ===
    "home"
  ) {
    return item.match
      .homeName;
  }

  if (
    item.selectedSide ===
    "away"
  ) {
    return item.match
      .awayName;
  }

  return null;
}

function getActionText(
  item:
    SharedMatchInsight
): string {

  const team =
    getSelectedTeam(
      item
    );

  if (
    item.action ===
    "bet"
  ) {
    return team
      ? `✅ Apostó por ${team}`
      : "✅ Apostó";
  }

  if (
    item.action ===
    "leaning"
  ) {
    return team
      ? `🎯 Va con ${team}`
      : "🎯 Le interesa";
  }

  return "👀 Compartió este partido";
}

function getRelativeTime(
  value:
    string
): string {

  const timestamp =
    new Date(
      value
    )
      .getTime();

  if (
    !Number.isFinite(
      timestamp
    )
  ) {
    return "";
  }

  const seconds =
    Math.max(
      0,
      Math.floor(
        (
          Date.now() -
          timestamp
        ) /
        1000
      )
    );

  if (
    seconds <
    60
  ) {
    return "ahora";
  }

  const minutes =
    Math.floor(
      seconds /
      60
    );

  if (
    minutes <
    60
  ) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(
      minutes /
      60
    );

  if (
    hours <
    24
  ) {
    return `${hours} h`;
  }

  const days =
    Math.floor(
      hours /
      24
    );

  return `${days} d`;
}

export function SharedMatchCard({
  item,
  onPress,
}: Props) {

	const match =
  sharedMatchToLiveMatch(
    item
  );

  return (
    <View
      style={
        styles.card
      }
    >
      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.user
          }
        >
          {item
            .createdByUser
            .username}
        </Text>

        <Text
          style={
            styles.time
          }
        >
          {getRelativeTime(
            item.createdAt
          )}
        </Text>
      </View>

      <Text
        style={
          styles.action
        }
      >
        {getActionText(
          item
        )}
      </Text>

      <Text
        style={
          styles.teams
        }
      >
        {item.match
          .homeName}
        {"  "}
        {item.match
          .homeGoals ??
          "-"}
        {" - "}
        {item.match
          .awayGoals ??
          "-"}
        {"  "}
        {item.match
          .awayName}
      </Text>

      <Text
        style={
          styles.competition
        }
      >
        {item.match
          .country ??
          "Sin país"}

        {" · "}

        {item.match
          .competitionName ??
          "Sin liga"}

        {item.match.minute !==
        null
          ? ` · ${item.match.minute}'`
          : ""}
      </Text>

      {!!item.note && (
        <Text
          style={
            styles.note
          }
        >
          “{item.note}”
        </Text>
      )}

		<MatchContextSummary
  match={
    match
  }
  autoLoad
/>

<MatchTeamMemory
  match={
    match
  }
  autoLoad
/>
      <TouchableOpacity
        activeOpacity={
          0.8
        }
        style={
          styles.openButton
        }
        onPress={
          onPress
        }
      >
        <Text
          style={
            styles.openButtonText
          }
        >
          Ver partido
        </Text>
      </TouchableOpacity>
    </View>
  );
}
