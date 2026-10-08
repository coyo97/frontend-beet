import React from "react";

import {
  Text,
  TouchableOpacity,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

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
  expanded = false,
  onToggle,
}: Props) {

  return (
    <TouchableOpacity
      activeOpacity={
        0.8
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
      <Text
        style={
          styles.title
        }
      >
        TU HISTORIAL
      </Text>

      <Text
        style={
          styles.chevron
        }
      >
        {expanded
          ? "▲"
          : "▼"}
      </Text>
    </TouchableOpacity>
  );
}
