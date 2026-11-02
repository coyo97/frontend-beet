
import {
  get,
  patch,
} from "../api";

import {
  notificationRoutes,
} from "../routes/notificationRoutes";

import {
  getPushPreferenceAuthHeaders,
} from "./pushPreferenceAuthHeaders";

export interface UpcomingPushDevice {
  id: string;
  platform: "android" | "ios";
  enabled: boolean;
}

interface UpcomingPreferencesResponse {
  devices: UpcomingPushDevice[];
}

interface UpdateUpcomingPreferenceResponse {
  device: UpcomingPushDevice;
}

/*
 * GET /notifications/upcoming-preferences
 *
 * Incluye el JWT del usuario autenticado.
 */
export async function getUpcomingPushPreferences():
  Promise<UpcomingPushDevice[]> {

  const headers =
    await getPushPreferenceAuthHeaders();

  const response =
    await get<UpcomingPreferencesResponse>(
      notificationRoutes.upcomingPreferences,
      {},
      { headers }
    );

  return response.devices;
}

/*
 * PATCH /notifications/upcoming-preferences
 *
 * El backend verifica que deviceId
 * pertenezca al propietario del JWT.
 */
export async function updateUpcomingPushPreference(
  deviceId: string,
  enabled: boolean
): Promise<UpcomingPushDevice> {

  const headers =
    await getPushPreferenceAuthHeaders();

  const response =
    await patch<UpdateUpcomingPreferenceResponse>(
      notificationRoutes.upcomingPreferences,
      {
        deviceId,
        enabled,
      },
      { headers }
    );

  return response.device;
}

