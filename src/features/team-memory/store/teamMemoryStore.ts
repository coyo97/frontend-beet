import {
  create,
} from "zustand";

import {
  addTeamMemoryEvent,
  deleteTeamMemoryEvent,
  fetchTeamMemoryHistory,
  fetchTeamMemorySummaries,
} from "../api/teamMemoryService";

import type {
  CreateTeamMemoryInput,
  TeamMemoryEvent,
  TeamMemorySummary,
} from "../types/teamMemory";

export function teamMemoryKey(
  value:
    string
): string {

  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase()
    .replace(
      /[-_.]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    );
}

interface State {
  summaries:
    Record<
      string,
      TeamMemorySummary
    >;

  history:
    Record<
      string,
      TeamMemoryEvent[]
    >;

  loadingKeys:
    Record<
      string,
      boolean
    >;

  historyLoadingKeys:
    Record<
      string,
      boolean
    >;

  mutatingKeys:
    Record<
      string,
      boolean
    >;

  ensureTeams:
    (
      teams:
        string[]
    ) =>
      Promise<void>;

  ensureHistory:
    (
      teamName:
        string,

      force?:
        boolean
    ) =>
      Promise<void>;

  record:
    (
      input:
        CreateTeamMemoryInput
    ) =>
      Promise<void>;

  removeEvent:
    (
      event:
        TeamMemoryEvent
    ) =>
      Promise<void>;
}

export const useTeamMemoryStore =
  create<State>(
    (
      set,
      get
    ) => ({
      summaries:
        {},

      history:
        {},

      loadingKeys:
        {},

      historyLoadingKeys:
        {},

      mutatingKeys:
        {},

      ensureTeams:
        async (
          teams
        ) => {

          const missing =
            Array.from(
              new Map(
                teams
                  .filter(
                    Boolean
                  )
                  .map(
                    (
                      team
                    ) => [
                      teamMemoryKey(
                        team
                      ),
                      team,
                    ]
                  )
              )
            )
              .filter(
                (
                  [
                    key,
                  ]
                ) =>
                  !get()
                    .summaries[
                      key
                    ] &&
                  !get()
                    .loadingKeys[
                      key
                    ]
              );

          if (
            missing.length ===
            0
          ) {
            return;
          }

          set(
            (
              state
            ) => {

              const loadingKeys = {
                ...state
                  .loadingKeys,
              };

              for (
                const [
                  key,
                ]
                of missing
              ) {
                loadingKeys[
                  key
                ] =
                  true;
              }

              return {
                loadingKeys,
              };
            }
          );

          try {
            const summaries =
              await fetchTeamMemorySummaries(
                missing.map(
                  (
                    [
                      ,
                      name,
                    ]
                  ) =>
                    name
                )
              );

            set(
              (
                state
              ) => {

                const next = {
                  ...state.summaries,
                };

                for (
                  const summary
                  of summaries
                ) {
                  next[
                    teamMemoryKey(
                      summary.teamName
                    )
                  ] =
                    summary;
                }

                return {
                  summaries:
                    next,
                };
              }
            );
          } finally {
            set(
              (
                state
              ) => {

                const loadingKeys = {
                  ...state
                    .loadingKeys,
                };

                for (
                  const [
                    key,
                  ]
                  of missing
                ) {
                  delete loadingKeys[
                    key
                  ];
                }

                return {
                  loadingKeys,
                };
              }
            );
          }
        },

      ensureHistory:
        async (
          teamName,
          force =
            false
        ) => {

          const key =
            teamMemoryKey(
              teamName
            );

          if (
            !force &&
            get().history[
              key
            ]
          ) {
            return;
          }

          if (
            get()
              .historyLoadingKeys[
                key
              ]
          ) {
            return;
          }

          set(
            (
              state
            ) => ({
              historyLoadingKeys: {
                ...state
                  .historyLoadingKeys,

                [key]:
                  true,
              },
            })
          );

          try {
            const history =
              await fetchTeamMemoryHistory(
                teamName
              );

            set(
              (
                state
              ) => ({
                history: {
                  ...state
                    .history,

                  [key]:
                    history,
                },
              })
            );
          } finally {
            set(
              (
                state
              ) => ({
                historyLoadingKeys: {
                  ...state
                    .historyLoadingKeys,

                  [key]:
                    false,
                },
              })
            );
          }
        },

      record:
        async (
          input
        ) => {

          const key =
            teamMemoryKey(
              input.teamName
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
            const {
              event,
              summary,
            } =
              await addTeamMemoryEvent(
                input
              );

            set(
              (
                state
              ) => ({
                summaries: {
                  ...state
                    .summaries,

                  [key]:
                    summary,
                },

                history: {
                  ...state
                    .history,

                  [key]: [
                    event,
                    ...(
                      state
                        .history[
                          key
                        ] ??
                      []
                    ),
                  ],
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

      removeEvent:
        async (
          event
        ) => {

          const key =
            teamMemoryKey(
              event.teamName
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
            const result =
              await deleteTeamMemoryEvent(
                event.id
              );

            set(
              (
                state
              ) => ({
                summaries: {
                  ...state
                    .summaries,

                  [key]:
                    result.summary,
                },

                history: {
                  ...state
                    .history,

                  [key]:
                    (
                      state
                        .history[
                          key
                        ] ??
                      []
                    ).filter(
                      (
                        item
                      ) =>
                        item.id !==
                        event.id
                    ),
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
    })
  );
