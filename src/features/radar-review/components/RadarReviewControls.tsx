import React from "react";

import {
  View,
} from "react-native";

import {
  AppActionChip,
} from "@/shared/ui/atoms/AppActionChip";

import {
  AppBadge,
  type AppBadgeTone,
} from "@/shared/ui/atoms/AppBadge";

import {
  radarReviewKey,
  useRadarReviewStore,
} from "../store/radarReviewStore";

import type {
  RadarReviewStatus,
} from "../types/radarReview";

import {
  styles,
} from "./RadarReviewControls.styles";

interface Props {
  provider:
    string;

  externalId:
    string;
}

function badge(
  status:
    RadarReviewStatus
): {
  label:
    string;

  tone:
    AppBadgeTone;
} {

  switch (
    status
  ) {
    case "marked":
      return {
        label:
          "★ MARCADA",

        tone:
          "warning",
      };

    case "reviewed":
      return {
        label:
          "✓ REVISADA",

        tone:
          "success",
      };

    case "dismissed":
      return {
        label:
          "✕ DESCARTADA",

        tone:
          "danger",
      };

    default:
      return {
        label:
          "● NUEVA",

        tone:
          "info",
      };
  }
}

export function RadarReviewControls({
  provider,
  externalId,
}: Props) {

  const key =
    radarReviewKey(
      provider,
      externalId
    );

  const item =
    useRadarReviewStore(
      (
        state
      ) =>
        state.items[
          key
        ]
    );

  const mutating =
    useRadarReviewStore(
      (
        state
      ) =>
        Boolean(
          state
            .mutatingKeys[
              key
            ]
        )
    );

  const setStatus =
    useRadarReviewStore(
      (
        state
      ) =>
        state.setStatus
    );

  const reset =
    useRadarReviewStore(
      (
        state
      ) =>
        state.reset
    );

  const status:
    RadarReviewStatus =
      item?.status ??
      "new";

  const currentBadge =
    badge(
      status
    );

  return (
    <View
      style={
        styles.container
      }
    >
      <AppBadge
        label={
          currentBadge.label
        }
        tone={
          currentBadge.tone
        }
      />

      <View
        style={
          styles.actions
        }
      >
        <AppActionChip
          label="☆ Marcar"
          active={
            status ===
            "marked"
          }
          loading={
            mutating
          }
          onPress={
            () => {
              if (
                status ===
                "marked"
              ) {
                void reset(
                  provider,
                  externalId
                );

                return;
              }

              void setStatus(
                provider,
                externalId,
                "marked"
              );
            }
          }
        />

        <AppActionChip
          label="✓ Revisada"
          active={
            status ===
            "reviewed"
          }
          disabled={
            mutating
          }
          onPress={
            () => {
              void setStatus(
                provider,
                externalId,
                "reviewed"
              );
            }
          }
        />

        <AppActionChip
          label="✕ Descartar"
          active={
            status ===
            "dismissed"
          }
          disabled={
            mutating
          }
          onPress={
            () => {
              void setStatus(
                provider,
                externalId,
                "dismissed"
              );
            }
          }
        />
      </View>
    </View>
  );
}
