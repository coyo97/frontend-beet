
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
  configureNotifications,
  hasRemotePushRegistration,
} from "@/notifications/notificationService";

import {
  styles,
} from "./UpcomingPushSettings.styles";

interface Props {
  onRegistered: () => void;
}

export function PushDeviceRegistration({
  onRegistered,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const register = async () => {

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {

      /*
       * Solicita permisos y obtiene
       * un Expo Push Token.
       *
       * POST /notifications/devices
       * utiliza el JWT actual.
       */
      await configureNotifications();

      if (!hasRemotePushRegistration()) {
        throw new Error(
          "No se completó el registro del dispositivo."
        );
      }

      setSuccess(true);

      /*
       * Actualizar las dos listas
       * de preferencias.
       */
      onRegistered();

    } catch (cause) {

      console.warn(
        "[PushDeviceRegistration]",
        cause
      );

      setError(
        "No se pudo registrar el teléfono. " +
        "Comprueba los permisos de Android, " +
        "la sesión y la conexión al backend."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Registrar este teléfono
      </Text>

      <Text style={styles.description}>
        Vincula este dispositivo a tu cuenta
        para configurar los avisos de
        próximos partidos y Team Memory.
      </Text>

      <Pressable
        accessibilityRole="button"
        disabled={loading}
        onPress={() => {
          void register();
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.retry}>
            Registrar / actualizar dispositivo
          </Text>
        )}
      </Pressable>

      {success ? (
        <Text style={styles.infoText}>
          Dispositivo registrado correctamente.
        </Text>
      ) : null}

      {error ? (
        <Text style={styles.error}>
          {error}
        </Text>
      ) : null}

    </View>
  );
}

