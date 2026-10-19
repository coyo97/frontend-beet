import {
  io,
  type Socket,
} from "socket.io-client";

import {
  serverConfigService,
} from "@/features/server-config/serverConfigModule";

import {
  getAuthToken,
} from "@/features/auth/storage/authToken";

import type {
  WatchlistAlertEnvelope,
} from "../../types/watchlist";

import type {
  RadarSocketEnvelope,
  RedCardDetectedSocketEnvelope,
} from "../../types/radar";

export const RADAR_SOCKET_EVENTS = {
  RED_CARD_PRESSURE:
    "radar:red-card-pressure",

  RED_CARD_DETECTED:
    "radar:red-card-detected",

  WATCHLIST_ALERT:
    "watchlist:alert",

  SHARED_MATCH:
    "sharing:match",
} as const;

interface RadarSocketHandlers {
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

let socket:
  Socket |
  null =
  null;

let socketUrl:
  string |
  null =
  null;

/*
 * ========================================
 * SOCKET FACTORY
 * ========================================
 *
 * La URL YA NO viene directamente
 * de env.SOCKET_URL.
 *
 * ServerConfigService decide:
 *
 * override runtime
 *        ↓
 * servidor predeterminado
 */
async function ensureRadarSocket():
  Promise<
    Socket
  > {

  const nextUrl =
    await serverConfigService
      .getSocketUrl();

  /*
   * Mismo backend:
   * reutilizamos el singleton.
   */
  if (
    socket &&
    socketUrl ===
      nextUrl
  ) {
    return socket;
  }

  /*
   * Cambió Cloudflare / backend.
   *
   * Cerramos el socket anterior.
   */
  if (socket) {
    socket.disconnect();

    socket.auth =
      {};
  }

  socketUrl =
    nextUrl;

  socket =
    io(
      nextUrl,
      {
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

export async function getRadarSocketAsync():
  Promise<
    Socket
  > {

  return ensureRadarSocket();
}


/*
 * Se conserva para cualquier código
 * existente que quiera consultar
 * el singleton.
 */
export function getRadarSocket():
  Socket {

  if (!socket) {
    throw new Error(
      "Radar socket has not been initialized"
    );
  }

  return socket;
}

export function connectRadarSocket(
  handlers:
    RadarSocketHandlers
): () => void {

  let cancelled =
    false;

  let activeSocket:
    Socket |
    null =
    null;

  /*
   * Evita carreras si cambia el
   * servidor mientras SecureStore
   * todavía está leyendo el JWT.
   */
  let generation =
    0;

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

  const detach =
    (
      target:
        Socket
    ) => {

      target.off(
        "connect",
        onConnect
      );

      target.off(
        "disconnect",
        onDisconnect
      );

      target.off(
        "connect_error",
        onError
      );

      target.off(
        RADAR_SOCKET_EVENTS
          .RED_CARD_PRESSURE,
        onSignal
      );

      target.off(
        RADAR_SOCKET_EVENTS
          .RED_CARD_DETECTED,
        onRedCardDetected
      );

      target.off(
        RADAR_SOCKET_EVENTS
          .WATCHLIST_ALERT,
        onWatchlistAlert
      );
    };

  const attach =
    (
      target:
        Socket
    ) => {

      target.on(
        "connect",
        onConnect
      );

      target.on(
        "disconnect",
        onDisconnect
      );

      target.on(
        "connect_error",
        onError
      );

      target.on(
        RADAR_SOCKET_EVENTS
          .RED_CARD_PRESSURE,
        onSignal
      );

      target.on(
        RADAR_SOCKET_EVENTS
          .RED_CARD_DETECTED,
        onRedCardDetected
      );

      target.on(
        RADAR_SOCKET_EVENTS
          .WATCHLIST_ALERT,
        onWatchlistAlert
      );
    };

  const connect =
    async () => {

      const currentGeneration =
        ++generation;

      try {
        const [
          radarSocket,
          token,
        ] =
          await Promise.all([
            ensureRadarSocket(),
            getAuthToken(),
          ]);

        if (
          cancelled ||
          currentGeneration !==
            generation
        ) {
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
         * Evita listeners duplicados.
         */
        if (
          activeSocket
        ) {
          detach(
            activeSocket
          );
        }

        activeSocket =
          radarSocket;

        attach(
          radarSocket
        );

        radarSocket.auth = {
          token,
        };

        if (
          !radarSocket
            .connected
        ) {
          radarSocket
            .connect();
        }

      } catch (
        error
      ) {

        if (cancelled) {
          return;
        }

        handlers
          .onError?.(
            error instanceof
              Error
              ? error.message
              : "No se pudo conectar el Socket"
          );
      }
    };

  /*
   * ========================================
   * CAMBIO DE SERVIDOR EN RUNTIME
   * ========================================
   *
   * Usuario:
   *
   * Cloudflare viejo
   *        ↓
   * pega nuevo Cloudflare
   *        ↓
   * Guardar
   *
   * ServerConfigService emite cambio.
   *
   * Socket:
   * disconnect viejo
   *        ↓
   * obtiene nueva URL
   *        ↓
   * reconecta
   */
  const unsubscribeServerConfig =
    serverConfigService
      .subscribe(
        () => {

          generation +=
            1;

          if (
            activeSocket
          ) {
            detach(
              activeSocket
            );

            activeSocket
              .disconnect();

            activeSocket.auth =
              {};

            activeSocket =
              null;
          }

          void connect();
        }
      );

  void connect();

  return () => {

    cancelled =
      true;

    generation +=
      1;

    unsubscribeServerConfig();

    if (
      activeSocket
    ) {
      detach(
        activeSocket
      );

      activeSocket =
        null;
    }
  };
}

export function disconnectRadarSocket():
  void {

  if (!socket) {
    return;
  }

  socket.disconnect();

  socket.auth =
    {};
}
