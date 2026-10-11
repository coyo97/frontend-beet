import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  radarReviewKey,
  useRadarReviewStore,
} from "@/features/radar-review/store/radarReviewStore";

import {
  matchPickKey,
} from "@/features/match-picks/store/matchPickKey";

import {
  useMatchPickStore,
} from "@/features/match-picks/store/matchPickStore";

import {
  MatchPickQuickActions,
} from "@/features/match-picks/components/MatchPickQuickActions";

import {
  LiveTeamMemoryInsight,
} from "@/features/team-memory/components/LiveTeamMemoryInsight";

import {
  LiveOpponentMemoryInsight,
} from "@/features/team-memory/components/LiveOpponentMemoryInsight";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  ShareMatchQuickActions,
} from "@/features/shared-match/components/ShareMatchQuickActions";

import {
  MatchTeamMemoryQuickActions,
} from "@/features/team-memory/components/MatchTeamMemoryQuickActions";

import {
  MatchTeamMemory,
} from "@/features/team-memory/components/MatchTeamMemory";

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

  
  const source =
    getPreferredMatchSource(
      match
    );

	const reviewKey =
  source
    ? radarReviewKey(
        source.provider,
        source.externalId
      )
    : null;

const reviewStatus =
  useRadarReviewStore(
    (
      state
    ) =>
      reviewKey
        ? state.items[
            reviewKey
          ]?.status ??
          "new"
        : "new"
  );

const isReviewed =
  reviewStatus ===
  "reviewed";

const pickKey =
  matchPickKey(
    match
  );

const activePick =
  useMatchPickStore(
    state =>
      state.items[
        pickKey
      ]
  );
 
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
  style={[
    styles.card,

    isReviewed &&
      styles.cardReviewed,

    Boolean(
      activePick
    ) &&
      styles.cardBetPending,
  ]}
>          {/*
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

      {/*
       * =========================
       * QUICK MEMORY ACTIONS
       * =========================
       *
       * Aquí están ahora:
       *
       * - resumen Ganó / Perdió
       * - botón Ganó
       * - botón Perdió
       *
       * Sin volver a repetir
       * los nombres de los equipos.
       */}
      <MatchPickQuickActions
  match={
    match
  }
/>
<LiveTeamMemoryInsight
  match={
    match
  }
  autoLoad={
    contextVisible
  }
/>

		  <LiveOpponentMemoryInsight
  match={
    match
  }
  autoLoad={
    contextVisible
  }
/>

<MatchTeamMemory
  match={
    match
  }
  autoLoad={
    contextVisible
  }
/>

      {/*
       * =========================
       * PERSONAL HISTORY
       * =========================
       *
       * Solo:
       *
       * TU HISTORIAL ▼
       *
       * Al abrirlo se muestran
       * detalles históricos/perfil,
       * pero no repetimos las
       * acciones Ganó / Perdió.
       */}
      <MatchTeamMemory
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
       * SofaScore / Flashscore /
       * FotMob, según la fuente
       * compatible disponible.
       *
       * Si no existe contexto
       * completo, mostramos
       * contexto limitado.
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
       * SHARE
       * =========================
       */}
      <ShareMatchQuickActions
        match={
          match
        }
      />

      {/*
       * =========================
       * REVIEW STATE
       * =========================
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
