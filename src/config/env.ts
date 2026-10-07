const apiUrl =
  process.env
    .EXPO_PUBLIC_API_URL
    ?.trim();

const socketUrl =
  process.env
    .EXPO_PUBLIC_SOCKET_URL
    ?.trim();

const rawRadarRefreshMs =
  process.env
    .EXPO_PUBLIC_RADAR_REFRESH_MS
    ?.trim();

if (!apiUrl) {
  throw new Error(
    [
      "EXPO_PUBLIC_API_URL is not configured.",
      "Example:",
      "EXPO_PUBLIC_API_URL=http://192.168.0.11:8000/api/v1",
    ].join(" ")
  );
}

if (!socketUrl) {
  throw new Error(
    [
      "EXPO_PUBLIC_SOCKET_URL is not configured.",
      "Example:",
      "EXPO_PUBLIC_SOCKET_URL=http://192.168.0.11:8000",
    ].join(" ")
  );
}

const parsedRadarRefreshMs =
  Number(
    rawRadarRefreshMs ??
    "30000"
  );

const radarRefreshMs =
  Number.isFinite(
    parsedRadarRefreshMs
  ) &&
  parsedRadarRefreshMs >= 5000
    ? parsedRadarRefreshMs
    : 30000;

export const env = {
  API_BASE_URL:
    apiUrl.replace(
      /\/+$/,
      ""
    ),

  SOCKET_URL:
    socketUrl.replace(
      /\/+$/,
      ""
    ),

  RADAR_REFRESH_MS:
    radarRefreshMs,
} as const;
