import {
  create,
} from "zustand";

import type {
  ServerConnection,
} from "../../domain/entities/ServerConnection";

import {
  serverConfigService,
} from "../../serverConfigModule";

interface State {
  active:
    ServerConnection |
    null;

  draft:
    string;

  loading:
    boolean;

  testing:
    boolean;

  saving:
    boolean;

  tested:
    boolean;

  message:
    string |
    null;

  error:
    string |
    null;

  load:
    () =>
      Promise<void>;

  setDraft:
    (
      value:
        string
    ) =>
      void;

  testConnection:
    () =>
      Promise<boolean>;

  save:
    () =>
      Promise<boolean>;

  reset:
    () =>
      Promise<void>;
}

export const useServerConfigStore =
  create<State>(
    (
      set,
      get
    ) => ({
      active:
        null,

      draft:
        "",

      loading:
        false,

      testing:
        false,

      saving:
        false,

      tested:
        false,

      message:
        null,

      error:
        null,

      load:
        async () => {

          set({
            loading:
              true,

            error:
              null,
          });

          try {
            const active =
              await serverConfigService
                .getActive();

            set({
              active,

              draft:
                active.origin,
            });

          } catch (
            error
          ) {

            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo cargar la configuración",
            });

          } finally {

            set({
              loading:
                false,
            });
          }
        },

      setDraft:
        (
          value
        ) => {

          set({
            draft:
              value,

            tested:
              false,

            message:
              null,

            error:
              null,
          });
        },

      testConnection:
        async () => {

          const value =
            get()
              .draft;

          set({
            testing:
              true,

            tested:
              false,

            message:
              null,

            error:
              null,
          });

          try {
            const candidate =
              await serverConfigService
                .validate(
                  value
                );

            set({
              tested:
                true,

              draft:
                candidate.origin,

              message:
                "✓ Backend conectado correctamente",
            });

            return true;

          } catch (
            error
          ) {

            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo conectar al servidor",
            });

            return false;

          } finally {

            set({
              testing:
                false,
            });
          }
        },

      save:
        async () => {

          const value =
            get()
              .draft;

          set({
            saving:
              true,

            message:
              null,

            error:
              null,
          });

          try {
            /*
             * saveOverride vuelve a validar
             * antes de persistir.
             *
             * Nunca guardamos a ciegas.
             */
            const active =
              await serverConfigService
                .saveOverride(
                  value
                );

            set({
              active,

              draft:
                active.origin,

              tested:
                true,

              message:
                "✓ Servidor guardado. API y Socket usarán esta dirección.",
            });

            return true;

          } catch (
            error
          ) {

            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo guardar el servidor",
            });

            return false;

          } finally {

            set({
              saving:
                false,
            });
          }
        },

      reset:
        async () => {

          set({
            saving:
              true,

            message:
              null,

            error:
              null,
          });

          try {
            const active =
              await serverConfigService
                .clearOverride();

            set({
              active,

              draft:
                active.origin,

              tested:
                false,

              message:
                "Servidor predeterminado restaurado",
            });

          } catch (
            error
          ) {

            set({
              error:
                error instanceof
                  Error
                  ? error.message
                  : "No se pudo restaurar el servidor",
            });

          } finally {

            set({
              saving:
                false,
            });
          }
        },
    })
  );
