const BASE =
  "/notifications";

export const notificationRoutes = {
  registerDevice:
    `${BASE}/devices`,

  preferences:
    `${BASE}/preferences`,
} as const;
