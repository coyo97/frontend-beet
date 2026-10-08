import React from "react";

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
  useMatchTeamMemory,
} from "../hooks/useMatchTeamMemory";

import {
  useTeamMemoryStore,
} from "../store/teamMemoryStore";

import {
  styles,
} from "./MatchTeamMemoryQuickActions.styles";

interface Props {
  match:
    LiveMatch;

  autoLoad?:
    boolean;
}

export function MatchTeamMemoryQuickActions({
  match,
  autoLoad = true,
}: Props) {

  const {
    homeKey,
    awayKey,
    homeSummary,
    awaySummary,
    homeLoading,
    awayLoading,
  } =
    useMatchTeamMemory(
      match,
      {
        enabled:
          autoLoad,
      }
    );

  const record =
    useTeamMemoryStore(
      (
        state
      ) =>
        state.record
    );

  const mutatingKeys =
    useTeamMemoryStore(
      (
        state
      ) =>
        state.mutatingKeys
    );

  const source =
    getPreferredMatchSource(
      match
    );

  const save =
    (
      teamName:
        string,

      opponentName:
        string,

      outcome:
        "win" |
        "loss"
    ) => {

      void record({
        teamName,

        opponentName,

        outcome,

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
      });
    };

  const homeMutating =
    Boolean(
      mutatingKeys[
        homeKey
      ]
    );

  const awayMutating =
    Boolean(
      mutatingKeys[
        awayKey
      ]
    );

  const summaryText =
    (
      loading:
        boolean,

      wins:
        number | undefined,

      losses:
        number | undefined
    ) => {

      if (loading) {
        return "cargando...";
      }

      const winCount =
        wins ?? 0;

      const lossCount =
        losses ?? 0;

      if (
        winCount === 0 &&
        lossCount === 0
      ) {
        return "sin historial";
      }

      return (
        `🟢 ${winCount} · ` +
        `🔴 ${lossCount}`
      );
    };

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.side
        }
      >
        <Text
          style={
            styles.summary
          }
        >
          {summaryText(
            homeLoading,
            homeSummary?.wins,
            homeSummary?.losses
          )}
        </Text>

        <View
          style={
            styles.actions
          }
        >
          <TouchableOpacity
            disabled={
              homeMutating
            }
            onPress={
              () =>
                save(
                  match.home.name,
                  match.away.name,
                  "win"
                )
            }
            style={[
              styles.button,
              styles.winButton,
            ]}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              🟢 Ganó
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              homeMutating
            }
            onPress={
              () =>
                save(
                  match.home.name,
                  match.away.name,
                  "loss"
                )
            }
            style={[
              styles.button,
              styles.lossButton,
            ]}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              🔴 Perdió
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.side,
          styles.sideRight,
        ]}
      >
        <Text
          style={[
            styles.summary,
            styles.rightText,
          ]}
        >
          {summaryText(
            awayLoading,
            awaySummary?.wins,
            awaySummary?.losses
          )}
        </Text>

        <View
          style={[
            styles.actions,
            styles.actionsRight,
          ]}
        >
          <TouchableOpacity
            disabled={
              awayMutating
            }
            onPress={
              () =>
                save(
                  match.away.name,
                  match.home.name,
                  "win"
                )
            }
            style={[
              styles.button,
              styles.winButton,
            ]}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              🟢 Ganó
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={
              awayMutating
            }
            onPress={
              () =>
                save(
                  match.away.name,
                  match.home.name,
                  "loss"
                )
            }
            style={[
              styles.button,
              styles.lossButton,
            ]}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              🔴 Perdió
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
