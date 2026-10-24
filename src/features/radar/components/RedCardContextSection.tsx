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

import type {
  MatchPickRedCardSnapshot,
} from "@/features/match-picks/types/matchPick";

import {
  MatchPickQuickActions,
} from "@/features/match-picks/components/MatchPickQuickActions";

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

  redCards:
    MatchPickRedCardSnapshot;
}

export function RedCardContextSection({
  match,
  redCards,
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
		      <MatchPickQuickActions
        match={
          match
        }
        redCards={
          redCards
        }
      />
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
  match={
    match
  }
/>
      )}
    </View>
  );
}
