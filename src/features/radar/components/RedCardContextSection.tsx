import React from "react";

import {
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  MatchContextSummary,
} from "@/features/match-context/components/MatchContextSummary";

import {
  MatchCopyActions,
} from "@/features/match-context/components/MatchCopyActions";

import {
  MatchTeamMemory,
} from "@/features/team-memory/components/MatchTeamMemory";

import {
  RadarReviewControls,
} from "@/features/radar-review/components/RadarReviewControls";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  styles,
} from "./RedCardContextSection.styles";

interface Props {
  match:
    LiveMatch;
}

export function RedCardContextSection({
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

      <MatchCopyActions
        home={
          match.home.name
        }
        away={
          match.away.name
        }
      />

      {source && (
        <RadarReviewControls
          provider={
            source.provider
          }
          externalId={
            source.externalId
          }
        />
      )}
    </View>
  );
}
