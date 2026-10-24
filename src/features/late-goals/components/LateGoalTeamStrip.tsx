import React from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  TeamLateGoalProfile,
} from "../types/lateGoal";

import {
  styles,
} from "./LateGoalTeamStrip.styles";

interface Props {
  profile?:
    TeamLateGoalProfile;
}

function LateGoalRow({
  minute,
  scored,
  conceded,
  observed,
}: {
  minute:
    string;

  scored:
    number;

  conceded:
    number;

  observed:
    number;
}) {

  return (
    <View
      style={
        styles.row
      }
    >
      <Text
        style={
          styles.minute
        }
      >
        {minute}
      </Text>

      <Text
        style={
          styles.metric
        }
      >
        Marca{" "}
        <Text
          style={
            styles.scored
          }
        >
          {scored}/{observed}
        </Text>
      </Text>

      <Text
        style={
          styles.separator
        }
      >
        ·
      </Text>

      <Text
        style={
          styles.metric
        }
      >
        Recibe{" "}
        <Text
          style={
            styles.conceded
          }
        >
          {conceded}/{observed}
        </Text>
      </Text>
    </View>
  );
}

export function LateGoalTeamStrip({
  profile,
}: Props) {

  if (!profile) {
    return null;
  }

  const has80 =
    profile
      .matchesObserved80 >
    0;

  const has90 =
    profile
      .matchesObserved90 >
    0;

  /*
   * No mostramos 0/0.
   *
   * Si todavía no observamos ningún
   * partido hasta 80 o 90, la tarjeta
   * queda limpia.
   */
  if (
    !has80 &&
    !has90
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
        GOLES TARDÍOS
      </Text>

      {has80 && (
        <LateGoalRow
          minute="80+"
          scored={
            profile
              .matchesWithLate80Scored
          }
          conceded={
            profile
              .matchesWithLate80Conceded
          }
          observed={
            profile
              .matchesObserved80
          }
        />
      )}

      {has90 && (
        <LateGoalRow
          minute="90+"
          scored={
            profile
              .matchesWithLate90Scored
          }
          conceded={
            profile
              .matchesWithLate90Conceded
          }
          observed={
            profile
              .matchesObserved90
          }
        />
      )}
    </View>
  );
}
