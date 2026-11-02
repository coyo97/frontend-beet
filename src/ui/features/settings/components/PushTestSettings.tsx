
import React, {
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  sendMyTestPush,
} from "@/async/services/testPushService";

import {
  styles,
} from "./PushTestSettings.styles";

export function PushTestSettings() {

  const [sending, setSending] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const send = async () => {
    if (sending) {
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const result =
        await sendMyTestPush();

      const accepted =
        result.results.filter(
          item => item.status === "ok"
        ).length;

      const rejected =
        result.results.length - accepted;

      setMessage(
        [
          `Dispositivos: ${result.devices}`,
          `Aceptados por Expo: ${accepted}`,
          `No aceptados: ${rejected}`,
        ].join("\n")
      );

    } catch (error) {
      setMessage(
        error instanceof Error &&
        error.message === "NO_SESSION"
          ? "Debes iniciar sesión."
          : "No se pudo enviar la prueba."
      );

    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Probar notificaciones remotas
      </Text>

      <Text style={styles.description}>
        Envía una notificación real
        a los teléfonos registrados
        en tu cuenta.
      </Text>

      <Pressable
        accessibilityRole="button"
        disabled={sending}
        onPress={() => {
          void send();
        }}
        style={[
          styles.button,
          sending && styles.disabled,
        ]}
      >
        {sending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            Enviar notificación de prueba
          </Text>
        )}
      </Pressable>

      {message ? (
        <Text style={styles.result}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

