
import {
  useEffect,
  useRef,
} from "react";

import {
  useRootNavigationState,
  useRouter,
} from "expo-router";

import {
  Platform,
  ToastAndroid,
} from "react-native";

import Constants from "expo-constants";

import * as Clipboard from "expo-clipboard";

import type {
  NotificationResponse,
} from "expo-notifications";

import {
  useAuthStore,
} from "../features/auth/store/authStore";

function getString(
  value: unknown
): string | null {

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const text = value.trim();

  return (
    text.length > 0 &&
    text.length <= 200
  )
    ? text
    : null;
}

export function useNotificationNavigation():
  void {

  const router = useRouter();

  const navigationState =
    useRootNavigationState();

  const authStatus =
    useAuthStore(
      state => state.status
    );

  /*
   * Evita procesar dos veces
   * una misma interaccion.
   */
  const handledRef =
    useRef<string | null>(
      null
    );

  const navigationReady =
    Boolean(navigationState?.key);

  useEffect(() => {

    /*
     * En Expo Go Android no
     * cargamos expo-notifications.
     */
    if (
      Platform.OS === "android" &&
      Constants.executionEnvironment ===
        "storeClient"
    ) {
      return;
    }

    /*
     * Esperamos que la navegacion
     * y la autenticacion terminen
     * de inicializarse.
     */
    if (
      !navigationReady ||
      authStatus !== "authenticated"
    ) {
      return;
    }

    let active = true;

    let removeListener:
      (() => void) | null = null;

    const initialize =
      async () => {

        const Notifications =
          await import(
            "expo-notifications"
          );

        if (!active) {
          return;
        }

        const handleResponse =
          async (
            response:
              NotificationResponse
          ): Promise<void> => {

            const request =
              response.notification
                .request;

            const identifier =
              [
                request.identifier,
                response.actionIdentifier,
              ].join(":");

            if (
              handledRef.current ===
              identifier
            ) {
              return;
            }

            const data =
              request.content.data ?? {};

            const type =
              getString(data.type);

            const action =
              response.actionIdentifier;

            const isDefaultAction =
              action ===
              Notifications
                .DEFAULT_ACTION_IDENTIFIER;

            const isOpenAction =
              action === "OPEN_MATCH";

            const isCopyAction =
              action === "COPY_MATCH";

            if (
              !isDefaultAction &&
              !isOpenAction &&
              !isCopyAction
            ) {
              return;
            }

            /*
             * Marcamos antes de
             * cualquier operacion
             * asincrona.
             */
            handledRef.current =
              identifier;

            const clearResponse =
              async () => {
                await Notifications
                  .clearLastNotificationResponseAsync();
              };

            try {

              /*
               * COPIAR PARTIDO
               *
               * El backend envia
               * los nombres reales.
               */
              if (
                type ===
                  "RED_CARD_ALERT" &&
                isCopyAction
              ) {

                const home =
                  getString(
                    data.homeName
                  );

                const away =
                  getString(
                    data.awayName
                  );

                if (
                  home &&
                  away
                ) {
                  await Clipboard
                    .setStringAsync(
                      `${home} vs ${away}`
                    );

                  if (
                    Platform.OS ===
                    "android"
                  ) {
                    ToastAndroid.show(
                      "Partido copiado",
                      ToastAndroid.SHORT
                    );
                  }
                } else {
                  console.warn(
                    "[NotificationNavigation] names unavailable"
                  );
                }

                await clearResponse();
                return;
              }

              /*
               * ABRIR PARTIDO
               *
               * Compatible con:
               * - nuevas rojas
               * - alertas Watchlist
               */
              if (
                type ===
                  "RED_CARD_ALERT" ||
                type ===
                  "WATCHLIST_ALERT"
              ) {

                const provider =
                  getString(
                    data.provider
                  );

                const externalId =
                  getString(
                    data.externalId
                  );

                if (
                  provider &&
                  externalId
                ) {
                  router.push({
                    pathname:
                      "/match/[provider]/[id]",


params: {
  provider,

  id: externalId,

  ...(type === "RED_CARD_ALERT"
    ? {
        focus: "red-card",

        homeName:
          getString(data.homeName) ?? "",

        awayName:
          getString(data.awayName) ?? "",

        affectedSide:
          getString(data.affectedSide) ??
          "unknown",

        minute:
          typeof data.minute === "number"
            ? String(data.minute)
            : "",
      }
    : {}),
},

                  });

                } else {
                  /*
                   * No inventar una
                   * ruta de partido.
                   */
                  router.push(
                    "/alerts"
                  );
                }

                await clearResponse();
                return;
              }

              /*
               * Notificaciones antiguas
               * y tests anteriores.
               */
              if (
                type === "OPEN_ALERTS"
              ) {
                router.push(
                  "/alerts"
                );

                await clearResponse();
                return;
              }

              await clearResponse();

            } catch (error) {
              console.warn(
                "[NotificationNavigation] action failed",
                error
              );

              /*
               * Permitimos otro intento
               * si fallo la operacion.
               */
              handledRef.current = null;
            }
          };

        /*
         * Aplicacion en foreground
         * o background.
         */
        const subscription =
          Notifications
            .addNotificationResponseReceivedListener(
              response => {
                void handleResponse(
                  response
                );
              }
            );

        removeListener =
          () => subscription.remove();

        /*
         * Aplicacion abierta desde
         * una notificacion cuando
         * estaba completamente cerrada.
         */
        const lastResponse =
          await Notifications
            .getLastNotificationResponseAsync();

        if (
          active &&
          lastResponse
        ) {
          await handleResponse(
            lastResponse
          );
        }
      };

    void initialize()
      .catch(error => {
        console.warn(
          "[NotificationNavigation] initialization failed",
          error
        );
      });

    return () => {
      active = false;

      removeListener?.();
    };

  }, [
    router,
    navigationReady,
    authStatus,
  ]);
}

