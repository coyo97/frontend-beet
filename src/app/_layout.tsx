import React, {
  useEffect,
} from "react";

import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from "expo-router";

import {
  useColorScheme,
} from "react-native";

import {
  configureNotifications,
} from "../notifications/notificationService";

import {
  AuthBootstrap,
} from "@/features/auth/components/AuthBootstrap";

import {
  useNotificationNavigation,
} from "../notifications/useNotificationNavigation";

export default function RootLayout() {
  const colorScheme =
    useColorScheme();

  useNotificationNavigation();

  useEffect(
    () => {
      void configureNotifications();
    },
    []
  );

  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
		<AuthBootstrap />
    </ThemeProvider>
  );
}
