import {
  create,
} from "zustand";

import {
  fetchCurrentUser,
  loginUser,
  type AuthUser,
} from "../api/authService";


import {
  Alert,
} from "react-native";

import {
  getAuthToken,
  saveAuthToken,
  clearAuthToken,
} from "../storage/authToken";

type AuthStatus =
  | "starting"
  | "authenticated"
  | "anonymous"
  | "offline";

interface State {
  status:
    AuthStatus;

  user:
    AuthUser | null;

  error:
    string | null;

  bootstrap:
    () => Promise<void>;

  login:
    (
      username: string,
      password: string
    ) => Promise<void>;

  logout:
    () => Promise<void>;
}

export const useAuthStore =
  create<State>(
    (set) => ({
      status: "starting",

      user: null,

      error: null,

      bootstrap:
        async () => {
          try {
            const token =
              await getAuthToken();

            if (!token) {
              set({
                status:
                  "anonymous",

                user: null,
              });

              return;
            }

            const user =
              await fetchCurrentUser();

            set({
              status:
                "authenticated",

              user,

              error: null,
            });
          } catch (error) {
            const invalid =
              error instanceof Error &&
              (
                error.message ===
                  "INVALID_SESSION" ||
                error.message ===
                  "NO_SESSION"
              );

            if (invalid) {
              await clearAuthToken();

              set({
                status:
                  "anonymous",

                user: null,
              });

              return;
            }

            /*
             * Si el backend está apagado,
             * NO borramos el token.
             *
             * Este era uno de los problemas
             * que queríamos evitar.
             */
            set({
              status:
                "offline",

              error:
                "No se pudo conectar con el backend. La sesión se conserva.",
            });
          }
        },

      login:
        async (
          username,
          password
        ) => {
          const result =
            await loginUser(
              username,
              password
            );

          await saveAuthToken(
            result.token
          );

          set({
            status:
              "authenticated",

            user:
              result.user,

            error:
              null,
          });
        },

      
logout:
  async () => {

    let deviceUnregistered =
      false;

    /*
     * Desvincular push ANTES
     * de eliminar el JWT.
     */
    try {
      const {
        unregisterNotificationsForLogout,
      } = await import(
        "../../../notifications/notificationService"
      );

      deviceUnregistered =
        await unregisterNotificationsForLogout();

    } catch (error) {
      console.warn(
        "[Auth] push unregister failed",
        error
      );
    }

    /*
     * Cerramos la sesión local
     * incluso si el backend
     * no está disponible.
     */
    await clearAuthToken();

    set({
      status: "anonymous",

      user: null,

      error: null,
    });

    /*
     * Una desconexión del backend
     * impide garantizar que las
     * notificaciones se detuvieron.
     */
    if (!deviceUnregistered) {
      Alert.alert(
        "Notificaciones",
        "Se cerró tu sesión, pero no se pudo confirmar la desvinculación de este dispositivo. Podrías seguir recibiendo avisos hasta que el servidor vuelva a estar disponible. Si es necesario, desactiva las notificaciones de Football Radar desde los ajustes de Android."
      );
    }
  },

    })
  );
