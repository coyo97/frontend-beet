import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  LiveTeamMemoryInsight,
} from "@/features/team-memory/components/LiveTeamMemoryInsight";

import {
  getMatchContextSource,
} from "@/features/match-context/utils/getMatchContextSource";

import {
  MatchContextUnavailable,
} from "@/features/match-context/components/MatchContextUnavailable/MatchContextUnavailable";

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
} from "./AllMatchContextCard.styles";

interface Props {
  match:
    LiveMatch;

  contextVisible:
    boolean;
}

export function AllMatchContextCard({
  match,
  contextVisible,
}: Props) {

  /*
   * Fuente general del partido.
   *
   * Puede ser:
   * - flashscore
   * - fotmob
   * - api-football
   * - bookmaker / 1xBet
   *
   * Se utiliza para:
   * - abrir detalle
   * - review
   * - identidad general
   */
  const source =
    getPreferredMatchSource(
      match
    );

  /*
   * Fuente específicamente apta
   * para MatchContext.
   *
   * Actualmente:
   * - Flashscore
   * - FotMob
   *
   * Un partido exclusivamente 1xBet
   * seguirá siendo visible, pero mostrará
   * "Contexto limitado".
   */
  const contextSource =
    getMatchContextSource(
      match
    );

  const openMatch =
    () => {

      if (!source) {
        return;
      }

      router.push({
        pathname:
          "/match/[provider]/[id]",

        params: {
          provider:
            source.provider,

          id:
            source.externalId,
        },
      });
    };

  const minuteLabel =
    match.status.minute !==
    null
      ? `${match.status.minute}'`
      : match.status.short;

  const homeGoals =
    match.home.goals ??
    "-";

  const awayGoals =
    match.away.goals ??
    "-";

  return (
    <View
      style={
        styles.card
      }
    >
      {/*
       * =========================
       * MATCH HEADER
       * =========================
       */}
      <TouchableOpacity
        activeOpacity={
          0.82
        }
        disabled={
          !source
        }
        onPress={
          openMatch
        }
      >
        <View
          style={
            styles.meta
          }
        >
          <Text
            numberOfLines={
              1
            }
            style={
              styles.competition
            }
          >
            {match.competition
              .country}
            {" · "}
            {match.competition
              .name}
          </Text>

          <Text
            style={
              styles.minute
            }
          >
            {minuteLabel}
          </Text>
        </View>

        <View
          style={
            styles.scoreRow
          }
        >
          <Text
            numberOfLines={
              2
            }
            style={
              styles.homeTeam
            }
          >
            {match.home.name}
          </Text>

          <Text
            style={
              styles.score
            }
          >
            {homeGoals}
            {" - "}
            {awayGoals}
          </Text>

          <Text
            numberOfLines={
              2
            }
            style={
              styles.awayTeam
            }
          >
            {match.away.name}
          </Text>
        </View>
      </TouchableOpacity>

		<LiveTeamMemoryInsight
  match={
    match
  }
  autoLoad={
    contextVisible
  }
/>

      {/*
       * =========================
       * MATCH CONTEXT
       * =========================
       *
       * Flashscore/FotMob:
       * cargamos tabla, posición,
       * forma, etc.
       *
       * 1xBet-only:
       * NO ocultamos el partido.
       * Mostramos contexto limitado.
       */}
      {contextSource ? (
        <MatchContextSummary
          match={
            match
          }
          autoLoad={
            contextVisible
          }
        />
      ) : (
        <MatchContextUnavailable
          match={
            match
          }
        />
      )}

      {/*
       * =========================
       * PERSONAL TEAM MEMORY
       * =========================
       *
       * Funciona independientemente
       * de si existe MatchContext.
       */}
      
      {/*
       * =========================
       * COPY ACTIONS
       * =========================
       */}
      <MatchCopyActions
        home={
          match.home.name
        }
        away={
          match.away.name
        }
      />

      {/*
       * =========================
       * REVIEW STATE
       * =========================
       *
       * También funciona con 1xBet:
       *
       * provider = bookmaker
       * externalId = ID de 1xBet
       */}
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
