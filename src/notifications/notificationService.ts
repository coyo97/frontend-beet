import {
  Platform,
} from "react-native";

import Constants
  from "expo-constants";

import {
  registerPushDevice,
} from "../async/services/pushDeviceService";

import * as SecureStore
  from "expo-secure-store";

import {
  unregisterPushDevice,
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

/*
 * Token Expo del dispositivo.
 * No es el JWT de autenticación.
 */
const PUSH_TOKEN_STORAGE_KEY =
  "football_radar_expo_push_token";

let lastExpoPushToken:
  string | null = null;

/*
 * Permite esperar un registro
 * que todavía esté ejecutándose.
 */
let registrationInFlight:
  Promise<void> | null = null;

let notificationHandlerConfigured =
  false;

function isExpoGo(): boolean {
  return (
    Constants.executionEnvironment ===
    "storeClient"
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

async function configureNotificationsInternal():
  Promise<void> {

  /*
   * Cada intento debe confirmar
   * nuevamente el registro.
   */
  remotePushRegistered = false;

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

    /*
   * ========================================
   * ACCIONES INTERACTIVAS
   * TARJETAS ROJAS
   * ========================================
   */
  try {
    await Notifications
      .setNotificationCategoryAsync(
        "radar_red_card",
        [
          {
            identifier: "OPEN_MATCH",

            buttonTitle: "Ver partido",

            options: {
              opensAppToForeground: true,
            },
          },
          {
            identifier: "COPY_MATCH",

            buttonTitle: "Copiar partido",

            options: {
              opensAppToForeground: true,
            },
          },
        ]
      );

    console.log(
      "[Notifications] red-card actions registered"
    );

  } catch (error) {
    console.warn(
      "[Notifications] could not register actions",
      error
    );
  }

  /*
   * ========================================
   * PERMISOS DE NOTIFICACIONES
   * ========================================
   */

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

/*
 * Guardamos el token para
 * poder desvincularlo incluso
 * después de reiniciar la APK.
 */
lastExpoPushToken =
  result.data;

try {
  await SecureStore.setItemAsync(
    PUSH_TOKEN_STORAGE_KEY,
    result.data
  );
} catch (error) {
  console.warn(
    "[Notifications] no se pudo guardar el token localmente",
    error
  );
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


/*
 * Evita registros simultáneos.
 *
 * El logout podrá esperar a que
 * termine la configuración push.
 */
export async function configureNotifications():
  Promise<void> {

  if (registrationInFlight) {
    return registrationInFlight;
  }

  const task =
    configureNotificationsInternal();

  registrationInFlight = task;

  try {
    await task;
  } finally {
    if (
      registrationInFlight === task
    ) {
      registrationInFlight = null;
    }
  }
}

/*
 * Desvincular el dispositivo
 * antes de eliminar el JWT.
 *
 * Devuelve false si no pudimos
 * confirmar la desvinculación.
 */
export async function unregisterNotificationsForLogout():
  Promise<boolean> {

  /*
   * Si el registro comenzó antes
   * del logout, esperamos su final.
   */
  if (registrationInFlight) {
    try {
      await registrationInFlight;
    } catch (error) {
      console.warn(
        "[Notifications] registro pendiente falló",
        error
      );
    }
  }

  const wasRegistered =
    remotePushRegistered;

  remotePushRegistered = false;

  let expoPushToken =
    lastExpoPushToken;

  if (!expoPushToken) {
    try {
      expoPushToken =
        await SecureStore.getItemAsync(
          PUSH_TOKEN_STORAGE_KEY
        );
    } catch (error) {
      console.warn(
        "[Notifications] no se pudo recuperar el token",
        error
      );
    }
  }

  if (!expoPushToken) {
    /*
     * No hay un token conocido
     * para enviar al servidor.
     */
    return !wasRegistered;
  }

  try {
    /*
     * Esta petición utiliza el
     * JWT que todavía está guardado.
     */
    await unregisterPushDevice({
      expoPushToken,
    });

    lastExpoPushToken = null;

    try {
      await SecureStore.deleteItemAsync(
        PUSH_TOKEN_STORAGE_KEY
      );
    } catch (error) {
      console.warn(
        "[Notifications] no se pudo limpiar el token local",
        error
      );
    }

    console.log(
      "[Notifications] dispositivo desvinculado"
    );

    return true;

  } catch (error) {
    console.warn(
      "[Notifications] desvinculación fallida",
      error
    );

    return false;
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
