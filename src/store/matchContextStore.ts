import {
  create,
} from "zustand";

import {
  getMatchContext,
} from "../async/services/matchContextService";


import type {
  MatchContext,
  MatchContextRequestMetadata,
} from "../types/matchContext";

interface MatchContextEntry {
  context:
    MatchContext | null;

  loading:
    boolean;

  error:
    string | null;
}

interface MatchContextState {
  entries:
    Record<
      string,
      MatchContextEntry
    >;

  ensure:
  (
    provider:
      string,

    id:
      string,

    metadata?:
      MatchContextRequestMetadata
  ) =>
    Promise<void>;

  refresh:
  (
    provider:
      string,

    id:
      string,

    metadata?:
      MatchContextRequestMetadata
  ) =>
    Promise<void>;
}

const inflight =
  new Map<
    string,
    Promise<void>
  >();

function key(
  provider:
    string,

  id:
    string
): string {

  return `${provider}:${id}`;
}

export const useMatchContextStore =
  create<MatchContextState>(
    (
      set,
      get
    ) => {

      const load =
        async (
          provider:
            string,

          id:
            string,

		  metadata:
  MatchContextRequestMetadata |
  undefined,

force:
  boolean
        ) => {

          const cacheKey =
            key(
              provider,
              id
            );

          const existing =
            get()
              .entries[
                cacheKey
              ];

          if (
            !force &&
            existing
              ?.context
          ) {
            return;
          }

          const existingPromise =
            inflight.get(
              cacheKey
            );

          if (
            existingPromise
          ) {
            return existingPromise;
          }

          const promise =
            (async () => {

              set(
                (
                  state
                ) => ({
                  entries: {
                    ...state.entries,

                    [cacheKey]: {
                      context:
                        existing
                          ?.context ??
                        null,

                      loading:
                        true,

                      error:
                        null,
                    },
                  },
                })
              );

              try {
const context =
  await getMatchContext(
    provider,
    id,
    metadata
  );

                set(
                  (
                    state
                  ) => ({
                    entries: {
                      ...state.entries,

                      [cacheKey]: {
                        context,

                        loading:
                          false,

                        error:
                          null,
                      },
                    },
                  })
                );
              } catch (
                error
              ) {
                set(
                  (
                    state
                  ) => ({
                    entries: {
                      ...state.entries,

                      [cacheKey]: {
                        context:
                          state
                            .entries[
                              cacheKey
                            ]
                            ?.context ??
                          null,

                        loading:
                          false,

                        error:
                          error instanceof
                            Error
                            ? error.message
                            : "Context unavailable",
                      },
                    },
                  })
                );
              } finally {
                inflight.delete(
                  cacheKey
                );
              }
            })();

          inflight.set(
            cacheKey,
            promise
          );

          return promise;
        };

      return {
        entries:
          {},

        ensure:
  (
    provider,
    id,
    metadata
  ) =>
    load(
      provider,
      id,
      metadata,
      false
    ),

refresh:
  (
    provider,
    id,
    metadata
  ) =>
    load(
      provider,
      id,
      metadata,
      true
    ),
      };
    }
  );

export function matchContextKey(
  provider:
    string,

  id:
    string
): string {

  return key(
    provider,
    id
  );
}
