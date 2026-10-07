import {
  get,
  patch,
} from "../api";

import {
  notificationRoutes,
} from "../routes/notificationRoutes";

import type {
  PushPreferences,
  PushPreferencesResponse,
  UpdatePushPreferencesInput,
} from "../../types/notifications";

export async function getNotificationPreferences():
  Promise<PushPreferences> {

  const response =
    await get<
      PushPreferencesResponse
    >(
      notificationRoutes
        .preferences
    );

  return response.preferences;
}

export async function updateNotificationPreferences(
  input:
    UpdatePushPreferencesInput
): Promise<PushPreferences> {

  const response =
    await patch<
      PushPreferencesResponse
    >(
      notificationRoutes
        .preferences,
      input
    );

  return response.preferences;
}
