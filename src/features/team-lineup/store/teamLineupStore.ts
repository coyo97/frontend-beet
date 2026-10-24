import {
  create,
} from "zustand";

import {
  inspectMatchLineup,
} from "../api/teamLineupService";

import type {
  InspectMatchLineupResponse,
} from "../types/teamLineup";

interface Entry {
  data:
    InspectMatchLineupResponse |
    null;

  loading:
    boolean;

  error:
    string | null;
}

interface State {
  entries:
    Record<
      string,
      Entry
    >;

  inspect:
    (
      provider:
        string,

      externalId:
        string,

      bootstrapHistory?:
        boolean
    ) =>
      Promise<void>;

  clear:
    () =>
      void;
}

const inflight =
  new Map<
    string,
    Promise<void>
  >();

export function teamLineupKey(
  provider:
    string,

  externalId:
    string
): string {

  return (
    `${provider}:` +
    externalId
  );
}

export const useTeamLineupStore =
  create<State>(
    (
      set,
      get
    ) => ({

      entries:
        {},

      inspect:
        async (
          provider,
          externalId,
          bootstrapHistory =
            false
        ) => {

          const key =
            teamLineupKey(
              provider,
              externalId
            );

          const requestKey =
            `${key}:` +
            (
              bootstrapHistory
                ? "bootstrap"
                : "inspect"
            );

          const running =
            inflight.get(
              requestKey
            );

          if (running) {
            return running;
          }

          const promise =
            (async () => {

              const previous =
                get()
                  .entries[
                    key
                  ];

              set(
                state => ({
                  entries: {
                    ...state.entries,

                    [key]: {
                      data:
                        previous
                          ?.data ??
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

                const data =
                  await inspectMatchLineup(
                    provider,
                    externalId,
                    bootstrapHistory
                  );

                set(
                  state => ({
                    entries: {
                      ...state.entries,

                      [key]: {
                        data,

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
                  state => ({
                    entries: {
                      ...state.entries,

                      [key]: {
                        data:
                          previous
                            ?.data ??
                          null,

                        loading:
                          false,

                        error:
                          error instanceof
                            Error
                            ? error.message
                            : "No se pudo verificar la alineación",
                      },
                    },
                  })
                );
              }
            })();

          inflight.set(
            requestKey,
            promise
          );

          try {
            await promise;
          } finally {
            inflight.delete(
              requestKey
            );
          }
        },

      clear:
        () =>
          set({
            entries:
              {},
          }),
    })
  );
