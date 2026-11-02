
import {
  get,
  patch,
} from "../api";

import {
  notificationRoutes,
} from "../routes/notificationRoutes";

import {
  getAuthToken,
} from "../../features/auth/storage/authToken";

import type {
  PushPreferences,
  PushPreferencesResponse,
  UpdatePushPreferencesInput,
} from "../../types/notifications";

/*
 * Las preferencias pertenecen
 * al usuario autenticado.
 *
 * El backend obtiene ownerId
 * directamente del JWT.
 */
async function authenticatedOptions() {
  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "NO_SESSION"
    );
  }

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
}

/*
 * Obtener las preferencias
 * del usuario actual.
 */
export async function getNotificationPreferences():
  Promise<PushPreferences> {

  const response =
    await get<
      PushPreferencesResponse
    >(
      notificationRoutes.preferences,
      {},
      await authenticatedOptions()
    );

  return response.preferences;
}

/*
 * Actualizar las preferencias
 * del usuario actual.
 */
export async function updateNotificationPreferences(
  input: UpdatePushPreferencesInput
): Promise<PushPreferences> {

  const response =
    await patch<
      PushPreferencesResponse
    >(
      notificationRoutes.preferences,
      input,
      await authenticatedOptions()
    );

  return response.preferences;
}

