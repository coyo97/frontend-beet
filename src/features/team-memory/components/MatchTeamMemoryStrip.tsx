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
  useMatchTeamMemory,
} from "../hooks/useMatchTeamMemory";

import {
  TeamMemoryCompactLine,
} from "./TeamMemoryCompactLine";

import {
  styles,
} from "./MatchTeamMemoryStrip.styles";

interface Props {
  match:
    LiveMatch;

  autoLoad?:
    boolean;

  expanded?:
    boolean;

  onToggle?:
    () => void;
}

export function MatchTeamMemoryStrip({
  match,
  autoLoad = true,
  expanded = false,
  onToggle,
}: Props) {

  const {
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

  return (
    <TouchableOpacity
      activeOpacity={
        onToggle
          ? 0.8
          : 1
      }
      disabled={
        !onToggle
      }
      onPress={
        onToggle
      }
      style={
        styles.container
      }
    >
      <TeamMemoryCompactLine
        teamName={
          match.home.name
        }
        summary={
          homeSummary
        }
        loading={
          homeLoading
        }
      />

      <View
        style={
          styles.center
        }
      >
        <Text
          style={
            styles.title
          }
        >
          TU HISTORIAL
        </Text>

        {onToggle && (
          <Text
            style={
              styles.chevron
            }
          >
            {expanded
              ? "▲"
              : "▼"}
          </Text>
        )}
      </View>

      <TeamMemoryCompactLine
        teamName={
          match.away.name
        }
        summary={
          awaySummary
        }
        loading={
          awayLoading
        }
        align="right"
      />
    </TouchableOpacity>
  );
}
