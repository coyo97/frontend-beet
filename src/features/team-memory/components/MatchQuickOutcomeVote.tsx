import React, {
  useState,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

import type {
  TeamMemoryOutcome,
} from "../types/teamMemory";

import {
  TeamMemoryOutcomeModal,
} from "./TeamMemoryOutcomeModal";

import {
  styles,
} from "./MatchQuickOutcomeVote.styles";

interface Props {
  match:
    LiveMatch;
}

interface PendingOutcome {
  teamName:
    string;

  opponentName:
    string;

  outcome:
    TeamMemoryOutcome;

  key:
    string;
}

export function MatchQuickOutcomeVote({
  match,
}: Props) {

  /*
   * ========================================
   * MODAL PENDIENTE
   * ========================================
   *
   * Esta es la lógica antigua:
   *
   * tocar Gané/Perdí
   *       ↓
   * abrir modal
   *       ↓
   * contexto opcional
   *       ↓
   * Guardar
   */
  const [
    pending,
    setPending,
  ] =
    useState<
      PendingOutcome |
      null
    >(
      null
    );

  const record =
    useTeamMemoryStore(
      state =>
        state.record
    );

  const mutatingKeys =
    useTeamMemoryStore(
      state =>
        state.mutatingKeys
    );

  const source =
    getPreferredMatchSource(
      match
    );

  const homeKey =
    teamMemoryKey(
      match.home.name
    );

  const awayKey =
    teamMemoryKey(
      match.away.name
    );

  /*
   * ========================================
   * ABRIR MODAL
   * ========================================
   *
   * IMPORTANTE:
   *
   * Aquí todavía NO guardamos.
   */
  const chooseOutcome =
    (
      teamName:
        string,

      opponentName:
        string,

      outcome:
        TeamMemoryOutcome
    ) => {

      setPending({
        teamName,

        opponentName,

        outcome,

        key:
          teamMemoryKey(
            teamName
          ),
      });
    };

  /*
   * ========================================
   * GUARDAR
   * ========================================
   *
   * TeamMemoryOutcomeModal nos devuelve:
   *
   * note: string | null
   *
   * El contexto sigue siendo opcional.
   */
  const saveOutcome =
    async (
      note:
        string |
        null
    ) => {

      if (!pending) {
        return;
      }

      await record({
        teamName:
          pending.teamName,

        outcome:
          pending.outcome,

        opponentName:
          pending.opponentName,

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

      setPending(
        null
      );
    };

  const renderTeam =
    (
      teamName:
        string,

      opponentName:
        string,

      key:
        string
    ) => {

      const mutating =
        Boolean(
          mutatingKeys[
            key
          ]
        );

      return (
        <View
          style={
            styles.teamRow
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

          <TouchableOpacity
            disabled={
              mutating
            }
            activeOpacity={
              0.75
            }
            style={[
              styles.button,
              styles.win,

              mutating &&
                styles.disabled,
            ]}
            onPress={
              () =>
                chooseOutcome(
                  teamName,
                  opponentName,
                  "win"
                )
            }
          >
            <Text
              style={
                styles.text
              }
            >
              + Gané
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              mutating
            }
            activeOpacity={
              0.75
            }
            style={[
              styles.button,
              styles.loss,

              mutating &&
                styles.disabled,
            ]}
            onPress={
              () =>
                chooseOutcome(
                  teamName,
                  opponentName,
                  "loss"
                )
            }
          >
            <Text
              style={
                styles.text
              }
            >
              + Perdí
            </Text>
          </TouchableOpacity>
        </View>
      );
    };

  const saving =
    pending
      ? Boolean(
          mutatingKeys[
            pending.key
          ]
        )
      : false;

  return (
    <>
      <View
        style={
          styles.container
        }
      >
        {renderTeam(
          match.home.name,
          match.away.name,
          homeKey
        )}

        {renderTeam(
          match.away.name,
          match.home.name,
          awayKey
        )}
      </View>

      {/*
       * ======================================
       * MODAL ORIGINAL
       * ======================================
       *
       * Este es el componente que ya tenías
       * en tu Git con el TextInput.
       */}
      <TeamMemoryOutcomeModal
        visible={
          pending !==
          null
        }
        teamName={
          pending
            ?.teamName ??
          ""
        }
        outcome={
          pending
            ?.outcome ??
          null
        }
        saving={
          saving
        }
        onCancel={
          () =>
            setPending(
              null
            )
        }
        onSave={
          note => {
            void saveOutcome(
              note
            );
          }
        }
      />
    </>
  );
}
