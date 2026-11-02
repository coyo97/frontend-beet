
import {
  post,
} from "../api";

import {
  notificationRoutes,
} from "../routes/notificationRoutes";

import {
  getAuthToken,
} from "../../features/auth/storage/authToken";

export interface RegisterDevicePayload {
  expoPushToken: string;

  platform:
    | "android"
    | "ios";
}

export interface UnregisterDevicePayload {
  expoPushToken: string;
}

/*
 * Obtener el JWT autenticado.
 *
 * Nunca enviamos ownerId desde
 * el movil: el backend lo obtiene
 * directamente del JWT.
 */
async function getAuthenticatedHeaders():
  Promise<Record<string, string>> {

  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "NO_SESSION"
    );
  }

  return {
    Authorization:
      `Bearer ${token}`,
  };
}

/*
 * Registrar el dispositivo del
 * usuario que inicio sesion.
 */
export async function registerPushDevice(
  payload: RegisterDevicePayload
): Promise<void> {

  const headers =
    await getAuthenticatedHeaders();

  await post(
    notificationRoutes.registerDevice,
    payload,
    {
      headers,
    }
  );
}

/*
 * Desactivar el dispositivo antes
 * de cerrar sesion.
 *
 * El JWT debe seguir disponible
 * cuando ejecutamos esta peticion.
 */
export async function unregisterPushDevice(
  payload: UnregisterDevicePayload
): Promise<void> {

  const headers =
    await getAuthenticatedHeaders();

  await post(
    notificationRoutes.unregisterDevice,
    payload,
    {
      headers,
    }
  );
}

