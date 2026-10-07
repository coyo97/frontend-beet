import {
  create,
} from "zustand";

import {
  getLiveMatches,
  getRecentRadarSignals,
  getRedCardMatches,
  getRedCardMatchesV2
} from "../async/services/radarService";

import {
  adaptUnifiedRedCards,
} from "../features/radar/utils/adaptUnifiedRedCards";

import type {
  LiveMatch,
  RadarSocketEnvelope,
  RedCardRadarMatch,
  StoredRadarSignal,
} from "../types/radar";

interface RadarState {
  liveMatches:
    LiveMatch[];

  redCardMatches:
    RedCardRadarMatch[];

  recentSignals:
    StoredRadarSignal[];

  country:
    string | undefined;

  loading:
    boolean;

  liveLoading:
    boolean;

  redCardsLoading:
    boolean;

  signalsLoading:
    boolean;

  socketConnected:
    boolean;

  error:
    string | null;

  setCountry:
    (
      country:
        string | undefined
    ) => void;

  setSocketConnected:
    (
      connected:
        boolean
    ) => void;

  setError:
    (
      error:
        string | null
    ) => void;

  addRealtimeSignal:
    (
      payload:
        RadarSocketEnvelope
    ) => void;

  refreshLive:
    () => Promise<void>;

  refreshRedCards:
    () => Promise<void>;

  refreshSignals:
    () => Promise<void>;

  refresh:
    () => Promise<void>;
}

function buildSignalKey(
  item:
    StoredRadarSignal
): string {

  const match =
    item.signal.match;

  const preferred =
    match.sources.find(
      (source) =>
        source.provider ===
        "flashscore"
    ) ??
    match.sources[0];

  if (preferred) {
    return [
      preferred.provider,
      preferred.externalId,
      item.signal.type,
    ].join(":");
  }

  return [
    match.home.name,
    match.away.name,
    match.kickoffAt,
    item.signal.type,
  ].join(":");
}

export const useRadarStore =
  create<RadarState>(
    (
      set,
      get
    ) => ({
      liveMatches:
        [],

      redCardMatches:
        [],

      recentSignals:
        [],

      country:
        undefined,

      loading:
        false,

      liveLoading:
        false,

      redCardsLoading:
        false,

      signalsLoading:
        false,

      socketConnected:
        false,

      error:
        null,

      setCountry:
        (
          country
        ) => {

          const value =
            country
              ?.trim();

          set({
            country:
              value ||
              undefined,
          });
        },

      setSocketConnected:
        (
          connected
        ) =>
          set({
            socketConnected:
              connected,
          }),

      setError:
        (
          error
        ) =>
          set({
            error,
          }),

      addRealtimeSignal:
        (
          payload
        ) => {

          const incoming:
            StoredRadarSignal = {
              publishedAt:
                payload.emittedAt,

              signal:
                payload.signal,
            };

          const incomingKey =
            buildSignalKey(
              incoming
            );

          set(
            (
              state
            ) => ({
              recentSignals: [
                incoming,

                ...state
                  .recentSignals
                  .filter(
                    (
                      item
                    ) =>
                      buildSignalKey(
                        item
                      ) !==
                      incomingKey
                  ),
              ].slice(
                0,
                100
              ),
            })
          );
        },

      refreshLive:
        async () => {

          set({
            liveLoading:
              true,
          });

          try {
            const response =
              await getLiveMatches({
                country:
                  get().country,
              });

            set({
              liveMatches:
                response.matches,

              error:
                null,
            });
          } catch (error) {
            set({
              error:
                error instanceof
                Error
                  ? error.message
                  : "Error loading live matches",
            });
          } finally {
            set({
              liveLoading:
                false,
            });
          }
        },

      refreshRedCards:
  async () => {

    set({
      redCardsLoading:
        true,
    });

    const country =
      get().country;

    try {

      /*
       * Primera opción:
       *
       * Flashscore
       * +
       * FotMob
       * +
       * 1xBet
       */
      const unified =
        await getRedCardMatchesV2({
          country,
        });

      const response =
        adaptUnifiedRedCards(
          unified,
          country
        );

      set({
        redCardMatches:
          response.matches,

        error:
          null,
      });

    } catch (
      unifiedError
    ) {

      /*
       * MUY IMPORTANTE:
       *
       * Si V2 tiene cualquier problema,
       * volvemos automáticamente al
       * endpoint antiguo.
       *
       * La UI no queda sin radar.
       */
      console.warn(
        "[RadarStore] red-cards/v2 failed, using legacy radar",
        unifiedError
      );

      try {

        const legacy =
          await getRedCardMatches({
            country,
          });

        set({
          redCardMatches:
            legacy.matches,

          error:
            null,
        });

      } catch (
        legacyError
      ) {

        console.warn(
          "[RadarStore] legacy red cards failed",
          legacyError
        );

        /*
         * No borramos necesariamente
         * resultados anteriores por
         * una falla de red temporal.
         */
      }
    } finally {

      set({
        redCardsLoading:
          false,
      });
    }
  },

      refreshSignals:
        async () => {

          set({
            signalsLoading:
              true,
          });

          try {
            const response =
              await getRecentRadarSignals(
                50
              );

            set({
              recentSignals:
                response.signals,

              error:
                null,
            });
          } catch (error) {
            console.warn(
              "[RadarStore] signals",
              error
            );
          } finally {
            set({
              signalsLoading:
                false,
            });
          }
        },

      refresh:
        async () => {

          set({
            loading:
              true,

            error:
              null,
          });

          const state =
            get();

          await Promise.allSettled([
            state.refreshLive(),
            state.refreshRedCards(),
            state.refreshSignals(),
          ]);

          set({
            loading:
              false,
          });
        },
    })
  );
