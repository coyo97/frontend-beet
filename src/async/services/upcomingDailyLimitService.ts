
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

export interface UpcomingDailyLimit {
  dailyLimit: number;
  used: number;
  remaining: number;
  dayTimezone: string;
}

/*
 * Obtener los encabezados autenticados.
 *
 * El usuario se identifica mediante
 * su JWT, nunca mediante ownerId
 * enviado desde la aplicación.
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
 * GET /notifications/upcoming-daily-limit
 *
 * Consultar el límite y el consumo
 * del usuario autenticado.
 */
export async function getUpcomingDailyLimit():
  Promise<UpcomingDailyLimit> {

  const headers =
    await getAuthenticatedHeaders();

  return get<UpcomingDailyLimit>(
    notificationRoutes.upcomingDailyLimit,
    {},
    {
      headers,
    }
  );
}

/*
 * PATCH /notifications/upcoming-daily-limit
 *
 * Guardar el límite diario.
 */
export async function updateUpcomingDailyLimit(
  dailyLimit: number
): Promise<UpcomingDailyLimit> {

  if (
    !Number.isInteger(dailyLimit) ||
    dailyLimit < 1 ||
    dailyLimit > 20
  ) {
    throw new Error(
      "El límite debe estar entre 1 y 20"
    );
  }

  const headers =
    await getAuthenticatedHeaders();

  return patch<UpcomingDailyLimit>(
    notificationRoutes.upcomingDailyLimit,
    {
      dailyLimit,
    },
    {
      headers,
    }
  );
}

