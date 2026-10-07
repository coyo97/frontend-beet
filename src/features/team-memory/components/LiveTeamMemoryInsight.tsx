import React from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import type {
  TeamMemorySummary,
} from "../types/teamMemory";

import {
  useMatchTeamMemory,
} from "../hooks/useMatchTeamMemory";

import {
  styles,
} from "./LiveTeamMemoryInsight.styles";

interface Props {
  match:
    LiveMatch;

  autoLoad:
    boolean;
}

interface TeamLineProps {
  teamName:
    string;

  summary:
    TeamMemorySummary |
    undefined;
}

function TeamLine({
  teamName,
  summary,
}: TeamLineProps) {

  if (
    !summary ||
    summary.total ===
      0 ||
    !summary.lastOutcome
  ) {
    return null;
  }

  const won =
    summary.lastOutcome ===
    "win";

  return (
    <View
      style={
        styles.teamBlock
      }
    >
      <View
        style={
          styles.teamHeader
        }
      >
        <Text
          numberOfLines={
            1
          }
          style={
            styles.teamName
          }
        >
          {teamName}
        </Text>

        <Text
          style={
            won
              ? styles.win
              : styles.loss
          }
        >
          {won
            ? "TE HIZO GANAR"
            : "TE HIZO PERDER"}
        </Text>
      </View>

      <Text
        style={
          styles.record
        }
      >
        {summary.wins} G
        {" · "}
        {summary.losses} P
      </Text>

      {!!summary.lastOpponentName && (
        <Text
          style={
            styles.opponent
          }
        >
          Última experiencia vs{" "}
          {summary.lastOpponentName}
        </Text>
      )}

      {!!summary.lastNote && (
        <Text
          numberOfLines={
            3
          }
          style={
            styles.note
          }
        >
          {summary.lastNote}
        </Text>
      )}
    </View>
  );
}

export function LiveTeamMemoryInsight({
  match,
  autoLoad,
}: Props) {

  const {
    homeSummary,
    awaySummary,
  } =
    useMatchTeamMemory(
      match,
      {
        enabled:
          autoLoad,
      }
    );

  const hasHome =
    Boolean(
      homeSummary &&
      homeSummary.total >
        0
    );

  const hasAway =
    Boolean(
      awaySummary &&
      awaySummary.total >
        0
    );

  if (
    !hasHome &&
    !hasAway
  ) {
    return null;
  }

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
        TU MEMORIA
      </Text>

      <TeamLine
        teamName={
          match.home.name
        }
        summary={
          homeSummary
        }
      />

      <TeamLine
        teamName={
          match.away.name
        }
        summary={
          awaySummary
        }
      />
    </View>
  );
}
