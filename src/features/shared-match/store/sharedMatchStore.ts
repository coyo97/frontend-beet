import {
  create,
} from "zustand";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  createSharingGroup,
  getSharedMatches,
  getSharingGroup,
  joinSharingGroup,
  shareMatch,
} from "../api/sharedMatchService";

import type {
  SharedMatchAction,
  SharedMatchInsight,
  SharedMatchSide,
  SharingGroup,
} from "../types/sharedMatch";

interface SharedMatchState {
  group:
    SharingGroup | null;

  items:
    SharedMatchInsight[];

  unreadCount:
    number;

  loading:
    boolean;

  sharing:
    boolean;

  error:
    string | null;

  loadGroup:
    () =>
      Promise<void>;

  createGroup:
    (
      name?:
        string
    ) =>
      Promise<void>;

  joinGroup:
    (
      inviteCode:
        string
    ) =>
      Promise<void>;

  load:
    () =>
      Promise<void>;

  share:
    (
      match:
        LiveMatch,

      action:
        SharedMatchAction,

      selectedSide:
        SharedMatchSide |
        null,

      note?:
        string | null
    ) =>
      Promise<
        SharedMatchInsight
      >;

  addRealtime:
    (
      item:
        SharedMatchInsight
    ) => void;

  markAllRead:
    () => void;

  reset:
    () => void;
}

function mergeUnique(
  current:
    SharedMatchInsight[],

  incoming:
    SharedMatchInsight
): SharedMatchInsight[] {

  const withoutExisting =
    current.filter(
      item =>
        item._id !==
        incoming._id
    );

  return [
    incoming,
    ...withoutExisting,
  ];
}

export const useSharedMatchStore =
  create<SharedMatchState>(
    (
      set
    ) => ({
      group:
        null,

      items:
        [],

      unreadCount:
        0,

      loading:
        false,

      sharing:
        false,

      error:
        null,

      loadGroup:
        async () => {
          try {
            const group =
              await getSharingGroup();

            set({
              group,
              error:
                null,
            });
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo cargar el grupo",
            });
          }
        },

      createGroup:
        async (
          name =
            "Hermanos"
        ) => {
          try {
            const group =
              await createSharingGroup(
                name
              );

            set({
              group,
              error:
                null,
            });
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo crear el grupo",
            });

            throw error;
          }
        },

      joinGroup:
        async (
          inviteCode
        ) => {
          try {
            const group =
              await joinSharingGroup(
                inviteCode
              );

            set({
              group,
              error:
                null,
            });
          } catch (
            error
          ) {
            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo unir al grupo",
            });

            throw error;
          }
        },

      load:
        async () => {
          set({
            loading:
              true,
          });

          try {
            const items =
              await getSharedMatches();

            set({
              items,
              loading:
                false,
              error:
                null,
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
                  : "No se pudieron cargar los compartidos",
            });
          }
        },

      share:
        async (
          match,
          action,
          selectedSide,
          note =
            null
        ) => {
          set({
            sharing:
              true,
          });

          try {
            const item =
              await shareMatch(
                match,
                action,
                selectedSide,
                note
              );

            /*
             * También lo agregamos
             * localmente.
             *
             * Si además vuelve por Socket,
             * mergeUnique evita duplicarlo.
             */
            set(
              state => ({
                items:
                  mergeUnique(
                    state.items,
                    item
                  ),

                sharing:
                  false,

                error:
                  null,
              })
            );

            return item;
          } catch (
            error
          ) {
            set({
              sharing:
                false,

              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo compartir",
            });

            throw error;
          }
        },

      addRealtime:
        (
          item
        ) => {
          set(
            state => {
              const alreadyExists =
                state.items.some(
                  current =>
                    current._id ===
                    item._id
                );

              return {
                items:
                  mergeUnique(
                    state.items,
                    item
                  ),

                /*
                 * Si es el mismo evento que
                 * acabamos de crear nosotros,
                 * no aumentamos dos veces.
                 */
                unreadCount:
                  alreadyExists
                    ? state
                        .unreadCount
                    : state
                        .unreadCount +
                      1,
              };
            }
          );
        },

      markAllRead:
        () => {
          set({
            unreadCount:
              0,
          });
        },

      reset:
        () => {
          set({
            group:
              null,

            items:
              [],

            unreadCount:
              0,

            loading:
              false,

            sharing:
              false,

            error:
              null,
          });
        },
    })
  );
