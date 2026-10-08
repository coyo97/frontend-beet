import {
  io,
  type Socket,
} from "socket.io-client";

import {
  env,
} from "../../config/env";

import type {
  WatchlistAlertEnvelope,
} from "../../types/watchlist";

import {
  getAuthToken,
} from "@/features/auth/storage/authToken";

import type {
  RadarSocketEnvelope,
  RedCardDetectedSocketEnvelope,
} from "../../types/radar";

/*
 * ========================================
 * SOCKET EVENTS
 * ========================================
 */

export const RADAR_SOCKET_EVENTS = {
  RED_CARD_PRESSURE:
    "radar:red-card-pressure",

  RED_CARD_DETECTED:
    "radar:red-card-detected",

  WATCHLIST_ALERT:
    "watchlist:alert",

  /*
   * Partido compartido entre
   * miembros del grupo privado.
   *
   * Todavía no lo escuchamos aquí.
   * Lo conectaremos con el store
   * de compartidos en el siguiente paso.
   */
  SHARED_MATCH:
    "sharing:match",

} as const;

/*
 * ========================================
 * SOCKET SINGLETON
 * ========================================
 */

let socket:
  Socket | null = null;

export function getRadarSocket():
  Socket {

  if (socket) {
    return socket;
  }

  socket =
    io(
      env.SOCKET_URL,
      {
        /*
         * MUY IMPORTANTE:
         *
         * No conectamos inmediatamente.
         *
         * Primero necesitamos leer
         * el JWT desde SecureStore.
         */
        autoConnect:
          false,

        transports: [
          "websocket",
          "polling",
        ],

        reconnection:
          true,

        reconnectionAttempts:
          Infinity,

        reconnectionDelay:
          1000,
      }
    );

  return socket;
}

/*
 * ========================================
 * CONNECT
 * ========================================
 */

export function connectRadarSocket(
  handlers: {
    onConnect?:
      () => void;

    onDisconnect?:
      () => void;

    onSignal?:
      (
        payload:
          RadarSocketEnvelope
      ) => void;

    onRedCardDetected?:
      (
        payload:
          RedCardDetectedSocketEnvelope
      ) => void;

    onWatchlistAlert?:
      (
        payload:
          WatchlistAlertEnvelope
      ) => void;

    onError?:
      (
        message:
          string
      ) => void;
  }
): () => void {

  const radarSocket =
    getRadarSocket();

  /*
   * Si el componente se desmonta mientras
   * SecureStore está leyendo el token,
   * evitamos conectar el socket después.
   */
  let cancelled =
    false;

  /*
   * ========================================
   * EVENT HANDLERS
   * ========================================
   */

  const onConnect =
    () => {

      handlers
        .onConnect?.();
    };

  const onDisconnect =
    () => {

      handlers
        .onDisconnect?.();
    };

  const onError =
    (
      error:
        Error
    ) => {

      handlers
        .onError?.(
          error.message
        );
    };

  const onSignal =
    (
      payload:
        RadarSocketEnvelope
    ) => {

      handlers
        .onSignal?.(
          payload
        );
    };

  const onRedCardDetected =
    (
      payload:
        RedCardDetectedSocketEnvelope
    ) => {

      handlers
        .onRedCardDetected?.(
          payload
        );
    };

  const onWatchlistAlert =
    (
      payload:
        WatchlistAlertEnvelope
    ) => {

      handlers
        .onWatchlistAlert?.(
          payload
        );
    };

  /*
   * ========================================
   * REGISTER LISTENERS
   * ========================================
   */

  radarSocket.on(
    "connect",
    onConnect
  );

  radarSocket.on(
    "disconnect",
    onDisconnect
  );

  radarSocket.on(
    "connect_error",
    onError
  );

  radarSocket.on(
    RADAR_SOCKET_EVENTS
      .RED_CARD_PRESSURE,

    onSignal
  );

  radarSocket.on(
    RADAR_SOCKET_EVENTS
      .RED_CARD_DETECTED,

    onRedCardDetected
  );

  radarSocket.on(
    RADAR_SOCKET_EVENTS
      .WATCHLIST_ALERT,

    onWatchlistAlert
  );

  /*
   * ========================================
   * AUTHENTICATED CONNECTION
   * ========================================
   *
   * SecureStore es asíncrono.
   *
   * Por eso:
   *
   * 1. obtenemos JWT
   * 2. lo agregamos a handshake.auth
   * 3. recién conectamos Socket.IO
   *
   * Backend recibirá:
   *
   * socket.handshake.auth.token
   */

  void (
    async () => {
      try {
        const token =
          await getAuthToken();

        if (cancelled) {
          return;
        }

        if (!token) {
          handlers
            .onError?.(
              "Sesión requerida para Socket"
            );

          return;
        }

        /*
         * IMPORTANTE:
         *
         * Nunca mandamos userId desde
         * el móvil.
         *
         * Solo mandamos JWT.
         *
         * El backend obtiene el userId
         * verificando el token.
         */
        radarSocket.auth = {
          token,
        };

        if (
          !radarSocket.connected
        ) {
          radarSocket.connect();
        }
      } catch (
        error
      ) {
        if (cancelled) {
          return;
        }

        handlers
          .onError?.(
            error instanceof Error
              ? error.message
              : "No se pudo autenticar el Socket"
          );
      }
    }
  )();

  /*
   * ========================================
   * CLEANUP
   * ========================================
   */

  return () => {

    cancelled =
      true;

    radarSocket.off(
      "connect",
      onConnect
    );

    radarSocket.off(
      "disconnect",
      onDisconnect
    );

    radarSocket.off(
      "connect_error",
      onError
    );

    radarSocket.off(
      RADAR_SOCKET_EVENTS
        .RED_CARD_PRESSURE,

      onSignal
    );

    radarSocket.off(
      RADAR_SOCKET_EVENTS
        .RED_CARD_DETECTED,

      onRedCardDetected
    );

    radarSocket.off(
      RADAR_SOCKET_EVENTS
        .WATCHLIST_ALERT,

      onWatchlistAlert
    );
  };
}

/*
 * ========================================
 * EXPLICIT DISCONNECT
 * ========================================
 *
 * Lo utilizaremos al cerrar sesión.
 *
 * De esa forma un usuario que hace logout
 * no deja un socket autenticado abierto.
 */

export function disconnectRadarSocket():
  void {

  if (!socket) {
    return;
  }

  socket.disconnect();

  /*
   * Eliminamos también el token que
   * Socket.IO conservaba en memoria.
   */
  socket.auth = {};
}
