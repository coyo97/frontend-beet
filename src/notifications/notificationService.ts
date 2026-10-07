import {
  Platform,
} from "react-native";

import Constants
  from "expo-constants";

import {
  registerPushDevice,
} from "../async/services/pushDeviceService";

import type {
  WatchlistAlertEnvelope,
} from "../types/watchlist";

/*
 * No importamos expo-notifications
 * estáticamente.
 *
 * En Expo Go Android SDK >= 53
 * ese import puede lanzar el error
 * antes de ejecutar nuestro código.
 */

let remotePushRegistered =
  false;

let notificationHandlerConfigured =
  false;

function isExpoGo():
  boolean {

  return (
    Constants.expoGoConfig !==
    null
  );
}

async function loadNotifications() {

  /*
   * Mientras estemos dentro de
   * Expo Go en Android no cargamos
   * expo-notifications.
   *
   * Seguimos usando:
   * - Socket.IO
   * - banner interno
   * - Alert Center
   */

  if (
    Platform.OS ===
      "android" &&
    isExpoGo()
  ) {
    return null;
  }

  return await import(
    "expo-notifications"
  );
}

export async function configureNotifications():
  Promise<void> {

  const Notifications =
    await loadNotifications();

  if (!Notifications) {
    console.log(
      "[Notifications] Expo Go detected; remote notifications disabled"
    );

    return;
  }

  if (
    !notificationHandlerConfigured
  ) {
    Notifications
      .setNotificationHandler({
        handleNotification:
          async () => ({
            shouldShowBanner:
              true,

            shouldShowList:
              true,

            shouldPlaySound:
              true,

            shouldSetBadge:
              false,
          }),
      });

    notificationHandlerConfigured =
      true;
  }

  if (
    Platform.OS ===
    "android"
  ) {
    await Notifications
      .setNotificationChannelAsync(
        "radar-alerts",
        {
          name:
            "Football Radar Alerts",

          importance:
            Notifications
              .AndroidImportance
              .MAX,

          vibrationPattern: [
            0,
            250,
            150,
            250,
          ],

          sound:
            "default",
        }
      );
  }

  const current =
    await Notifications
      .getPermissionsAsync();

  let status =
    current.status;

  if (
    status !==
    "granted"
  ) {
    const result =
      await Notifications
        .requestPermissionsAsync();

    status =
      result.status;
  }

  if (
    status !==
    "granted"
  ) {
    console.warn(
      "[Notifications] permission denied"
    );

    return;
  }

  try {
    const projectId =
      Constants
        .expoConfig
        ?.extra
        ?.eas
        ?.projectId ??
      Constants
        .easConfig
        ?.projectId;

    if (!projectId) {
      console.warn(
        "[Notifications] projectId unavailable"
      );

      return;
    }

    const result =
      await Notifications
        .getExpoPushTokenAsync({
          projectId,
        });

    if (
      Platform.OS !==
        "android" &&
      Platform.OS !==
        "ios"
    ) {
      return;
    }

    await registerPushDevice({
      expoPushToken:
        result.data,

      platform:
        Platform.OS,
    });

    remotePushRegistered =
      true;

    console.log(
      "[Notifications] push registered"
    );
  } catch (error) {
    console.warn(
      "[Notifications] push registration failed",
      error
    );
  }
}

export function hasRemotePushRegistration():
  boolean {

  return remotePushRegistered;
}

export async function showWatchlistNotification(
  payload:
    WatchlistAlertEnvelope
): Promise<void> {

  const Notifications =
    await loadNotifications();

  if (!Notifications) {
    /*
     * En Expo Go ya tenemos
     * banner + Alert Center.
     */
    return;
  }

  const match =
    payload.signal.match;

  const source =
    match.sources.find(
      (
        item
      ) =>
        item.provider ===
        "flashscore"
    ) ??
    match.sources[0];

  await Notifications
    .scheduleNotificationAsync({
      content: {
        title:
          "⭐ Football Radar",

        body:
          `🔴 ${match.home.name} ${match.home.goals ?? "-"}-${match.away.goals ?? "-"} ${match.away.name} · presión ${payload.signal.strength}`,

        sound:
          "default",

        data: {
          type:
            "WATCHLIST_ALERT",

          provider:
            source?.provider ??
            null,

          externalId:
            source?.externalId ??
            null,
        },
      },

      trigger:
        null,
    });
}
export async function showTestNotification():
  Promise<void> {

  const Notifications =
    await loadNotifications();

  if (!Notifications) {
    console.warn(
      "[Notifications] módulo no disponible"
    );

    return;
  }

  await Notifications
    .scheduleNotificationAsync({
      content: {
        title:
          "⚽ Football Radar",

        body:
          "Notificación local funcionando correctamente.",

        sound:
          "default",

        data: {
          type:
            "OPEN_ALERTS",
        },
      },

      trigger:
        null,
    });
}
