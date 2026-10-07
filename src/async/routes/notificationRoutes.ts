import {
  env,
} from "../../config/env";

const BASE =
  `${env.API_BASE_URL}/notifications`;

export const notificationRoutes = {
  registerDevice:
    `${BASE}/devices`,
  preferences:
  `${BASE}/preferences`,
} as const;
