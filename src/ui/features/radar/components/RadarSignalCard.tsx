import React from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";

import type {
  StoredRadarSignal,
} from "../../../../types/radar";

interface Props {
  item:
    StoredRadarSignal;

  onPress?:
    () => void;
}

export default function RadarSignalCard({
  item,
  onPress
}: Props) {

  const {
    signal,
  } = item;

  const match =
    signal.match;

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
      <Text
        style={
          styles.badge
        }
      >
        🔴 RED CARD PRESSURE
      </Text>

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
          styles.match
        }
      >
        {match.home.name}
        {"  "}
        {match.home.goals ?? "-"}
        {" - "}
        {match.away.goals ?? "-"}
        {"  "}
        {match.away.name}
      </Text>

      <View
        style={
          styles.metrics
        }
      >
        <Text
          style={
            styles.metric
          }
        >
          Superioridad:{" "}
          {signal.advantagedSide}
        </Text>

        <Text
          style={
            styles.metric
          }
        >
          Presión:{" "}
          {signal.pressure.level}
        </Text>

        <Text
          style={
            styles.metric
          }
        >
          Confianza:{" "}
          {signal.pressure.confidence}
        </Text>
      </View>

      <Text
        style={
          styles.time
        }
      >
        {new Date(
          item.publishedAt
        ).toLocaleTimeString()}
      </Text>
		  </TouchableOpacity>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#25171B",

      borderColor:
        "#5A2730",

      borderWidth:
        1,

      borderRadius:
        16,

      padding:
        16,

      marginBottom:
        12,
    },

    badge: {
      color:
        "#FF6875",

      fontWeight:
        "800",

      fontSize:
        12,

      marginBottom:
        9,
    },

    competition: {
      color:
        "#AFA4A7",

      fontSize:
        12,

      marginBottom:
        7,
    },

    match: {
      color:
        "#FFFFFF",

      fontWeight:
        "700",

      fontSize:
        16,
    },

    metrics: {
      marginTop:
        12,

      gap:
        4,
    },

    metric: {
      color:
        "#D4CDD0",

      fontSize:
        13,
    },

    time: {
      color:
        "#817579",

      marginTop:
        10,

      fontSize:
        11,
    },
  });
