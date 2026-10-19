import {
  useEffect,
} from "react";

import {
  getRadarSocketAsync,
  RADAR_SOCKET_EVENTS,
} from "@/async/socket/radarSocket";

import {
  serverConfigService,
} from "@/features/server-config/serverConfigModule";

import {
  useSharedMatchStore,
} from "../store/sharedMatchStore";

import type {
  SharedMatchInsight,
} from "../types/sharedMatch";

export function useSharedMatchRealtime():
  void {

  const addRealtime =
    useSharedMatchStore(
      state =>
        state.addRealtime
    );

  const load =
    useSharedMatchStore(
      state =>
        state.load
    );

  const loadGroup =
    useSharedMatchStore(
      state =>
        state.loadGroup
    );

  useEffect(
    () => {

      let cancelled =
        false;

      let cleanupSocket:
        (() => void) |
        null =
        null;

      const bindSocket =
        async () => {

          try {
            const socket =
              await getRadarSocketAsync();

            if (cancelled) {
              return;
            }

            /*
             * Si cambió el backend,
             * eliminamos listeners del
             * socket anterior.
             */
            cleanupSocket?.();

            const onSharedMatch =
              (
                payload:
                  SharedMatchInsight
              ) => {

                addRealtime(
                  payload
                );
              };

            const onConnect =
              () => {

                void loadGroup();

                void load();
              };

            socket.on(
              RADAR_SOCKET_EVENTS
                .SHARED_MATCH,
              onSharedMatch
            );

            socket.on(
              "connect",
              onConnect
            );

            cleanupSocket =
              () => {

                socket.off(
                  RADAR_SOCKET_EVENTS
                    .SHARED_MATCH,
                  onSharedMatch
                );

                socket.off(
                  "connect",
                  onConnect
                );
              };

          } catch (
            error
          ) {

            if (cancelled) {
              return;
            }

            console.warn(
              "[SharedMatch] socket bind failed",
              error
            );
          }
        };

      /*
       * Carga inicial REST.
       *
       * Si no hay sesión, el store/API
       * correspondiente decidirá qué hacer.
       */
      void loadGroup();

      void load();

      /*
       * Bind inicial.
       */
      void bindSocket();

      /*
       * Si desde Configuración cambiamos:
       *
       * abc.trycloudflare.com
       *          ↓
       * xyz.trycloudflare.com
       *
       * volvemos a enlazar Shared Match
       * con el nuevo singleton.
       */
      const unsubscribeServer =
        serverConfigService
          .subscribe(
            () => {
              void bindSocket();
            }
          );

      return () => {

        cancelled =
          true;

        unsubscribeServer();

        cleanupSocket?.();
      };
    },
    [
      addRealtime,
      load,
      loadGroup,
    ]
  );
}
