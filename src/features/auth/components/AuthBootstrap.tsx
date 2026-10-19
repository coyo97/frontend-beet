import React, {
  useEffect,
} from "react";

import {
  router,
  usePathname,
  useRootNavigationState,
} from "expo-router";

import {
  useAuthStore,
} from "../store/authStore";

export function AuthBootstrap() {

  const bootstrap =
    useAuthStore(
      state =>
        state.bootstrap
    );

  const status =
    useAuthStore(
      state =>
        state.status
    );

  const root =
    useRootNavigationState();

  const pathname =
    usePathname();

  useEffect(
    () => {
      void bootstrap();
    },
    [
      bootstrap,
    ]
  );

  useEffect(
    () => {

      if (!root?.key) {
        return;
      }

      if (
        status ===
          "starting"
      ) {
        return;
      }

      /*
       * Login y registro son pantallas
       * de entrada de autenticación.
       */
      const onAuthEntry =
        pathname ===
          "/login" ||
        pathname ===
          "/register";

      /*
       * Server Settings también es
       * pública.
       *
       * Esto es fundamental:
       * si el backend cambió,
       * necesitamos poder corregirlo
       * ANTES de iniciar sesión.
       */
      const onServerSettings =
        pathname ===
          "/server-settings";

      const onPublicScreen =
        onAuthEntry ||
        onServerSettings;

      /*
       * Sin sesión:
       *
       * solamente dejamos entrar a
       * Login / Register / Server Settings.
       */
      if (
        status ===
          "anonymous" &&
        !onPublicScreen
      ) {
        router.replace(
          "/login"
        );

        return;
      }

      /*
       * Backend caído / URL antigua.
       *
       * Conservamos el token, pero
       * mandamos al usuario a Login
       * para que tenga acceso al botón
       * "Configurar servidor".
       */
      if (
        status ===
          "offline" &&
        !onPublicScreen
      ) {
        router.replace(
          "/login"
        );

        return;
      }

      /*
       * Si ya estamos autenticados,
       * no necesitamos volver a Login
       * o Register.
       *
       * OJO:
       * server-settings NO entra aquí.
       * Un usuario autenticado también
       * debe poder configurarlo.
       */
      if (
        status ===
          "authenticated" &&
        onAuthEntry
      ) {
        router.replace(
          "/"
        );
      }

    },
    [
      root?.key,
      pathname,
      status,
    ]
  );

  return null;
}
