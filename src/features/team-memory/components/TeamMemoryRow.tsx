import React, {
  useState,
} from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AppActionChip,
} from "@/shared/ui/atoms/AppActionChip";

import type {
  TeamMemoryEvent,
  TeamMemorySummary,
} from "../types/teamMemory";

import {
  TeamMemoryHistory,
} from "./TeamMemoryHistory";

import {
  styles,
} from "./TeamMemoryRow.styles";

import type {
  TeamMemoryOutcome,
} from "../types/teamMemory";

import {
  TeamMemoryOutcomeModal,
} from "./TeamMemoryOutcomeModal";

interface Props {
  teamName:
    string;

  summary:
    TeamMemorySummary |
    undefined;

  history:
    TeamMemoryEvent[];

  loading:
    boolean;

  historyLoading:
    boolean;

  mutating:
    boolean;

  expanded:
    boolean;

  onToggleHistory:
    () => void;

 onWin:
  (
    note:
      string |
      null
  ) => void;

onLoss:
  (
    note:
      string |
      null
  ) => void;

  onDelete:
    (
      event:
        TeamMemoryEvent
    ) => void;

	showActions?:
  boolean;
}

export function TeamMemoryRow({
  teamName,
  summary,
  history,
  loading,
  historyLoading,
  mutating,
  expanded,
  onToggleHistory,
  onWin,
  onLoss,
  onDelete,
  showActions = true,
}: Props) {

	const [
  pendingOutcome,
  setPendingOutcome,
] =
  useState<
    TeamMemoryOutcome |
    null
  >(
    null
  );

const saveOutcome =
  (
    note:
      string |
      null
  ) => {

    if (
      pendingOutcome ===
      "win"
    ) {
      onWin(
        note
      );
    }

    if (
      pendingOutcome ===
      "loss"
    ) {
      onLoss(
        note
      );
    }

    setPendingOutcome(
      null
    );
  };

  return (
    <View
      style={
        styles.container
      }
    >
      <TouchableOpacity
        activeOpacity={
          0.8
        }
        onPress={
          onToggleHistory
        }
        style={
          styles.header
        }
      >
        <Text
          numberOfLines={
            1
          }
          style={
            styles.team
          }
        >
          {teamName}
        </Text>

        {loading ? (
          <Text
            style={
              styles.loading
            }
          >
            ...
          </Text>
        ) : (
          <View
            style={
              styles.summary
            }
          >
            <Text
              style={
                styles.historyCount
              }
            >
              🟢{" "}
              {summary?.wins ??
                0}
              {"  "}
              🔴{" "}
              {summary?.losses ??
                0}
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
          </View>
        )}
      </TouchableOpacity>

      {showActions && (
  <View
    style={
      styles.actions
    }
  >
    <AppActionChip
      label="+ Gané"
      disabled={
        loading ||
        mutating
      }
      loading={
        mutating
      }
      onPress={
        () =>
          setPendingOutcome(
            "win"
          )
      }
    />

    <AppActionChip
      label="+ Perdí"
      disabled={
        loading ||
        mutating
      }
      onPress={
        () =>
          setPendingOutcome(
            "loss"
          )
      }
    />
  </View>
)}

      {expanded && (
        <TeamMemoryHistory
          items={
            history
          }
          loading={
            historyLoading
          }
          mutating={
            mutating
          }
          onDelete={
            onDelete
          }
        />
      )}
		<TeamMemoryOutcomeModal
  visible={
    pendingOutcome !==
    null
  }
  teamName={
    teamName
  }
  outcome={
    pendingOutcome
  }
  saving={
    mutating
  }
  onCancel={
    () =>
      setPendingOutcome(
        null
      )
  }
  onSave={
    saveOutcome
  }
/>
    </View>
  );
}
