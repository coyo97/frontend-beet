import type {
  ServerConnection,
  ServerConnectionSource,
} from "../entities/ServerConnection";

export function normalizeServerOrigin(
  value:
    string
): string {

  const raw =
    value
      .trim();

  if (!raw) {
    throw new Error(
      "La URL del servidor es obligatoria"
    );
  }

  /*
   * Permitimos pegar:
   *
   * xyz.trycloudflare.com
   *
   * o:
   *
   * https://xyz.trycloudflare.com
   */
  const candidate =
    /^https?:\/\//i.test(
      raw
    )
      ? raw
      : `https://${raw}`;

  let parsed:
    URL;

  try {
    parsed =
      new URL(
        candidate
      );
  } catch {
    throw new Error(
      "La URL del servidor no es válida"
    );
  }

  if (
    parsed.protocol !==
      "http:" &&
    parsed.protocol !==
      "https:"
  ) {
    throw new Error(
      "Solo se permiten servidores HTTP o HTTPS"
    );
  }

  /*
   * También aceptamos que el usuario
   * pegue directamente:
   *
   * https://host/api/v1
   *
   * Nosotros guardamos únicamente
   * el origen.
   */
  const path =
    parsed.pathname
      .replace(
        /\/+$/,
        ""
      );

  const allowedPath =
    path ===
      "" ||
    path ===
      "/" ||
    path ===
      "/api" ||
    path ===
      "/api/v1";

  if (!allowedPath) {
    throw new Error(
      "Usa la URL base del backend, sin rutas adicionales"
    );
  }

  return (
    `${parsed.protocol}//${parsed.host}`
  );
}

export function buildServerConnection(
  value:
    string,

  source:
    ServerConnectionSource
): ServerConnection {

  const origin =
    normalizeServerOrigin(
      value
    );

  return {
    origin,

    apiBaseUrl:
      `${origin}/api/v1`,

    socketUrl:
      origin,

    source,
  };
}
