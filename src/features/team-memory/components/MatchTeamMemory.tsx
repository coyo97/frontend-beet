import React, {
  useState,
} from "react";

import {
  Text,
  View,
} from "react-native";

import {
  TeamPersonalProfileEditor,
} from "@/features/team-profile/components/TeamPersonalProfileEditor";

import type {
  LiveMatch,
} from "@/types/radar";


import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  teamMemoryKey,
  useTeamMemoryStore,
} from "../store/teamMemoryStore";

import {
  MatchTeamMemoryStrip,
} from "./MatchTeamMemoryStrip";

import {
  TeamMemoryRow,
} from "./TeamMemoryRow";

import {
  styles,
} from "./MatchTeamMemory.styles";

interface Props {
  match:
    LiveMatch;

  autoLoad?:
    boolean;

  expandedByDefault?:
    boolean;
}

export function MatchTeamMemory({
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

  const [
    expandedTeam,
    setExpandedTeam,
  ] =
    useState<
      string |
      null
    >(
      null
    );

  /*
   * ========================================
   * STORE
   * ========================================
   */

  const ensureHistory =
    useTeamMemoryStore(
      state =>
        state.ensureHistory
    );

  const record =
    useTeamMemoryStore(
      state =>
        state.record
    );

  const removeEvent =
    useTeamMemoryStore(
      state =>
        state.removeEvent
    );

  const summaries =
    useTeamMemoryStore(
      state =>
        state.summaries
    );

  const history =
    useTeamMemoryStore(
      state =>
        state.history
    );

  const loadingKeys =
    useTeamMemoryStore(
      state =>
        state.loadingKeys
    );

  const historyLoadingKeys =
    useTeamMemoryStore(
      state =>
        state.historyLoadingKeys
    );

  const mutatingKeys =
    useTeamMemoryStore(
      state =>
        state.mutatingKeys
    );

  /*
   * ========================================
   * TEAM KEYS
   * ========================================
   */

  const homeKey =
    teamMemoryKey(
      match.home.name
    );

  const awayKey =
    teamMemoryKey(
      match.away.name
    );

  const source =
    getPreferredMatchSource(
      match
    );

  /*
   * ========================================
   * HISTORIAL
   * ========================================
   */

  const toggleHistory =
    (
      teamName:
        string
    ) => {

      const key =
        teamMemoryKey(
          teamName
        );

      if (
        expandedTeam ===
        key
      ) {
        setExpandedTeam(
          null
        );

        return;
      }

      setExpandedTeam(
        key
      );

      void ensureHistory(
        teamName
      );
    };

  /*
   * ========================================
   * REGISTRO
   * ========================================
   *
   * Se conserva esta función porque
   * TeamMemoryRow todavía recibe
   * onWin / onLoss.
   *
   * En esta pantalla las acciones
   * están ocultas mediante:
   *
   * showActions={false}
   *
   * El voto visible lo maneja:
   *
   * MatchQuickOutcomeVote
   * ========================================
   */

  const recordForTeam =
    (
      teamName:
        string,

      opponentName:
        string,

      outcome:
        "win" |
        "loss",

      note:
        string |
        null
    ) => {

      void record({
        teamName,

        outcome,

        opponentName,

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

        note:
          note?.trim() ||
          null,
      });
    };

  return (
    <View
      style={
        styles.container
      }
    >

      {/*
       * ========================================
       * HISTORIAL COMPACTO
       * ========================================
       *
       * Ahora debe funcionar únicamente
       * como control para desplegar.
       *
       * Ideal:
       *
       *         TU HISTORIAL ▼
       *
       * Los nombres de los equipos
       * ya están en el encabezado
       * principal del partido.
       * ========================================
       */}

      <MatchTeamMemoryStrip
        match={
          match
        }
        autoLoad={
          autoLoad
        }
        expanded={
          expanded
        }
        onToggle={
          () =>
            setExpanded(
              current =>
                !current
            )
        }
      />

      {/*
       * ========================================
       * VOTO RÁPIDO
       * ========================================
       *
       * Esta es ahora la ÚNICA zona
       * visible para votar.
       *
       * No duplicamos Ganó / Perdió
       * dentro de TeamMemoryRow.
       * ========================================
       */}

      
      {/*
       * ========================================
       * DETALLE EXPANDIBLE
       * ========================================
       *
       * Aquí dejamos:
       *
       * - resumen
       * - historial
       * - notas
       * - eliminar registros
       * - perfil personal del equipo
       *
       * Pero NO botones Ganó / Perdió.
       * ========================================
       */}

      {expanded && (
        <View
          style={
            styles.details
          }
        >

          <Text
            style={
              styles.help
            }
          >
            Consulta tu historial y tus notas para cada equipo.
          </Text>

          {/*
           * ========================================
           * LOCAL
           * ========================================
           */}

          <TeamMemoryRow
            teamName={
              match.home.name
            }
            summary={
              summaries[
                homeKey
              ]
            }
            history={
              history[
                homeKey
              ] ??
              []
            }
            loading={
              Boolean(
                loadingKeys[
                  homeKey
                ]
              )
            }
            historyLoading={
              Boolean(
                historyLoadingKeys[
                  homeKey
                ]
              )
            }
            mutating={
              Boolean(
                mutatingKeys[
                  homeKey
                ]
              )
            }
            expanded={
              expandedTeam ===
              homeKey
            }
            onToggleHistory={
              () =>
                toggleHistory(
                  match.home.name
                )
            }
            onWin={
              note =>
                recordForTeam(
                  match.home.name,
                  match.away.name,
                  "win",
                  note
                )
            }
            onLoss={
              note =>
                recordForTeam(
                  match.home.name,
                  match.away.name,
                  "loss",
                  note
                )
            }
            onDelete={
              event => {
                void removeEvent(
                  event
                );
              }
            }

            /*
             * MUY IMPORTANTE:
             *
             * Ganó / Perdió ya están
             * en MatchQuickOutcomeVote.
             */
            showActions={
              false
            }
          />

          {expandedTeam ===
            homeKey && (
            <TeamPersonalProfileEditor
              teamName={
                match.home.name
              }
            />
          )}

          {/*
           * ========================================
           * VISITANTE
           * ========================================
           */}

          <TeamMemoryRow
            teamName={
              match.away.name
            }
            summary={
              summaries[
                awayKey
              ]
            }
            history={
              history[
                awayKey
              ] ??
              []
            }
            loading={
              Boolean(
                loadingKeys[
                  awayKey
                ]
              )
            }
            historyLoading={
              Boolean(
                historyLoadingKeys[
                  awayKey
                ]
              )
            }
            mutating={
              Boolean(
                mutatingKeys[
                  awayKey
                ]
              )
            }
            expanded={
              expandedTeam ===
              awayKey
            }
            onToggleHistory={
              () =>
                toggleHistory(
                  match.away.name
                )
            }
            onWin={
              note =>
                recordForTeam(
                  match.away.name,
                  match.home.name,
                  "win",
                  note
                )
            }
            onLoss={
              note =>
                recordForTeam(
                  match.away.name,
                  match.home.name,
                  "loss",
                  note
                )
            }
            onDelete={
              event => {
                void removeEvent(
                  event
                );
              }
            }

            /*
             * Igual que local:
             * acciones ocultas aquí.
             */
            showActions={
              false
            }
          />

          {expandedTeam ===
            awayKey && (
            <TeamPersonalProfileEditor
              teamName={
                match.away.name
              }
            />
          )}

        </View>
      )}
    </View>
  );
}
