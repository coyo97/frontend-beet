import AsyncStorage from
  "@react-native-async-storage/async-storage";

import {
  create,
} from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type {
  MatchPick,
} from "../types/matchPick";

interface State {
  items:
    Record<
      string,
      MatchPick
    >;

  select:
    (
      pick:
        MatchPick
    ) =>
      void;

  remove:
    (
      key:
        string
    ) =>
      void;

  clear:
    () =>
      void;
}

export const useMatchPickStore =
  create<State>()(
    persist(
      (
        set,
        get
      ) => ({
        items:
          {},

        select:
          (
            pick
          ) => {

            const existing =
              get()
                .items[
                  pick.key
                ];

            /*
             * Si toca nuevamente el mismo
             * equipo, desmarca la apuesta.
             */
            if (
              existing?.teamName ===
              pick.teamName
            ) {
              set(
                state => {

                  const next = {
                    ...state.items,
                  };

                  delete next[
                    pick.key
                  ];

                  return {
                    items:
                      next,
                  };
                }
              );

              return;
            }

            /*
             * Si selecciona el otro equipo
             * del mismo partido,
             * reemplazamos la selección.
             */
            set(
              state => ({
                items: {
                  ...state.items,

                  [pick.key]:
                    pick,
                },
              })
            );
          },

        remove:
          (
            key
          ) => {

            set(
              state => {

                const next = {
                  ...state.items,
                };

                delete next[
                  key
                ];

                return {
                  items:
                    next,
                };
              }
            );
          },

        clear:
          () => {
            set({
              items:
                {},
            });
          },
      }),
      {
        name:
          "football-radar-match-picks-v1",

        storage:
          createJSONStorage(
            () =>
              AsyncStorage
          ),
      }
    )
  );
