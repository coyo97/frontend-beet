import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MatchTeamMemory,
} from "@/features/team-memory/components/MatchTeamMemory";

import {
  MatchCopyActions,
} from "@/features/match-context/components/MatchCopyActions";

import type {
  RecentMatch,
} from "../types/recentMatch";

import {
  styles,
} from "./RecentMatchCard.styles";

interface Props {
  item:
    RecentMatch;

  onPress?:
    () => void;
}

function formatEndedAt(
  value:
    string
): string {

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date
    .toLocaleString(
      "es-BO",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    );
}

export function RecentMatchCard({
  item,
  onPress,
}: Props) {

  const {
    match,
    resultConfirmed,
  } =
    item;

  const homeGoals =
    match.home.goals;

  const awayGoals =
    match.away.goals;

  const scoreAvailable =
    homeGoals !==
      null &&
    awayGoals !==
      null;

  return (
    <View
      style={
        styles.container
      }
    >
      <TouchableOpacity
        activeOpacity={
          onPress
            ? 0.8
            : 1
        }
        disabled={
          !onPress
        }
        onPress={
          onPress
        }
      >
        <View
          style={
            styles.top
          }
        >
          <View
            style={
              styles.competitionContainer
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
              {match.competition.name}
            </Text>

            <Text
              style={
                styles.country
              }
            >
              {match.competition.country}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,

              resultConfirmed
                ? styles.confirmedBadge
                : styles.unconfirmedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,

                resultConfirmed
                  ? styles.confirmedText
                  : styles.unconfirmedText,
              ]}
            >
              {resultConfirmed
                ? "FINAL"
                : "ÚLTIMO DATO"}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.matchRow
          }
        >
          <View
            style={
              styles.team
            }
          >
            <Text
              numberOfLines={
                2
              }
              style={
                styles.teamName
              }
            >
              {match.home.name}
            </Text>
          </View>

          <View
            style={
              styles.scoreContainer
            }
          >
            <Text
              style={
                styles.score
              }
            >
              {scoreAvailable
                ? `${homeGoals} - ${awayGoals}`
                : "-"}
            </Text>

            <Text
              style={
                styles.scoreCaption
              }
            >
              {resultConfirmed
                ? "Resultado"
                : "Último marcador visto"}
            </Text>
          </View>

          <View
            style={[
              styles.team,
              styles.awayTeam,
            ]}
          >
            <Text
              numberOfLines={
                2
              }
              style={[
                styles.teamName,
                styles.awayText,
              ]}
            >
              {match.away.name}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.meta
          }
        >
          <Text
            style={
              styles.metaText
            }
          >
            Terminó/salió del live:{" "}
            {formatEndedAt(
              item.endedAt
            )}
          </Text>

          {!resultConfirmed && (
            <Text
              style={
                styles.warning
              }
            >
              El marcador todavía no fue confirmado como resultado final.
            </Text>
          )}
        </View>
      </TouchableOpacity>

     <MatchTeamMemory
  match={
    match
  }
  autoLoad={
    false
  }
/>
      <MatchCopyActions
        home={
          match.home.name
        }
        away={
          match.away.name
        }
      />
    </View>
  );
}
