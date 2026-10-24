import React from "react";

import {
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  useWatchlistStore,
} from "@/store/watchlistStore";

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

  /*
   * Opcional para no romper otros
   * lugares donde todavía se use
   * RadarReviewControls sin match.
   */
  match?:
    LiveMatch;
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
  match,
}: Props) {

  const key =
    radarReviewKey(
      provider,
      externalId
    );

  const item =
    useRadarReviewStore(
      state =>
        state.items[
          key
        ]
    );

  const mutating =
    useRadarReviewStore(
      state =>
        Boolean(
          state
            .mutatingKeys[
              key
            ]
        )
    );

  const setStatus =
    useRadarReviewStore(
      state =>
        state.setStatus
    );

  const reset =
    useRadarReviewStore(
      state =>
        state.reset
    );

  /*
   * WATCHLIST
   */
  const followMatch =
    useWatchlistStore(
      state =>
        state.followMatch
    );

  const findMatch =
    useWatchlistStore(
      state =>
        state.findMatch
    );

  const watchlistMutating =
    useWatchlistStore(
      state =>
        state.mutating
    );

  const status:
    RadarReviewStatus =
      item?.status ??
      "new";

  const currentBadge =
    badge(
      status
    );

  /*
   * ===================================
   * REVIEWED -> WATCHLIST
   * ===================================
   */
  const markReviewed =
    async () => {

      /*
       * Primero guardamos el estado
       * Revisada como hasta ahora.
       */
      await setStatus(
        provider,
        externalId,
        "reviewed"
      );

      /*
       * Si el componente recibió el match,
       * aseguramos que esté en Watchlist.
       */
      if (!match) {
        return;
      }

      const existing =
        findMatch(
          match
        );

      /*
       * Evitamos repetir la petición
       * dentro de la misma sesión.
       */
      if (existing) {
        return;
      }

      try {

        await followMatch(
          match
        );

      } catch (
        error
      ) {

        /*
         * No revertimos "Revisada".
         *
         * Si falla Watchlist, volver a
         * tocar Revisada reintentará.
         */
        console.warn(
          "[RadarReviewControls] Could not add reviewed match to watchlist",
          error
        );
      }
    };

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
          loading={
            watchlistMutating
          }
          disabled={
            mutating ||
            watchlistMutating
          }
          onPress={
            () => {
              void markReviewed();
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
            mutating ||
            watchlistMutating
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
