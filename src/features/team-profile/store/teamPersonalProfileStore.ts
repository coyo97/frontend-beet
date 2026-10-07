import {
  create,
} from "zustand";

import {
  fetchTeamPersonalProfile,
  fetchTeamPersonalProfiles,
  saveTeamPersonalProfile,
} from "../api/teamPersonalProfileService";

import type {
  SaveTeamPersonalProfileInput,
  TeamPersonalProfile,
} from "../types/teamPersonalProfile";

export function teamPersonalProfileKey(
  teamName:
    string
): string {

  return teamName
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
      /\s+/g,
      " "
    );
}

interface State {
  profiles:
    Record<
      string,
      TeamPersonalProfile |
      null
    >;

  loadedKeys:
    Record<
      string,
      boolean
    >;

  loadingKeys:
    Record<
      string,
      boolean
    >;

  savingKeys:
    Record<
      string,
      boolean
    >;

  errors:
    Record<
      string,
      string |
      null
    >;

  all:
    TeamPersonalProfile[];

  allLoading:
    boolean;

  ensure:
    (
      teamName:
        string
    ) =>
      Promise<void>;

  save:
    (
      input:
        SaveTeamPersonalProfileInput
    ) =>
      Promise<
        TeamPersonalProfile |
        null
      >;

  refreshAll:
    () =>
      Promise<void>;
}

const inflight =
  new Map<
    string,
    Promise<void>
  >();

export const useTeamPersonalProfileStore =
  create<State>(
    (
      set,
      get
    ) => ({
      profiles:
        {},

      loadedKeys:
        {},

      loadingKeys:
        {},

      savingKeys:
        {},

      errors:
        {},

      all:
        [],

      allLoading:
        false,

      ensure:
        async (
          teamName
        ) => {

          const key =
            teamPersonalProfileKey(
              teamName
            );

          if (
            !key ||
            get()
              .loadedKeys[
                key
              ]
          ) {
            return;
          }

          const current =
            inflight.get(
              key
            );

          if (
            current
          ) {
            return current;
          }

          const promise =
            (async () => {

              set(
                state => ({
                  loadingKeys: {
                    ...state.loadingKeys,

                    [key]:
                      true,
                  },

                  errors: {
                    ...state.errors,

                    [key]:
                      null,
                  },
                })
              );

              try {
                const profile =
                  await fetchTeamPersonalProfile(
                    teamName
                  );

                set(
                  state => ({
                    profiles: {
                      ...state.profiles,

                      [key]:
                        profile,
                    },

                    loadedKeys: {
                      ...state.loadedKeys,

                      [key]:
                        true,
                    },
                  })
                );
              } catch (
                error
              ) {

                set(
                  state => ({
                    errors: {
                      ...state.errors,

                      [key]:
                        error instanceof
                          Error
                          ? error.message
                          : "No se pudo cargar el perfil",
                    },
                  })
                );
              } finally {
                set(
                  state => ({
                    loadingKeys: {
                      ...state.loadingKeys,

                      [key]:
                        false,
                    },
                  })
                );
              }
            })();

          inflight.set(
            key,
            promise
          );

          try {
            await promise;
          } finally {
            inflight.delete(
              key
            );
          }
        },

      save:
        async (
          input
        ) => {

          const key =
            teamPersonalProfileKey(
              input.teamName
            );

          set(
            state => ({
              savingKeys: {
                ...state.savingKeys,

                [key]:
                  true,
              },

              errors: {
                ...state.errors,

                [key]:
                  null,
              },
            })
          );

          try {
            const profile =
              await saveTeamPersonalProfile(
                input
              );

            set(
              state => ({
                profiles: {
                  ...state.profiles,

                  [key]:
                    profile,
                },

                loadedKeys: {
                  ...state.loadedKeys,

                  [key]:
                    true,
                },

                all:
                  profile
                    ? [
                        profile,

                        ...state.all
                          .filter(
                            item =>
                              item.teamKey !==
                              key
                          ),
                      ]
                    : state.all
                        .filter(
                          item =>
                            item.teamKey !==
                            key
                        ),
              })
            );

            return profile;
          } catch (
            error
          ) {

            const message =
              error instanceof
                Error
                ? error.message
                : "No se pudo guardar";

            set(
              state => ({
                errors: {
                  ...state.errors,

                  [key]:
                    message,
                },
              })
            );

            throw error;
          } finally {
            set(
              state => ({
                savingKeys: {
                  ...state.savingKeys,

                  [key]:
                    false,
                },
              })
            );
          }
        },

      refreshAll:
        async () => {

          set({
            allLoading:
              true,
          });

          try {
            const items =
              await fetchTeamPersonalProfiles();

            const profiles:
              Record<
                string,
                TeamPersonalProfile
              > =
              {};

            const loadedKeys:
              Record<
                string,
                boolean
              > =
              {};

            for (
              const item
              of items
            ) {
              profiles[
                item.teamKey
              ] =
                item;

              loadedKeys[
                item.teamKey
              ] =
                true;
            }

            set(
              state => ({
                all:
                  items,

                profiles: {
                  ...state.profiles,
                  ...profiles,
                },

                loadedKeys: {
                  ...state.loadedKeys,
                  ...loadedKeys,
                },
              })
            );
          } finally {
            set({
              allLoading:
                false,
            });
          }
        },
    })
  );
