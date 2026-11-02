
const BASE =
  "/notifications";

export const notificationRoutes = {
  /*
   * Registrar el dispositivo
   * del usuario autenticado.
   */
  registerDevice:
    `${BASE}/devices`,

  /*
   * Desvincular el dispositivo
   * al cerrar sesión.
   */
  unregisterDevice:
    `${BASE}/devices/unregister`,

testPush:
  `${BASE}/test`,

  /*
   * Consultar y actualizar
   * preferencias individuales.
   */
  preferences:
    `${BASE}/preferences`,

  upcomingPreferences:
  `${BASE}/upcoming-preferences`,

  teamMemoryPreferences:
  `${BASE}/team-memory-preferences`,

  upcomingDailyLimit:
  `${BASE}/upcoming-daily-limit`,

  teamMemoryVolume:
  `${BASE}/team-memory-volume`,

} as const;

