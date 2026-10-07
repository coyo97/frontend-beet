import {
  create,
} from "zustand";

import {
  fetchCurrentUser,
  loginUser,
  type AuthUser,
} from "../api/authService";

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
          await clearAuthToken();

          set({
            status:
              "anonymous",

            user:
              null,

            error:
              null,
          });
        },
    })
  );
