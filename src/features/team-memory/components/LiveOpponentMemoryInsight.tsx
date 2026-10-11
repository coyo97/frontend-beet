import React, {
  useEffect,
} from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  teamMemoryKey,
  useTeamMemoryStore,
} from "../store/teamMemoryStore";

import type {
  TeamMemoryOpponentSummary,
} from "../types/teamMemory";

import {
  styles,
} from "./LiveOpponentMemoryInsight.styles";

interface Props {
  match:
    LiveMatch;

  autoLoad?:
    boolean;
}

export function LiveOpponentMemoryInsight({
  match,
  autoLoad = true,
}: Props) {

  const opponentSummaries =
    useTeamMemoryStore(
      state =>
        state.opponentSummaries
    );

  const loadAll =
    useTeamMemoryStore(
      state =>
        state.loadAllOpponentSummaries
    );

  const loading =
    useTeamMemoryStore(
      state =>
        state.allOpponentSummariesLoading
    );

  useEffect(
    () => {

      if (!autoLoad) {
        return;
      }

      void loadAll();

    },
    [
      autoLoad,
      loadAll,
    ]
  );

  const home =
    opponentSummaries[
      teamMemoryKey(
        match.home.name
      )
    ];

  const away =
    opponentSummaries[
      teamMemoryKey(
        match.away.name
      )
    ];

  const rows =
    [
      home,
      away,
    ].filter(
      (
        value
      ): value is
        TeamMemoryOpponentSummary =>
          Boolean(
            value
          )
    );

  if (
    rows.length ===
    0
  ) {
    return null;
  }

  if (
    loading &&
    rows.length ===
    0
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
        ⚔️ RIVAL HISTÓRICO
      </Text>

      {rows.map(
        opponent => {

          const teams =
            opponent
              .backedTeams
              .slice(
                0,
                3
              )
              .join(
                " · "
              );

          return (
            <View
              key={
                opponent
                  .opponentKey
              }
              style={
                styles.row
              }
            >
              <Text
                style={
                  styles.team
                }
              >
                {
                  opponent
                    .opponentName
                }
              </Text>

              <Text
                style={
                  styles.description
                }
              >
                Apareció{" "}
                {
                  opponent
                    .appearances
                }{" "}
                {
                  opponent
                    .appearances ===
                  1
                    ? "vez"
                    : "veces"
                }{" "}
                como rival de equipos de tu memoria.
              </Text>

              {teams && (
                <Text
                  style={
                    styles.backedTeams
                  }
                >
                  Contra tus equipos:{" "}
                  {teams}
                </Text>
              )}

              <View
                style={
                  styles.stats
                }
              >
                <Text
                  style={
                    styles.statWin
                  }
                >
                  🟢 {
                    opponent
                      .winEvents
                  }
                </Text>

                <Text
                  style={
                    styles.statLoss
                  }
                >
                  🔴 {
                    opponent
                      .lossEvents
                  }
                </Text>

                <Text
                  style={
                    styles.statHelp
                  }
                >
                  en tus apuestas de esos cruces
                </Text>
              </View>

              {opponent
                .lastBackedTeamName && (
                <Text
                  style={
                    styles.last
                  }
                >
                  Último cruce registrado: vs{" "}
                  {
                    opponent
                      .lastBackedTeamName
                  }
                </Text>
              )}
            </View>
          );
        }
      )}
    </View>
  );
}
