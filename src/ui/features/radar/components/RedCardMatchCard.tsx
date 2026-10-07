import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  RedCardRadarMatch,
} from "@/types/radar";

import {
  RedCardContextSection,
} from "@/features/radar/components/RedCardContextSection";

import {
  styles,
} from "./RedCardMatchCard.styles";

interface Props {
  item:
    RedCardRadarMatch;

  onPress?:
    () => void;
}

export default function RedCardMatchCard({
  item,
  onPress,
}: Props) {

  const {
    match,
    redCards,
  } = item;

  const homeHasRed =
    redCards.home >
    0;

  const awayHasRed =
    redCards.away >
    0;

  return (
    <View
      style={
        styles.card
      }
    >
      {/*
       * ============================
       * MATCH HEADER
       * ============================
       *
       * Solo esta parte abre el
       * detalle del partido.
       *
       * No envolvemos toda la card
       * porque debajo tenemos botones
       * interactivos propios.
       */}

      <TouchableOpacity
        activeOpacity={
          0.85
        }
        disabled={
          !onPress
        }
        onPress={
          onPress
        }
      >
        {/*
         * ============================
         * COMPETITION / MINUTE
         * ============================
         */}

        <View
          style={
            styles.header
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
            {match
              .competition
              .country}
            {" · "}
            {match
              .competition
              .name}
          </Text>

          <Text
            style={
              styles.minute
            }
          >
            {match.status
              .minute !==
            null
              ? `${match.status.minute}'`
              : match.status.short}
          </Text>
        </View>

        {/*
         * ============================
         * HOME TEAM
         * ============================
         */}

        <View
          style={[
            styles.teamRow,

            homeHasRed &&
              styles.redTeamRow,
          ]}
        >
          <View
            style={
              styles.teamInfo
            }
          >
            <View
              style={
                styles.teamNameRow
              }
            >
              <Text
                numberOfLines={
                  2
                }
                style={
                  styles.team
                }
              >
                {match.home.name}
              </Text>

              {homeHasRed && (
                <View
                  style={
                    styles.redBadge
                  }
                >
                  <Text
                    style={
                      styles.redBadgeText
                    }
                  >
                    10
                    {redCards.home >
                    1
                      ? ` (-${redCards.home})`
                      : ""}
                  </Text>
                </View>
              )}
            </View>

            {homeHasRed && (
              <Text
                style={
                  styles.redCards
                }
              >
                {"🔴 ".repeat(
                  redCards.home
                )}
              </Text>
            )}
          </View>

          <Text
            style={
              styles.score
            }
          >
            {match.home.goals ??
              "-"}
          </Text>
        </View>

        {/*
         * ============================
         * AWAY TEAM
         * ============================
         */}

        <View
          style={[
            styles.teamRow,

            awayHasRed &&
              styles.redTeamRow,
          ]}
        >
          <View
            style={
              styles.teamInfo
            }
          >
            <View
              style={
                styles.teamNameRow
              }
            >
              <Text
                numberOfLines={
                  2
                }
                style={
                  styles.team
                }
              >
                {match.away.name}
              </Text>

              {awayHasRed && (
                <View
                  style={
                    styles.redBadge
                  }
                >
                  <Text
                    style={
                      styles.redBadgeText
                    }
                  >
                    10
                    {redCards.away >
                    1
                      ? ` (-${redCards.away})`
                      : ""}
                  </Text>
                </View>
              )}
            </View>

            {awayHasRed && (
              <Text
                style={
                  styles.redCards
                }
              >
                {"🔴 ".repeat(
                  redCards.away
                )}
              </Text>
            )}
          </View>

          <Text
            style={
              styles.score
            }
          >
            {match.away.goals ??
              "-"}
          </Text>
        </View>

        {/*
         * ============================
         * RED CARD INCIDENTS
         * ============================
         */}

        {redCards
          .incidents
          .length >
          0 && (
          <View
            style={
              styles.incidentsSection
            }
          >
            {redCards
              .incidents
              .map(
                (
                  incident,
                  index
                ) => (
                  <View
                    key={
                      incident.id ??
                      `${incident.side}-${incident.minute}-${index}`
                    }
                    style={
                      styles.incident
                    }
                  >
                    <Text
                      style={
                        styles.incidentText
                      }
                    >
                      🔴{" "}
                      {incident.minute ??
                        "?"}
                      {"' · "}

                      {incident.side ===
                      "home"
                        ? match.home
                            .name
                        : incident.side ===
                            "away"
                          ? match.away
                              .name
                          : ""}

                      {!!incident.side &&
                        " · "}

                      {incident.player
                        ?.name ??
                        incident.description ??
                        "Expulsión"}
                    </Text>
                  </View>
                )
              )}
          </View>
        )}
      </TouchableOpacity>

      {/*
       * ============================
       * CONTEXT
       * ============================
       *
       * RedCardContextSection ya
       * incluye:
       *
       * - MatchContextSummary
       * - tabla / posición
       * - GF/P y GC/P
       * - forma
       * - últimos rivales
       * - alineaciones
       * - copiar nombres
       * - RadarReviewControls
       *
       * Por eso NO duplicamos nada aquí.
       */}

      <RedCardContextSection
        match={
          match
        }
      />
    </View>
  );
}
