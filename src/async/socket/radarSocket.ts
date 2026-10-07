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
} as const;

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

  if (
    !radarSocket.connected
  ) {

    radarSocket.connect();
  }

  return () => {

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
