import React, {
  useState,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  TeamMemorySummary,
} from "@/features/team-memory/types/teamMemory";

import {
  teamPersonalProfileKey,
  useTeamPersonalProfileStore,
} from "@/features/team-profile/store/teamPersonalProfileStore";

import {
  TeamPersonalProfileEditor,
} from "@/features/team-profile/components/TeamPersonalProfileEditor";

import type {
  TeamPersonalProfile,
} from "@/features/team-profile/types/teamPersonalProfile";

import {
  styles,
} from "./MyTeamCard.styles";

interface Props {
  teamName:
    string;

  summary?:
    TeamMemorySummary;

  initialProfile?:
    TeamPersonalProfile;
}

const LABELS = {
  avoid: {
    symbol:
      "⛔",

    text:
      "EVITAR",
  },

  watch: {
    symbol:
      "👁",

    text:
      "VIGILAR",
  },

  trusted: {
    symbol:
      "✓",

    text:
      "CONFIABLE",
  },
} as const;

export function MyTeamCard({
  teamName,
  summary,
  initialProfile,
}: Props) {

  const [
    expanded,
    setExpanded,
  ] =
    useState(
      false
    );

  const key =
    teamPersonalProfileKey(
      teamName
    );

  const storeProfile =
    useTeamPersonalProfileStore(
      state =>
        state.profiles[
          key
        ]
    );

  const profile =
    storeProfile ===
      undefined
      ? initialProfile
      : storeProfile ??
        undefined;

  const label =
    profile?.label
      ? LABELS[
          profile.label
        ]
      : null;

  return (
    <View
      style={
        styles.card
      }
    >
      <TouchableOpacity
        activeOpacity={
          0.8
        }
        onPress={
          () =>
            setExpanded(
              value =>
                !value
            )
        }
      >
        <View
          style={
            styles.header
          }
        >
          <View
            style={
              styles.titleArea
            }
          >
            <Text
              style={
                styles.teamName
              }
            >
              {teamName}
            </Text>

            {label && (
              <View
                style={
                  styles.label
                }
              >
                <Text
                  style={
                    styles.labelText
                  }
                >
                  {label.symbol}{" "}
                  {label.text}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={
              styles.chevron
            }
          >
            {expanded
              ? "▲"
              : "▼"}
          </Text>
        </View>

        <View
          style={
            styles.memory
          }
        >
          <Text
            style={
              styles.win
            }
          >
            🟢{" "}
            {summary?.wins ??
              0}
          </Text>

          <Text
            style={
              styles.loss
            }
          >
            🔴{" "}
            {summary?.losses ??
              0}
          </Text>

          <Text
            style={
              styles.total
            }
          >
            {summary
              ? `${summary.total} registros`
              : "Sin historial"}
          </Text>
        </View>

        {!!profile?.note && (
          <Text
            numberOfLines={
              expanded
                ? undefined
                : 2
            }
            style={
              styles.note
            }
          >
            “{profile.note}”
          </Text>
        )}
      </TouchableOpacity>

      {expanded && (
        <TeamPersonalProfileEditor
          teamName={
            teamName
          }
        />
      )}
    </View>
  );
}
