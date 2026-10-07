import React from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  TeamMatchContext,
} from "../../../../types/matchContext";

import RecentForm
  from "./RecentForm";

interface Props {
  team:
    TeamMatchContext;
}

function number(
  value:
    number | null
): string {

  return value ===
    null
    ? "-"
    : String(
        value
      );
}

export default function TeamContextMini({
  team,
}: Props) {

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
        <Text
          numberOfLines={
            1
          }
          style={
            styles.name
          }
        >
          {team.name}
        </Text>

        <Text
          style={
            styles.position
          }
        >
          {team.position !==
          null
            ? `${team.position}.º`
            : "—"}
        </Text>
      </View>

      <Text
        style={
          styles.stats
        }
      >
        {number(
          team.points
        )} pts
        {" · "}
        GF {team.goalsPerMatch ??
          "-"}
        {" · "}
        GC {team.concededPerMatch ??
          "-"}
      </Text>

      <RecentForm
        form={
          team.form
        }
      />
		{team.recentMatches
  .slice(
    0,
    3
  )
  .map(
    (
      recent
    ) => (
      <Text
        key={
          recent.id ??
          `${recent.opponentName}-${recent.playedAt}`
        }
        style={
          styles.recentMatch
        }
      >
        {recent.result ===
        "W"
          ? "🟢"
          : recent.result ===
              "L"
            ? "🔴"
            : "⚪"}
        {" "}
        {recent.goalsFor}
        -
        {recent.goalsAgainst}
        {" vs "}
        {recent.opponentName}
        {recent.opponentPosition !==
        null
          ? ` (${recent.opponentPosition}.º)`
          : ""}
      </Text>
    )
  )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex:
        1,

      minWidth:
        0,
    },

    top: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      gap:
        8,
    },

    name: {
      flex:
        1,

      color:
        "#DDE1E7",

      fontSize:
        11,

      fontWeight:
        "700",
    },

    position: {
      color:
        "#E4C65A",

      fontSize:
        12,

      fontWeight:
        "900",
    },

    stats: {
      color:
        "#858D99",

      fontSize:
        10,

      marginTop:
        4,

      marginBottom:
        5,
    },
	recentMatch: {
  color:
    "#727B87",

  fontSize:
    8,

  marginTop:
    3,
},
  });
