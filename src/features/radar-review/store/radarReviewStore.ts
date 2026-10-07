import {
  create,
} from "zustand";

import {
  fetchRadarReviews,
  resetRadarReview,
  saveRadarReview,
} from "../api/radarReviewService";

import type {
  RadarReview,
  RadarReviewStatus,
  StoredRadarReviewStatus,
} from "../types/radarReview";

interface State {
  items:
    Record<
      string,
      RadarReview
    >;

  loading:
    boolean;

  mutatingKeys:
    Record<
      string,
      boolean
    >;

  loaded:
    boolean;

  error:
    string | null;

  load:
    () =>
      Promise<void>;

  getStatus:
    (
      provider:
        string,

      externalId:
        string
    ) =>
      RadarReviewStatus;

  setStatus:
    (
      provider:
        string,

      externalId:
        string,

      status:
        StoredRadarReviewStatus
    ) =>
      Promise<void>;

  reset:
    (
      provider:
        string,

      externalId:
        string
    ) =>
      Promise<void>;
}

export function radarReviewKey(
  provider:
    string,

  externalId:
    string
): string {

  return `${provider}:${externalId}`;
}

export const useRadarReviewStore =
  create<State>(
    (
      set,
      get
    ) => ({
      items:
        {},

      loading:
        false,

      mutatingKeys:
        {},

      loaded:
        false,

      error:
        null,

      load:
        async () => {

          if (
            get().loading ||
            get().loaded
          ) {
            return;
          }

          set({
            loading:
              true,

            error:
              null,
          });

          try {
            const items =
              await fetchRadarReviews();

            const map:
              Record<
                string,
                RadarReview
              > =
                {};

            for (
              const item
              of items
            ) {
              map[
                radarReviewKey(
                  item.provider,
                  item.externalId
                )
              ] =
                item;
            }

            set({
              items:
                map,

              loaded:
                true,
            });
          } catch (
            error
          ) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Could not load review states",
            });
          } finally {
            set({
              loading:
                false,
            });
          }
        },

      getStatus:
        (
          provider,
          externalId
        ) => {

          const item =
            get()
              .items[
                radarReviewKey(
                  provider,
                  externalId
                )
              ];

          return item
            ?.status ??
            "new";
        },

      setStatus:
        async (
          provider,
          externalId,
          status
        ) => {

          const key =
            radarReviewKey(
              provider,
              externalId
            );

          set(
            (
              state
            ) => ({
              mutatingKeys: {
                ...state
                  .mutatingKeys,

                [key]:
                  true,
              },
            })
          );

          try {
            const item =
              await saveRadarReview(
                provider,
                externalId,
                status
              );

            set(
              (
                state
              ) => ({
                items: {
                  ...state.items,

                  [key]:
                    item,
                },
              })
            );
          } finally {
            set(
              (
                state
              ) => ({
                mutatingKeys: {
                  ...state
                    .mutatingKeys,

                  [key]:
                    false,
                },
              })
            );
          }
        },

      reset:
        async (
          provider,
          externalId
        ) => {

          const key =
            radarReviewKey(
              provider,
              externalId
            );

          set(
            (
              state
            ) => ({
              mutatingKeys: {
                ...state
                  .mutatingKeys,

                [key]:
                  true,
              },
            })
          );

          try {
            await resetRadarReview(
              provider,
              externalId
            );

            set(
              (
                state
              ) => {

                const items = {
                  ...state.items,
                };

                delete items[
                  key
                ];

                return {
                  items,
                };
              }
            );
          } finally {
            set(
              (
                state
              ) => ({
                mutatingKeys: {
                  ...state
                    .mutatingKeys,

                  [key]:
                    false,
                },
              })
            );
          }
        },
    })
  );
