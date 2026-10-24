import {
  create,
} from "zustand";

import {
  fetchLateGoalProfiles,
} from "../api/lateGoalService";

import type {
  TeamLateGoalProfile,
} from "../types/lateGoal";

export function lateGoalTeamKey(
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
  profiles:
    Record<
      string,
      TeamLateGoalProfile
    >;

  loadingKeys:
    Record<
      string,
      boolean
    >;

  ensureTeams:
    (
      teamNames:
        string[]
    ) =>
      Promise<void>;

  clear:
    () =>
      void;
}

export const useLateGoalStore =
  create<State>(
    (
      set,
      get
    ) => ({
      profiles: {},

      loadingKeys: {},

      ensureTeams:
        async (
          teamNames
        ) => {

          /*
           * Nombres únicos y válidos.
           */
          const uniqueNames =
            Array.from(
              new Set(
                teamNames
                  .map(
                    name =>
                      name.trim()
                  )
                  .filter(
                    Boolean
                  )
              )
            );

          if (
            uniqueNames.length ===
            0
          ) {
            return;
          }

          const current =
            get();

          /*
           * No volvemos a consultar
           * equipos que ya están
           * cacheados o cargándose.
           */
          const missing =
            uniqueNames
              .filter(
                teamName => {

                  const key =
                    lateGoalTeamKey(
                      teamName
                    );

                  return (
                    !current
                      .profiles[
                        key
                      ] &&
                    !current
                      .loadingKeys[
                        key
                      ]
                  );
                }
              );

          if (
            missing.length ===
            0
          ) {
            return;
          }

          /*
           * Marcamos todo el lote.
           */
          set(
            state => {

              const loadingKeys = {
                ...state
                  .loadingKeys,
              };

              for (
                const teamName
                of missing
              ) {
                loadingKeys[
                  lateGoalTeamKey(
                    teamName
                  )
                ] =
                  true;
              }

              return {
                loadingKeys,
              };
            }
          );

          try {
            /*
             * UNA petición para
             * todos los equipos.
             */
            const profiles =
              await fetchLateGoalProfiles(
                missing,
                50
              );

            set(
              state => {

                const nextProfiles = {
                  ...state
                    .profiles,
                };

                for (
                  const profile
                  of profiles
                ) {
                  nextProfiles[
                    lateGoalTeamKey(
                      profile.teamName
                    )
                  ] =
                    profile;
                }

                return {
                  profiles:
                    nextProfiles,
                };
              }
            );

          } catch (
            error
          ) {

            console.warn(
              "[LateGoalStore.ensureTeams]",
              error instanceof Error
                ? error.message
                : error
            );

          } finally {

            set(
              state => {

                const loadingKeys = {
                  ...state
                    .loadingKeys,
                };

                for (
                  const teamName
                  of missing
                ) {
                  loadingKeys[
                    lateGoalTeamKey(
                      teamName
                    )
                  ] =
                    false;
                }

                return {
                  loadingKeys,
                };
              }
            );
          }
        },

      clear:
        () =>
          set({
            profiles: {},
            loadingKeys: {},
          }),
    })
  );
