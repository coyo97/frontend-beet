import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "../../../../types/radar";

interface Props {
  match:
    LiveMatch;

  onPress?:
    () => void;
}

export default function LiveMatchCard({
  match,
  onPress,
}: Props) {
  const minute =
    match.status.minute;

  return (
    <TouchableOpacity
  activeOpacity={
    0.85
  }
  onPress={
    onPress
  }
  style={
    styles.card
  }
>
      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.competition
          }
        >
          {match.competition.country}
          {" · "}
          {match.competition.name}
        </Text>

        <Text
          style={
            styles.live
          }
        >
          {minute !== null
            ? `${minute}'`
            : match.status.short}
        </Text>
      </View>

      <View
        style={
          styles.teamRow
        }
      >
        <Text
          style={
            styles.team
          }
        >
          {match.home.name}
        </Text>

        <Text
          style={
            styles.score
          }
        >
          {match.home.goals ?? "-"}
        </Text>
      </View>

      <View
        style={
          styles.teamRow
        }
      >
        <Text
          style={
            styles.team
          }
        >
          {match.away.name}
        </Text>

        <Text
          style={
            styles.score
          }
        >
          {match.away.goals ?? "-"}
        </Text>
      </View>

      <Text
        style={
          styles.sources
        }
      >
        {match.sources
          .map(
            (
              source
            ) =>
              source.provider
          )
          .join(" · ")}
      </Text>
		</TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#171A21",

      borderRadius:
        16,

      padding:
        16,

      marginBottom:
        12,

      borderWidth:
        1,

      borderColor:
        "#262B35",
    },

    header: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginBottom:
        14,

      gap:
        12,
    },

    competition: {
      color:
        "#9EA6B4",

      flex:
        1,

      fontSize:
        12,
    },

    live: {
      color:
        "#FF5C68",

      fontWeight:
        "700",
    },

    teamRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginVertical:
        4,
    },

    team: {
      color:
        "#F5F7FA",

      fontSize:
        16,

      flex:
        1,
    },

    score: {
      color:
        "#FFFFFF",

      fontSize:
        21,

      fontWeight:
        "800",
    },

    sources: {
      color:
        "#6F7887",

      fontSize:
        11,

      marginTop:
        12,
    },
  });
