
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

export interface TeamMemoryPushDevice {
  id: string;

  platform:
    | "android"
    | "ios";

  enabled: boolean;
}

interface ListResponse {
  devices: TeamMemoryPushDevice[];
}

interface UpdateResponse {
  device: TeamMemoryPushDevice;
}

/*
 * GET /notifications/team-memory-preferences
 *
 * Consulta únicamente los dispositivos
 * del usuario autenticado.
 */
export async function getTeamMemoryPushPreferences():
  Promise<TeamMemoryPushDevice[]> {

  const headers =
    await getPushPreferenceAuthHeaders();

  const response =
    await get<ListResponse>(
      notificationRoutes.teamMemoryPreferences,
      {},
      { headers }
    );

  return response.devices;
}

/*
 * PATCH /notifications/team-memory-preferences
 *
 * Consentimiento independiente
 * para cada dispositivo.
 */
export async function updateTeamMemoryPushPreference(
  deviceId: string,
  enabled: boolean
): Promise<TeamMemoryPushDevice> {

  const headers =
    await getPushPreferenceAuthHeaders();

  const response =
    await patch<UpdateResponse>(
      notificationRoutes.teamMemoryPreferences,
      {
        deviceId,
        enabled,
      },
      { headers }
    );

  return response.device;
}

