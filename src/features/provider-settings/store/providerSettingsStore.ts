import {
  create,
} from "zustand";

import {
  fetchProviderSettings,
  setProviderEnabled,
} from "../api/providerSettingsService";

import type {
  FootballProviderKey,
  FootballProviderSetting,
} from "../types/providerSettings";

interface State {
  items:
    Record<
      FootballProviderKey,
      FootballProviderSetting
    > |
    null;

  loading:
    boolean;

  updatingKey:
    FootballProviderKey |
    null;

  loaded:
    boolean;

  noSession:
    boolean;

  error:
    string |
    null;

  message:
    string |
    null;

  load:
    (
      force?:
        boolean
    ) =>
      Promise<void>;

  toggle:
    (
      key:
        FootballProviderKey,

      enabled:
        boolean
    ) =>
      Promise<void>;
}

function toRecord(
  items:
    FootballProviderSetting[]
):
  Record<
    FootballProviderKey,
    FootballProviderSetting
  > {

  const result =
    {} as Record<
      FootballProviderKey,
      FootballProviderSetting
    >;

  for (
    const item
    of items
  ) {
    result[
      item.key
    ] =
      item;
  }

  return result;
}

export const useProviderSettingsStore =
  create<State>(
    (
      set,
      get
    ) => ({
      items:
        null,

      loading:
        false,

      updatingKey:
        null,

      loaded:
        false,

      noSession:
        false,

      error:
        null,

      message:
        null,

      load:
        async (
          force =
            false
        ) => {

          const current =
            get();

          if (
            !force &&
            (
              current.loading ||
              current.loaded
            )
          ) {
            return;
          }

          set({
            loading:
              true,

            error:
              null,

            message:
              null,

            noSession:
              false,
          });

          try {
            const items =
              await fetchProviderSettings();

            set({
              items:
                toRecord(
                  items
                ),

              loaded:
                true,

              noSession:
                false,
            });

          } catch (
            error
          ) {

            if (
              error instanceof
                Error &&
              error.message ===
                "NO_SESSION"
            ) {
              set({
                noSession:
                  true,

                loaded:
                  false,
              });

              return;
            }

            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudieron cargar los proveedores",
            });

          } finally {

            set({
              loading:
                false,
            });
          }
        },

      toggle:
        async (
          key,
          enabled
        ) => {

          if (
            get().updatingKey
          ) {
            return;
          }

          set({
            updatingKey:
              key,

            error:
              null,

            message:
              null,
          });

          try {
            const updated =
              await setProviderEnabled(
                key,
                enabled
              );

            set(
              state => ({
                items:
                  state.items
                    ? {
                        ...state.items,

                        [key]:
                          updated,
                      }
                    : state.items,

                message:
                  enabled
                    ? `${providerName(
                        key
                      )} activado`
                    : `${providerName(
                        key
                      )} desactivado y su caché invalidada`,
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
                  : "No se pudo cambiar el proveedor",
            });

          } finally {

            set({
              updatingKey:
                null,
            });
          }
        },
    })
  );

function providerName(
  key:
    FootballProviderKey
): string {

  switch (
    key
  ) {

    case "sofascore":
      return "SofaScore";

    case "flashscore":
      return "Flashscore";

    case "fotmob":
      return "FotMob";

    case "api-football":
      return "API-Football";

    case "1xbet":
      return "1XBet";
  }
}
