import {
  useEffect,
} from "react";

import {
  AppState,
} from "react-native";

import {
  env,
} from "../../../../config/env";

import {
  useRadarStore,
} from "../../../../store/radarStore";

export function useRadarPolling():
  void {

  const refreshLive =
    useRadarStore(
      (
        state
      ) =>
        state.refreshLive
    );

  const refreshRedCards =
    useRadarStore(
      (
        state
      ) =>
        state
          .refreshRedCards
    );

  useEffect(
    () => {

      let timer:
        ReturnType<
          typeof setInterval
        > |
        null = null;

      const refreshRadar =
        () => {

          void Promise.allSettled([
            refreshLive(),
            refreshRedCards(),
          ]);
        };

      const start =
        () => {

          if (timer) {
            return;
          }

          timer =
            setInterval(
              refreshRadar,
              env
                .RADAR_REFRESH_MS
            );
        };

      const stop =
        () => {

          if (!timer) {
            return;
          }

          clearInterval(
            timer
          );

          timer =
            null;
        };

      if (
        AppState
          .currentState ===
        "active"
      ) {
        start();
      }

      const subscription =
        AppState.addEventListener(
          "change",
          (
            state
          ) => {

            if (
              state ===
              "active"
            ) {
              /*
               * Al volver a la app
               * actualizamos
               * inmediatamente.
               */
              refreshRadar();

              start();

              return;
            }

            stop();
          }
        );

      return () => {
        stop();

        subscription.remove();
      };
    },

    [
      refreshLive,
      refreshRedCards,
    ]
  );
}
