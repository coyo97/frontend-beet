import {
  post,
} from "../api";

import {
  notificationRoutes,
} from "../routes/notificationRoutes";

export interface RegisterDevicePayload {
  expoPushToken:
    string;

  platform:
    "android" |
    "ios";
}

export async function registerPushDevice(
  payload:
    RegisterDevicePayload
): Promise<void> {

  await post(
    notificationRoutes
      .registerDevice,
    payload
  );
}
