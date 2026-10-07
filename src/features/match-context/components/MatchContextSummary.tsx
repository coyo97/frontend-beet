import React, {
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  AppBadge,
} from "@/shared/ui/atoms/AppBadge";

import {
  useAdaptiveMatchContext,
} from "../hooks/useAdaptiveMatchContext";

import {
  TeamContextSnapshot,
} from "./TeamContextSnapshot";

import {
  styles,
} from "./MatchContextSummary.styles";

interface Props {
  match:
    LiveMatch;

  autoLoad?:
    boolean;

  expandedByDefault?:
    boolean;
}

function competitionLabel(
  format:
    string,

  tableAvailable:
    boolean
): string {

  if (
    tableAvailable
  ) {
    return "Tabla de esta competición";
  }

  switch (
    format
  ) {
    case "cup":
      return "Copa";

    case "playoff":
      return "Playoff";

    case "qualifier":
      return "Clasificación";

    case "friendly":
      return "Amistoso";

    default:
      return "Contexto del torneo";
  }
}

function providerLabel(
  provider:
    string
): string {

  switch (
    provider
  ) {
    case "api-football":
      return "API-Football";

    case "flashscore":
      return "Flashscore";

    case "sofascore":
      return "SofaScore";

    case "fotmob":
      return "FotMob";

    case "bookmaker":
      return "1xBet";

    case "manual":
      return "Manual";

    default:
      return provider;
  }
}

export function MatchContextSummary({
  match,
  autoLoad = true,
  expandedByDefault = false,
}: Props) {

  const [
    expanded,
    setExpanded,
  ] =
    useState(
      expandedByDefault
    );

  /*
   * Metadata necesaria especialmente
   * para fallbacks como bookmaker ->
   * fuentes externas.
   */
  const requestMetadata =
    useMemo(
      () => ({
        competitionId:
          match.competition
            .id,

        competitionName:
          match.competition
            .name,

        country:
          match.competition
            .country ||
          null,

        homeName:
          match.home
            .name,

        awayName:
          match.away
            .name,
      }),
      [
        match.competition
          .id,

        match.competition
          .name,

        match.competition
          .country,

        match.home
          .name,

        match.away
          .name,
      ]
    );

  /*
   * Selección adaptativa:
   *
   * Flashscore
   * -> FotMob
   * -> SofaScore
   * -> bookmaker
   *
   * Si la fuente preferida devuelve
   * poco contexto, el hook continúa
   * probando las siguientes.
   *
   * Finalmente conserva el contexto
   * de mayor calidad disponible.
   */
  const {
    source,
    context,
    loading,
    error,
    quality,
  } =
    useAdaptiveMatchContext({
      match,

      enabled:
        autoLoad,

      metadata:
        requestMetadata,
    });

  /*
   * Todas las fuentes que detectaron
   * este LiveMatch.
   *
   * Ej:
   *
   * Flashscore · SofaScore · 1xBet
   */
  const matchSources =
    useMemo(
      () =>
        Array.from(
          new Set(
            match.sources
              .map(
                item =>
                  providerLabel(
                    item.provider
                  )
              )
          )
        )
          .join(
            " · "
          ),
      [
        match.sources,
      ]
    );

  if (
    !source &&
    !context
  ) {
    return null;
  }

  if (
    loading &&
    !context
  ) {
    return (
      <View
        style={
          styles.loader
        }
      >
        <ActivityIndicator
          size="small"
        />

        <Text
          style={
            styles.loaderText
          }
        >
          Consultando tabla y forma...
        </Text>
      </View>
    );
  }

  if (
    error &&
    !context
  ) {
    return (
      <Text
        style={
          styles.unavailable
        }
      >
        Contexto de tabla no disponible para este partido.
      </Text>
    );
  }

  if (
    !context
  ) {
    return null;
  }

  const hasRecent =
    context.home
      .recentMatches
      .length >
      0 ||
    context.away
      .recentMatches
      .length >
      0;

  /*
   * Esta es la fuente REAL que terminó
   * proporcionando el contexto.
   *
   * No necesariamente coincide con
   * source, que representa el candidato
   * solicitado.
   */
  const contextSource =
    providerLabel(
      context.source
        .provider
    );

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.top
        }
      >
        <View
          style={
            styles.competitionInfo
          }
        >
          <Text
            numberOfLines={
              1
            }
            style={
              styles.competitionName
            }
          >
            {context.competition.name}
          </Text>

          <Text
            style={
              styles.competitionType
            }
          >
            {competitionLabel(
              context.competition
                .format,

              context.competition
                .tableAvailable
            )}
          </Text>

          <Text
            style={
              styles.competitionType
            }
          >
            Fuente contexto:{" "}
            {contextSource}
          </Text>

          <Text
            style={
              styles.competitionType
            }
          >
            Fuentes partido:{" "}
            {matchSources}
          </Text>

          {/*
           * Temporalmente dejamos visible
           * esta puntuación para comprobar
           * que la selección adaptativa
           * funciona.
           *
           * Luego podemos quitarla.
           */}
          <Text
            style={
              styles.competitionType
            }
          >
            Calidad contexto:{" "}
            {quality}
          </Text>
        </View>

        {context.competition
          .tableAvailable ? (
          <AppBadge
            label="TABLA"
            tone="info"
          />
        ) : (
          <AppBadge
            label="SIN TABLA"
            tone="neutral"
          />
        )}
      </View>

      <TeamContextSnapshot
        team={
          context.home
        }
        expanded={
          expanded
        }
      />

      <TeamContextSnapshot
        team={
          context.away
        }
        expanded={
          expanded
        }
      />

      {hasRecent && (
        <TouchableOpacity
          activeOpacity={
            0.8
          }
          onPress={
            () =>
              setExpanded(
                (
                  current
                ) =>
                  !current
              )
          }
          style={
            styles.expandButton
          }
        >
          <Text
            style={
              styles.expandText
            }
          >
            {expanded
              ? "Ocultar últimos partidos"
              : "Ver últimos 5 partidos"}
          </Text>
        </TouchableOpacity>
      )}

      {context.lineups
        .status !==
        "unavailable" && (
        <View
          style={
            styles.lineup
          }
        >
          <Text
            style={
              styles.lineupTitle
            }
          >
            XI{" "}
            {context.lineups
              .status ===
            "confirmed"
              ? "confirmado"
              : "parcial"}
          </Text>

          <Text
            style={
              styles.lineupValue
            }
          >
            {context.lineups
              .homeFormation ??
              "?"}

            {"  /  "}

            {context.lineups
              .awayFormation ??
              "?"}
          </Text>
        </View>
      )}

      {context.competition
        .note && (
        <Text
          style={
            styles.note
          }
        >
          {context.competition
            .note}
        </Text>
      )}
    </View>
  );
}
