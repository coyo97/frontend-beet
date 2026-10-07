import {
  create,
} from "zustand";

import type {
  WatchlistAlertEntry,
  WatchlistAlertEnvelope,
} from "../types/watchlist";

interface WatchlistAlertState {
  alerts:
    WatchlistAlertEntry[];

  unreadCount:
    number;

  addAlert:
    (
      payload:
        WatchlistAlertEnvelope
    ) => void;

  dismiss:
    (
      id: string
    ) => void;

  markAllRead:
    () => void;

  clear:
    () => void;
}

function getMatchIdentity(
  payload:
    WatchlistAlertEnvelope
): string {

  const match =
    payload.signal.match;

  const source =
    match.sources.find(
      (
        item
      ) =>
        item.provider ===
        "flashscore"
    ) ??
    match.sources[0];

  if (source) {
    return `${source.provider}:${source.externalId}`;
  }

  return [
    match.home.name,
    match.away.name,
    match.kickoffAt,
  ].join(":");
}

function buildAlertId(
  payload:
    WatchlistAlertEnvelope
): string {

  /*
   * No usamos emittedAt porque
   * queremos reconocer el mismo
   * evento si llega repetido.
   */

  return [
    payload.watchlistItem.id,
    getMatchIdentity(
      payload
    ),
    payload.signal
      .redCards.home,
    payload.signal
      .redCards.away,
    payload.signal
      .strength,
  ].join(":");
}

export const useWatchlistAlertStore =
  create<WatchlistAlertState>(
    (
      set
    ) => ({
      alerts:
        [],

      unreadCount:
        0,

      addAlert:
        (
          payload
        ) => {

          const id =
            buildAlertId(
              payload
            );

          set(
            (
              state
            ) => {

              const exists =
                state.alerts.some(
                  (
                    item
                  ) =>
                    item.id ===
                    id
                );

              if (exists) {
                return state;
              }

              const entry:
                WatchlistAlertEntry = {
                  id,

                  receivedAt:
                    new Date()
                      .toISOString(),

                  payload,
                };

              return {
                alerts: [
                  entry,
                  ...state.alerts,
                ].slice(
                  0,
                  100
                ),

                unreadCount:
                  state.unreadCount +
                  1,
              };
            }
          );
        },

      dismiss:
        (
          id
        ) =>
          set(
            (
              state
            ) => ({
              alerts:
                state.alerts.filter(
                  (
                    item
                  ) =>
                    item.id !==
                    id
                ),
            })
          ),

      markAllRead:
        () =>
          set({
            unreadCount:
              0,
          }),

      clear:
        () =>
          set({
            alerts:
              [],

            unreadCount:
              0,
          }),
    })
  );
