import {
  create,
} from "zustand";

import {
  fetchRecentMatches,
} from "../api/recentMatchesService";

import type {
  RecentMatch,
} from "../types/recentMatch";

interface State {
  items:
    RecentMatch[];

  loading:
    boolean;

  error:
    string | null;

  refresh:
    () =>
      Promise<void>;

  clear:
    () =>
      void;
}

export const useRecentMatchesStore =
  create<State>(
    (
      set
    ) => ({
      items:
        [],

      loading:
        false,

      error:
        null,

      refresh:
        async () => {

          set({
            loading:
              true,

            error:
              null,
          });

          try {
            const items =
              await fetchRecentMatches({
                hours:
                  48,

                limit:
                  400,
              });

            set({
              items,
            });
          } catch (
            error
          ) {

            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudieron cargar los partidos recientes",
            });
          } finally {
            set({
              loading:
                false,
            });
          }
        },

      clear:
        () => {
          set({
            items:
              [],

            error:
              null,
          });
        },
    })
  );
