
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

import {
  configureNotifications,
} from "../../../notifications/notificationService";

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

  /*
   * Restaurar la sesion.
   */
  useEffect(
    () => {
      void bootstrap();
    },
    [
      bootstrap,
    ]
  );

  /*
   * Registrar notificaciones solamente
   * despues de autenticar al usuario.
   *
   * Evitamos registrar dispositivos
   * antes de recuperar la sesion.
   */
  useEffect(
    () => {

      if (
        status !==
        "authenticated"
      ) {
        return;
      }

      void configureNotifications()
        .catch(
          error => {
            console.warn(
              "[Notifications] initialization failed",
              error
            );
          }
        );

    },
    [
      status,
    ]
  );

  /*
   * Control de navegacion
   * segun el estado de autenticacion.
   */
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

      const onAuthEntry =
        pathname ===
          "/login" ||
        pathname ===
          "/register";

      const onServerSettings =
        pathname ===
          "/server-settings";

      const onPublicScreen =
        onAuthEntry ||
        onServerSettings;

      /*
       * Usuario sin sesion.
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
       * Servidor no disponible.
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
       * Usuario autenticado.
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

