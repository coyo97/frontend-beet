
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

export type TeamMemoryCooldown =
  | 0
  | 15
  | 30
  | 60
  | 120;

export interface TeamMemoryVolumeStatus {
  dailyLimit: number;
  cooldownMinutes: TeamMemoryCooldown;

  used: number;
  remaining: number;

  nextAllowedAt: string | null;
  dayTimezone: "UTC";
}

export interface UpdateTeamMemoryVolumeInput {
  dailyLimit: number;
  cooldownMinutes: TeamMemoryCooldown;
}

async function authenticatedHeaders():
  Promise<Record<string, string>> {

  const token =
    await getAuthToken();

  if (!token) {
    throw new Error("NO_SESSION");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

/*
 * Obtener configuración y consumo.
 */
export async function getTeamMemoryVolume():
  Promise<TeamMemoryVolumeStatus> {

  const headers =
    await authenticatedHeaders();

  return get<TeamMemoryVolumeStatus>(
    notificationRoutes.teamMemoryVolume,
    {},
    { headers }
  );
}

/*
 * Guardar los dos valores juntos.
 */
export async function updateTeamMemoryVolume(
  input: UpdateTeamMemoryVolumeInput
): Promise<TeamMemoryVolumeStatus> {

  const validLimit =
    Number.isInteger(input.dailyLimit) &&
    input.dailyLimit >= 1 &&
    input.dailyLimit <= 20;

  const validCooldown =
    [0, 15, 30, 60, 120].includes(
      input.cooldownMinutes
    );

  if (!validLimit || !validCooldown) {
    throw new Error(
      "Configuración de volumen inválida"
    );
  }

  const headers =
    await authenticatedHeaders();

  return patch<TeamMemoryVolumeStatus>(
    notificationRoutes.teamMemoryVolume,
    input,
    { headers }
  );
}

