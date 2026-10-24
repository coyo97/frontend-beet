import React from "react";

import {
  Text,
  View,
} from "react-native";

import {
  AppBadge,
} from "@/shared/ui/atoms/AppBadge";

import {
  StatMetric,
} from "@/shared/ui/atoms/StatMetric";

import {
  lateGoalTeamKey,
  useLateGoalStore,
} from "@/features/late-goals/store/lateGoalStore";

import {
  LateGoalTeamStrip,
} from "@/features/late-goals/components/LateGoalTeamStrip";

import {
  FormStrip,
} from "@/shared/ui/molecules/FormStrip";

import type {
  TeamMatchContext,
} from "@/types/matchContext";

import {
  RecentMatchRow,
} from "./RecentMatchRow";

import {
  styles,
} from "./TeamContextSnapshot.styles";

interface Props {
  team:
    TeamMatchContext;

  expanded:
    boolean;
}

function decimal(
  value:
    number | null
): string {

  if (
    value ===
    null
  ) {
    return "—";
  }

  return value
    .toFixed(
      2
    );
}

function integer(
  value:
    number | null
): string {

  return value ===
    null
    ? "—"
    : String(
        value
      );
}

export function TeamContextSnapshot({
  team,
  expanded,
}: Props) {

const lateGoalProfile =
  useLateGoalStore(
    state =>
      state.profiles[
        lateGoalTeamKey(
          team.name
        )
      ]
  );

  return (
    <View
      style={
        styles.container
      }
    >
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
            styles.teamName
          }
        >
          {team.name}
        </Text>

        {team.position !==
          null ? (
          <AppBadge
            label={
              `#${team.position}`
            }
            tone="warning"
          />
        ) : (
          <AppBadge
            label="Sin puesto"
            tone="neutral"
          />
        )}
      </View>

      <View
        style={
          styles.metrics
        }
      >
        <StatMetric
          label="PTS"
          value={
            integer(
              team.points
            )
          }
        />

        <StatMetric
          label="PJ"
          value={
            integer(
              team.played
            )
          }
        />

        <StatMetric
          label="GF/P"
          value={
            decimal(
              team.goalsPerMatch
            )
          }
        />

        <StatMetric
          label="GC/P"
          value={
            decimal(
              team.concededPerMatch
            )
          }
        />
      </View>

      <View
        style={
          styles.form
        }
      >
        <Text
          style={
            styles.formLabel
          }
        >
          Forma
        </Text>

        <FormStrip
          results={
            team.form
          }
        />
      </View>

		<LateGoalTeamStrip
  profile={
    lateGoalProfile
  }
/>

      {expanded &&
        team.recentMatches.length >
          0 && (
        <View
          style={
            styles.recent
          }
        >
          {team.recentMatches
            .slice(
              0,
              5
            )
            .map(
              (
                recent,
                index
              ) => (
                <RecentMatchRow
                  key={
                    recent.id ??
                    `${recent.opponentName}-${recent.playedAt}-${index}`
                  }
                  match={
                    recent
                  }
                />
              )
            )}
        </View>
      )}
    </View>
  );
}
