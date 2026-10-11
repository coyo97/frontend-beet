import {
  create,
} from "zustand";

import {
  addTeamMemoryEvent,
  deleteTeamMemoryEvent,
  fetchAllTeamMemoryOpponentSummaries,
  fetchAllTeamMemorySummaries,
  fetchTeamMemoryHistory,
  fetchTeamMemorySummaries,
} from "../api/teamMemoryService";

import type {
  CreateTeamMemoryInput,
  TeamMemoryEvent,
  TeamMemoryOpponentSummary,
  TeamMemorySummary,
} from "../types/teamMemory";

export function teamMemoryKey(
  value:
    string
): string {

  return value
    .normalize(
      "NFD"
    )
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

  allSummariesLoaded:
    boolean;

  allSummariesLoading:
    boolean;

  opponentSummaries:
    Record<
      string,
      TeamMemoryOpponentSummary
    >;

  allOpponentSummariesLoaded:
    boolean;

  allOpponentSummariesLoading:
    boolean;

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

  loadAllSummaries:
    (
      force?:
        boolean
    ) =>
      Promise<void>;

  loadAllOpponentSummaries:
    (
      force?:
        boolean
    ) =>
      Promise<void>;

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

      allSummariesLoaded:
        false,

      allSummariesLoading:
        false,

      opponentSummaries:
        {},

      allOpponentSummariesLoaded:
        false,

      allOpponentSummariesLoading:
        false,

      history:
        {},

      loadingKeys:
        {},

      historyLoadingKeys:
        {},

      mutatingKeys:
        {},

      loadAllSummaries:
        async (
          force =
            false
        ) => {

          const current =
            get();

          if (
            !force &&
            current
              .allSummariesLoaded
          ) {
            return;
          }

          if (
            current
              .allSummariesLoading
          ) {
            return;
          }

          set({
            allSummariesLoading:
              true,
          });

          try {
            const summaries =
              await fetchAllTeamMemorySummaries();

            set(
              (
                state
              ) => {

                const next = {
                  ...state
                    .summaries,
                };

                for (
                  const summary
                  of summaries
                ) {
                  next[
                    teamMemoryKey(
                      summary
                        .teamName
                    )
                  ] =
                    summary;
                }

                return {
                  summaries:
                    next,

                  allSummariesLoaded:
                    true,
                };
              }
            );
          } finally {
            set({
              allSummariesLoading:
                false,
            });
          }
        },

      loadAllOpponentSummaries:
        async (
          force =
            false
        ) => {

          const current =
            get();

          if (
            !force &&
            current
              .allOpponentSummariesLoaded
          ) {
            return;
          }

          if (
            current
              .allOpponentSummariesLoading
          ) {
            return;
          }

          set({
            allOpponentSummariesLoading:
              true,
          });

          try {
            const opponents =
              await fetchAllTeamMemoryOpponentSummaries();

            const next:
              Record<
                string,
                TeamMemoryOpponentSummary
              > =
              {};

            for (
              const opponent
              of opponents
            ) {
              next[
                teamMemoryKey(
                  opponent
                    .opponentName
                )
              ] =
                opponent;
            }

            set({
              opponentSummaries:
                next,

              allOpponentSummariesLoaded:
                true,
            });
          } finally {
            set({
              allOpponentSummariesLoading:
                false,
            });
          }
        },

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
                    team => [
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
            state => {

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
              state => {

                const next = {
                  ...state
                    .summaries,
                };

                for (
                  const summary
                  of summaries
                ) {
                  next[
                    teamMemoryKey(
                      summary
                        .teamName
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
              state => {

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
            get()
              .history[
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
            state => ({
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
              state => ({
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
              state => ({
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
            state => ({
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
              state => ({
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

            await get()
              .loadAllOpponentSummaries(
                true
              );
          } finally {
            set(
              state => ({
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
            state => ({
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
              state => {

                const nextSummaries = {
                  ...state
                    .summaries,
                };

                if (
                  result
                    .summary
                    .total >
                  0
                ) {
                  nextSummaries[
                    key
                  ] =
                    result
                      .summary;
                } else {
                  delete nextSummaries[
                    key
                  ];
                }

                return {
                  summaries:
                    nextSummaries,

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
                        item =>
                          item.id !==
                          event.id
                      ),
                  },
                };
              }
            );

            await get()
              .loadAllOpponentSummaries(
                true
              );
          } finally {
            set(
              state => ({
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
