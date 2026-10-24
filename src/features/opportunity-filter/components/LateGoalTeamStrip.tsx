import React from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  TeamLateGoalProfile,
} from "../types/opportunity";

import {
  styles,
} from "./LateGoalTeamStrip.styles";

interface Props {
  profile?:
    TeamLateGoalProfile;
}

function Metric({
  label,
  value,
  danger = false,
}: {
  label:
    string;

  value:
    string;

  danger?:
    boolean;
}) {

  return (
    <Text
      style={
        styles.metric
      }
    >
      {label}{" "}
      <Text
        style={
          danger
            ? styles.concedeValue
            : styles.scoreValue
        }
      >
        {value}
      </Text>
    </Text>
  );
}

export function LateGoalTeamStrip({
  profile,
}: Props) {

  if (
    !profile ||
    (
      profile.matchesObserved80 ===
        0 &&
      profile.matchesObserved90 ===
        0
    )
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

      {profile.matchesObserved80 >
        0 && (
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
            80+
          </Text>

          <Metric
            label="Marca"
            value={
              `${profile.matchesWithLate80Scored}/${profile.matchesObserved80}`
            }
          />

          <Metric
            danger
            label="Recibe"
            value={
              `${profile.matchesWithLate80Conceded}/${profile.matchesObserved80}`
            }
          />
        </View>
      )}

      {profile.matchesObserved90 >
        0 && (
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
            90+
          </Text>

          <Metric
            label="Marca"
            value={
              `${profile.matchesWithLate90Scored}/${profile.matchesObserved90}`
            }
          />

          <Metric
            danger
            label="Recibe"
            value={
              `${profile.matchesWithLate90Conceded}/${profile.matchesObserved90}`
            }
          />
        </View>
      )}
    </View>
  );
}
