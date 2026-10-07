import {
  useEffect,
} from "react";

import {
  useRouter,
} from "expo-router";

import * as Notifications
  from "expo-notifications";

function getString(
  value: unknown
): string | null {

  return typeof value ===
    "string"
    ? value
    : null;
}

export function useNotificationNavigation() {
  const router =
    useRouter();

  useEffect(
    () => {

      const handleResponse =
        async (
          response:
            Notifications
              .NotificationResponse
        ) => {

          if (
            response.actionIdentifier !==
            Notifications
              .DEFAULT_ACTION_IDENTIFIER
          ) {
            return;
          }

const data =
  response.notification
    .request
    .content
    .data ?? {};

const type =
  getString(
    data.type
  );
             if (
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

                  id:
                    externalId,
                },
              });

              await Notifications
                .clearLastNotificationResponseAsync();

              return;
            }
          }

          if (
            type ===
            "OPEN_ALERTS"
          ) {
            router.push(
              "/alerts"
            );

            await Notifications
              .clearLastNotificationResponseAsync();
          }
        };

      /*
       * Caso 1:
       * La app estaba abierta
       * o en background.
       */
      const subscription =
        Notifications
          .addNotificationResponseReceivedListener(
            (
              response
            ) => {
              void handleResponse(
                response
              );
            }
          );

      /*
       * Caso 2:
       * La app estaba cerrada
       * y fue abierta tocando
       * una notificación.
       */
      void Notifications
        .getLastNotificationResponseAsync()
        .then(
          (
            response
          ) => {
            if (response) {
              void handleResponse(
                response
              );
            }
          }
        );

      return () => {
        subscription.remove();
      };
    },
    [
      router,
    ]
  );
}
