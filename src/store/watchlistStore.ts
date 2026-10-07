import {
  create,
} from "zustand";

import {
  createRadarRule as createRadarRuleService,
  deleteWatchlistItem,
  followCompetition as followCompetitionService,
  followCountry as followCountryService,
  followMatch as followMatchService,
  followTeam as followTeamService,
  getWatchlist,
  setWatchlistEnabled,
} from "../async/services/watchlistService";

import type {
  LiveMatch,
} from "../types/radar";

import type {
  WatchlistItem,
  WatchlistRadarRule,
} from "../types/watchlist";


interface WatchlistState {
  items:
    WatchlistItem[];

  loading:
    boolean;

  mutating:
    boolean;

  error:
    string | null;


  /*
   * LOAD
   */
  load:
    () =>
      Promise<void>;


  /*
   * FOLLOW MATCH
   */
  followMatch:
    (
      match:
        LiveMatch
    ) =>
      Promise<
        WatchlistItem
      >;


  /*
   * FOLLOW TEAM
   */
  followTeam:
    (
      name:
        string,

      country?:
        string |
        null
    ) =>
      Promise<void>;


  /*
   * FOLLOW COMPETITION
   */
  followCompetition:
    (
      name:
        string,

      country?:
        string |
        null
    ) =>
      Promise<void>;


  /*
   * FOLLOW COUNTRY
   */
  followCountry:
    (
      country:
        string
    ) =>
      Promise<void>;


  /*
   * CREATE RADAR RULE
   */
  createRadarRule:
    (
      label:
        string,

      rule:
        WatchlistRadarRule
    ) =>
      Promise<void>;


  /*
   * REMOVE
   */
  remove:
    (
      id:
        string
    ) =>
      Promise<void>;


  /*
   * ENABLE / DISABLE
   */
  setEnabled:
    (
      id:
        string,

      enabled:
        boolean
    ) =>
      Promise<void>;


  /*
   * FIND MATCH
   */
  findMatch:
    (
      match:
        LiveMatch
    ) =>
      WatchlistItem |
      null;


  /*
   * FIND TEAM
   */
  findTeam:
    (
      name:
        string
    ) =>
      WatchlistItem |
      undefined;


  /*
   * FIND COMPETITION
   */
  findCompetition:
    (
      name:
        string,

      country?:
        string |
        null
    ) =>
      WatchlistItem |
      undefined;


  /*
   * FIND COUNTRY
   */
  findCountry:
    (
      country:
        string
    ) =>
      WatchlistItem |
      undefined;
}


/*
 * -------------------------------------------------
 * NORMALIZE
 * -------------------------------------------------
 */
function normalize(
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
      /\s+/g,
      " "
    );
}


/*
 * -------------------------------------------------
 * MERGE ITEM
 * -------------------------------------------------
 *
 * Si el backend devuelve un item que ya existe,
 * actualizamos ese item.
 *
 * Si no existe, lo agregamos al principio.
 */
function mergeItem(
  items:
    WatchlistItem[],

  incoming:
    WatchlistItem
): WatchlistItem[] {

  const exists =
    items.some(
      (
        item
      ) =>
        item.id ===
        incoming.id
    );

  if (
    exists
  ) {
    return items.map(
      (
        item
      ) =>
        item.id ===
        incoming.id
          ? incoming
          : item
    );
  }

  return [
    incoming,
    ...items,
  ];
}


/*
 * -------------------------------------------------
 * FIND MATCH ITEM
 * -------------------------------------------------
 *
 * Un partido puede tener varias fuentes:
 *
 * flashscore
 * api-football
 * fotmob
 * etc.
 *
 * Consideramos que está seguido si cualquiera
 * de sus sources coincide con el item guardado.
 */
function findMatchItem(
  items:
    WatchlistItem[],

  match:
    LiveMatch
):
  WatchlistItem |
  null {

  const sources =
    new Set(
      match.sources.map(
        (
          source
        ) =>
          `${source.provider}:${source.externalId}`
      )
    );

  return (
    items.find(
      (
        item
      ) => {

        if (
          item.type !==
          "match"
        ) {
          return false;
        }

        const provider =
          item.target
            .provider;

        const externalId =
          item.target
            .externalId;

        if (
          !provider ||
          !externalId
        ) {
          return false;
        }

        return sources.has(
          `${provider}:${externalId}`
        );
      }
    ) ??
    null
  );
}


/*
 * =================================================
 * STORE
 * =================================================
 */
export const useWatchlistStore =
  create<WatchlistState>(
    (
      set,
      get
    ) => ({

      items:
        [],

      loading:
        false,

      mutating:
        false,

      error:
        null,


      /*
       * ---------------------------------------------
       * LOAD
       * ---------------------------------------------
       */
      load:
        async () => {

          set({
            loading:
              true,

            error:
              null,
          });

          try {
            const response =
              await getWatchlist();

            set({
              items:
                response.items,
            });
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error loading watchlist",
            });
          } finally {
            set({
              loading:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * FOLLOW MATCH
       * ---------------------------------------------
       */
      followMatch:
        async (
          match
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            const response =
              await followMatchService(
                match
              );

            const item =
              response.item;

            set(
              (
                state
              ) => ({
                items:
                  mergeItem(
                    state.items,
                    item
                  ),
              })
            );

            return item;
          } catch (
            error
          ) {
            const message =
              error instanceof
                Error
                ? error.message
                : "Error following match";

            set({
              error:
                message,
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * FOLLOW TEAM
       * ---------------------------------------------
       */
      followTeam:
        async (
          name,
          country
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            const item =
              await followTeamService(
                name,
                country
              );

            set(
              (
                state
              ) => ({
                items:
                  mergeItem(
                    state.items,
                    item
                  ),
              })
            );
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error following team",
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * FOLLOW COMPETITION
       * ---------------------------------------------
       */
      followCompetition:
        async (
          name,
          country
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            const item =
              await followCompetitionService(
                name,
                country
              );

            set(
              (
                state
              ) => ({
                items:
                  mergeItem(
                    state.items,
                    item
                  ),
              })
            );
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error following competition",
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * FOLLOW COUNTRY
       * ---------------------------------------------
       */
      followCountry:
        async (
          country
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            const item =
              await followCountryService(
                country
              );

            set(
              (
                state
              ) => ({
                items:
                  mergeItem(
                    state.items,
                    item
                  ),
              })
            );
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error following country",
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * CREATE RADAR RULE
       * ---------------------------------------------
       */
      createRadarRule:
        async (
          label,
          rule
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            const item =
              await createRadarRuleService(
                label,
                rule
              );

            set(
              (
                state
              ) => ({
                items:
                  mergeItem(
                    state.items,
                    item
                  ),
              })
            );
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error creating radar rule",
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * REMOVE
       * ---------------------------------------------
       */
      remove:
        async (
          id
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            await deleteWatchlistItem(
              id
            );

            set(
              (
                state
              ) => ({
                items:
                  state.items.filter(
                    (
                      item
                    ) =>
                      item.id !==
                      id
                  ),
              })
            );
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error deleting watchlist item",
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * ENABLE / DISABLE
       * ---------------------------------------------
       */
      setEnabled:
        async (
          id,
          enabled
        ) => {

          set({
            mutating:
              true,

            error:
              null,
          });

          try {
            const response =
              await setWatchlistEnabled(
                id,
                enabled
              );

            set(
              (
                state
              ) => ({
                items:
                  mergeItem(
                    state.items,
                    response.item
                  ),
              })
            );
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Error updating watchlist",
            });

            throw error;
          } finally {
            set({
              mutating:
                false,
            });
          }
        },


      /*
       * ---------------------------------------------
       * FIND MATCH
       * ---------------------------------------------
       */
      findMatch:
        (
          match
        ) =>
          findMatchItem(
            get().items,
            match
          ),


      /*
       * ---------------------------------------------
       * FIND TEAM
       * ---------------------------------------------
       */
      findTeam:
        (
          name
        ) => {

          const target =
            normalize(
              name
            );

          return get()
            .items
            .find(
              (
                item
              ) => {

                if (
                  item.type !==
                  "team"
                ) {
                  return false;
                }

                return (
                  normalize(
                    item.target
                      .name ??
                      ""
                  ) ===
                  target
                );
              }
            );
        },


      /*
       * ---------------------------------------------
       * FIND COMPETITION
       * ---------------------------------------------
       */
      findCompetition:
        (
          name,
          country
        ) => {

          const targetName =
            normalize(
              name
            );

          const targetCountry =
            normalize(
              country ??
                ""
            );

          return get()
            .items
            .find(
              (
                item
              ) => {

                if (
                  item.type !==
                  "competition"
                ) {
                  return false;
                }

                const itemName =
                  normalize(
                    item.target
                      .competition ??
                      item.target
                        .name ??
                      ""
                  );

                if (
                  itemName !==
                  targetName
                ) {
                  return false;
                }

                /*
                 * Si no recibimos país,
                 * el nombre es suficiente.
                 */
                if (
                  !targetCountry
                ) {
                  return true;
                }

                return (
                  normalize(
                    item.target
                      .country ??
                      ""
                  ) ===
                  targetCountry
                );
              }
            );
        },


      /*
       * ---------------------------------------------
       * FIND COUNTRY
       * ---------------------------------------------
       */
      findCountry:
        (
          country
        ) => {

          const target =
            normalize(
              country
            );

          return get()
            .items
            .find(
              (
                item
              ) => {

                if (
                  item.type !==
                  "country"
                ) {
                  return false;
                }

                return (
                  normalize(
                    item.target
                      .country ??
                      item.target
                        .name ??
                      ""
                  ) ===
                  target
                );
              }
            );
        },
    })
  );
