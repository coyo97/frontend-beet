import {
  useEffect,
} from "react";

import {
  getRadarSocket,
  RADAR_SOCKET_EVENTS,
} from "@/async/socket/radarSocket";

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
      const socket =
        getRadarSocket();

      /*
       * ========================================
       * REALTIME SHARED MATCH
       * ========================================
       */

      const onSharedMatch =
        (
          payload:
            SharedMatchInsight
        ) => {

          console.log(
            "[SharedMatch] realtime",
            payload
              .createdByUser
              .username,
            payload
              .match
              .homeName,
            "vs",
            payload
              .match
              .awayName
          );

          addRealtime(
            payload
          );
        };

      /*
       * ========================================
       * SOCKET RECONNECTED
       * ========================================
       *
       * Cuando recuperamos conexión:
       *
       * 1. actualizamos el grupo;
       * 2. recuperamos compartidos desde Mongo.
       *
       * Así no perdemos eventos ocurridos
       * mientras el móvil estuvo desconectado.
       */

      const onConnect =
        () => {
          void loadGroup();

          void load();
        };

      /*
       * ========================================
       * SOCKET LISTENERS
       * ========================================
       */

      socket.on(
        RADAR_SOCKET_EVENTS
          .SHARED_MATCH,
        onSharedMatch
      );

      socket.on(
        "connect",
        onConnect
      );

      /*
       * ========================================
       * INITIAL LOAD
       * ========================================
       *
       * También cargamos inmediatamente,
       * porque es posible que el socket
       * ya estuviera conectado antes de
       * montar este hook.
       */

      void loadGroup();

      void load();

      /*
       * ========================================
       * CLEANUP
       * ========================================
       */

      return () => {
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
    },
    [
      addRealtime,
      load,
      loadGroup,
    ]
  );
}
