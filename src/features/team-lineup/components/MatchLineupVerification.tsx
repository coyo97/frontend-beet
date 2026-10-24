import React from "react";

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
  teamLineupKey,
  useTeamLineupStore,
} from "../store/teamLineupStore";

import type {
  RotationLevel,
  StarterHistoryStat,
  TeamLineupAnalysis,
} from "../types/teamLineup";

import {
  styles,
} from "./MatchLineupVerification.styles";

interface Props {
  match:
    LiveMatch;

  selectedSide:
    "home" |
    "away";
}

function rotationText(
  value:
    RotationLevel
): string {

  switch (
    value
  ) {
    case "low":
      return "Rotación baja";

    case "medium":
      return "Rotación media";

    case "high":
      return "Rotación alta";

    default:
      return "Muestra insuficiente";
  }
}

function MissingPlayer({
  player,
}: {
  player:
    StarterHistoryStat;
}) {

  return (
    <Text
      style={
        styles.missingPlayer
      }
    >
      ⚠ {player.name}
      {" · "}
      {player.starts}/
      {player.matchesObserved}
    </Text>
  );
}

function TeamResult({
  analysis,
}: {
  analysis:
    TeamLineupAnalysis;
}) {

  const nonHabitual =
    analysis.currentStarters
      .filter(
        player =>
          player.frequency !==
          "habitual"
      );

  return (
    <View
      style={
        styles.result
      }
    >
      <View
        style={
          styles.resultHeader
        }
      >
        <Text
          style={
            styles.teamName
          }
        >
          {analysis.teamName}
        </Text>

        <Text
          style={[
            styles.rotation,

            analysis.rotationLevel ===
              "high" &&
              styles.rotationHigh,

            analysis.rotationLevel ===
              "medium" &&
              styles.rotationMedium,

            analysis.rotationLevel ===
              "low" &&
              styles.rotationLow,
          ]}
        >
          {rotationText(
            analysis.rotationLevel
          )}
        </Text>
      </View>

      <Text
        style={
          styles.summary
        }
      >
        Historial:{" "}
        {analysis.historicalMatches}
        {" · "}
        Habituales presentes:{" "}
        {analysis.habitualPresent}/
        {analysis.habitualPool.length}
      </Text>

      {analysis
        .habitualMissing
        .length >
        0 && (
        <View
          style={
            styles.warningBlock
          }
        >
          <Text
            style={
              styles.warningTitle
            }
          >
            Habituales ausentes
          </Text>

          {analysis
            .habitualMissing
            .map(
              player => (
                <MissingPlayer
                  key={
                    player.playerId ??
                    player.name
                  }
                  player={
                    player
                  }
                />
              )
            )}
        </View>
      )}

      {nonHabitual.length >
        0 && (
        <View
          style={
            styles.currentBlock
          }
        >
          <Text
            style={
              styles.currentTitle
            }
          >
            XI actual no habitual
          </Text>

          {nonHabitual
            .slice(
              0,
              5
            )
            .map(
              player => (
                <Text
                  key={
                    player.playerId ??
                    player.name
                  }
                  style={
                    styles.currentPlayer
                  }
                >
                  • {player.name}
                  {" · "}
                  {player.historyStarts}/
                  {player.historyMatches}
                  {" · "}
                  {player.frequency}
                </Text>
              )
            )}
        </View>
      )}
    </View>
  );
}

export function MatchLineupVerification({
  match,
  selectedSide,
}: Props) {

  /*
   * Este módulo por ahora depende
   * específicamente de Flashscore.
   */
  const source =
    match.sources.find(
      item =>
        item.provider ===
        "flashscore"
    ) ??
    null;

  const key =
    source
      ? teamLineupKey(
          source.provider,
          source.externalId
        )
      : null;

  const entry =
    useTeamLineupStore(
      state =>
        key
          ? state.entries[
              key
            ]
          : undefined
    );

  const inspect =
    useTeamLineupStore(
      state =>
        state.inspect
    );

  if (!source) {

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
          ALINEACIÓN
        </Text>

        <Text
          style={
            styles.unavailable
          }
        >
          Este partido no tiene fuente
          Flashscore para verificar titulares.
        </Text>
      </View>
    );
  }

  const data =
    entry?.data ??
    null;

  const analysis =
    data
      ? selectedSide ===
          "home"
        ? data.analysis
            .home
        : data.analysis
            .away
      : null;

  const needsHistory =
    Boolean(
      data &&
      data.lineup
        .status ===
        "confirmed" &&
      analysis &&
      analysis
        .historicalMatches <
        data.history
          .minimumMatches
    );

  const verify =
    () => {

      void inspect(
        source.provider,
        source.externalId,
        false
      );
    };

  const loadHistory =
    () => {

      void inspect(
        source.provider,
        source.externalId,
        true
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
          styles.header
        }
      >
        <Text
          style={
            styles.title
          }
        >
          ALINEACIÓN
        </Text>

        {data && (
          <Text
            style={
              styles.source
            }
          >
            {data.lineupSource ===
              "cache"
              ? "Guardada"
              : "Flashscore"}
          </Text>
        )}
      </View>

      {!data &&
        !entry?.loading && (
        <>
          <Text
            style={
              styles.pending
            }
          >
            Todavía no verificaste
            los titulares.
          </Text>

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            onPress={
              verify
            }
            style={
              styles.primaryButton
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Verificar titulares
            </Text>
          </TouchableOpacity>
        </>
      )}

      {entry?.loading && (
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator
            size="small"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Verificando alineación…
          </Text>
        </View>
      )}

      {entry?.error && (
        <>
          <Text
            style={
              styles.error
            }
          >
            {entry.error}
          </Text>

          {!entry.loading && (
            <TouchableOpacity
              activeOpacity={
                0.8
              }
              onPress={
                verify
              }
              style={
                styles.secondaryButton
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Reintentar
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {data &&
        data.lineup.status ===
          "unavailable" && (
        <>
          <Text
            style={
              styles.pending
            }
          >
            Flashscore todavía no publicó
            una alineación confirmada.
          </Text>

          {!entry?.loading && (
            <TouchableOpacity
              activeOpacity={
                0.8
              }
              onPress={
                verify
              }
              style={
                styles.secondaryButton
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Verificar de nuevo
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {analysis &&
        data?.lineup
          .status ===
          "confirmed" && (
        <>
          <TeamResult
            analysis={
              analysis
            }
          />

          {needsHistory && (
            <View
              style={
                styles.historyBlock
              }
            >
              <Text
                style={
                  styles.historyWarning
                }
              >
                Solo hay{" "}
                {analysis.historicalMatches}
                {" "}
                partido(s) de referencia.
              </Text>

              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  entry?.loading
                }
                onPress={
                  loadHistory
                }
                style={
                  styles.secondaryButton
                }
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Cargar últimos partidos
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
