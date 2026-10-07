import React, {
  useEffect,
} from "react";

import {
  router,
  useRootNavigationState,
  useSegments,
} from "expo-router";

import {
  useAuthStore,
} from "../store/authStore";

export function AuthBootstrap() {
  const bootstrap =
    useAuthStore(
      state => state.bootstrap
    );

  const status =
    useAuthStore(
      state => state.status
    );

  const root =
    useRootNavigationState();

  const segments =
    useSegments();

  useEffect(
    () => {
      void bootstrap();
    },
    [bootstrap]
  );

  useEffect(
    () => {
      if (!root?.key) {
        return;
      }

      if (
        status === "starting" ||
        status === "offline"
      ) {
        return;
      }

      const first =
        segments[0] as string | undefined;

      const onAuthScreen =
        first === "login" ||
        first === "register";

      if (
        status === "anonymous" &&
        !onAuthScreen
      ) {
        router.replace(
          "/login"
        );
      }

      if (
        status === "authenticated" &&
        onAuthScreen
      ) {
        router.replace(
          "/"
        );
      }
    },
    [
      root?.key,
      segments,
      status,
    ]
  );

  return null;
}
