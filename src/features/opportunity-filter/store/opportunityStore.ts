import {
  create,
} from "zustand";

import {
  fetchOpportunities,
} from "../api/opportunityService";

import type {
  MatchOpportunity,
  OpportunitiesResponse,
  OpportunityFilters,
} from "../types/opportunity";

interface State {
  items:
    MatchOpportunity[];

  loading:
    boolean;

  error:
    string | null;

  summary:
    Omit<
      OpportunitiesResponse,
      "opportunities"
    > | null;

  load:
    (
      filters:
        OpportunityFilters
    ) =>
      Promise<void>;

  clear:
    () =>
      void;
}

export const useOpportunityStore =
  create<State>(
    set => ({
      items:
        [],

      loading:
        false,

      error:
        null,

      summary:
        null,

      load:
        async (
          filters
        ) => {

          set({
            loading:
              true,

            error:
              null,
          });

          try {
            const result =
              await fetchOpportunities(
                filters
              );

            const {
              opportunities,
              ...summary
            } =
              result;

            set({
              items:
                opportunities,

              summary,

              loading:
                false,
            });
          } catch (
            error
          ) {

            set({
              loading:
                false,

              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo analizar los partidos",
            });
          }
        },

      clear:
        () => {
          set({
            items:
              [],

            summary:
              null,

            error:
              null,
          });
        },
    })
  );
