import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import type {
  MatchPickRedCardSnapshot,
} from "../types/matchPick";

import {
  buildMatchPickContext,
} from "../utils/buildMatchPickContext";

import {
  MatchLineupVerification,
} from "@/features/team-lineup/components/MatchLineupVerification";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  matchPickKey,
} from "../store/matchPickKey";

import {
  useMatchPickStore,
} from "../store/matchPickStore";

import {
  styles,
} from "./MatchPickQuickActions.styles";

interface Props {
  match:
    LiveMatch;

    redCards?:
    MatchPickRedCardSnapshot |
    null;
}

export function MatchPickQuickActions({
  match,
  redCards = null,
}: Props) {

  const key =
    matchPickKey(
      match
    );

  const selected =
    useMatchPickStore(
      state =>
        state.items[
          key
        ]
    );

  const select =
    useMatchPickStore(
      state =>
        state.select
    );

  const source =
    getPreferredMatchSource(
      match
    ) ??
    match.sources[0];

  const choose =
    (
      side:
        "home" |
        "away"
    ) => {

      const teamName =
        side ===
          "home"
          ? match.home.name
          : match.away.name;

      const opponentName =
        side ===
          "home"
          ? match.away.name
          : match.home.name;

      select({
        key,

        side,

        teamName,

        opponentName,

        homeName:
          match.home.name,

        awayName:
          match.away.name,

        competitionName:
          match.competition
            .name,

        kickoffAt:
          match.kickoffAt,

        provider:
          source?.provider ??
          null,

        externalId:
          source?.externalId ??
          null,

		context:
  buildMatchPickContext({
    match,
    side,
    redCards,
  }),
        createdAt:
          new Date()
            .toISOString(),
      });
    };

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.actions
        }
      >
        <TouchableOpacity
          activeOpacity={
            0.8
          }
          onPress={
            () =>
              choose(
                "home"
              )
          }
          style={[
            styles.button,

            selected?.side ===
              "home" &&
              styles.selected,
          ]}
        >
          <Text
            numberOfLines={
              1
            }
            style={[
              styles.text,

              selected?.side ===
                "home" &&
                styles.selectedText,
            ]}
          >
            {selected?.side ===
            "home"
              ? `🎯 Aposté: ${match.home.name}`
              : `${match.home.name} ganará`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={
            0.8
          }
          onPress={
            () =>
              choose(
                "away"
              )
          }
          style={[
            styles.button,

            selected?.side ===
              "away" &&
              styles.selected,
          ]}
        >
          <Text
            numberOfLines={
              1
            }
            style={[
              styles.text,

              selected?.side ===
                "away" &&
                styles.selectedText,
            ]}
          >
            {selected?.side ===
            "away"
              ? `🎯 Aposté: ${match.away.name}`
              : `${match.away.name} ganará`}
          </Text>
        </TouchableOpacity>
      </View>

      {selected && (
        <MatchLineupVerification
          match={
            match
          }
          selectedSide={
            selected.side
          }
        />
      )}
    </View>
  );
}
