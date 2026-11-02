
import {
  getAuthToken,
} from "../../features/auth/storage/authToken";

/*
 * Cabeceras autenticadas para
 * preferencias push individuales.
 *
 * El JWT identifica al propietario.
 * Nunca enviamos ownerId desde el móvil.
 */
export async function getPushPreferenceAuthHeaders():
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

