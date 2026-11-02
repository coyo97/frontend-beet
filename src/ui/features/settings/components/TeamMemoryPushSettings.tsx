
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";

import {
  getTeamMemoryPushPreferences,
  updateTeamMemoryPushPreference,
  type TeamMemoryPushDevice,
} from "@/async/services/teamMemoryPushPreferencesService";

/*
 * Reutilizamos los estilos
 * del componente de avisos
 * de próximos partidos.
 */
import {
  styles,
} from "./UpcomingPushSettings.styles";

export function TeamMemoryPushSettings({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {

  const [devices, setDevices] =
    useState<TeamMemoryPushDevice[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(
    async (): Promise<void> => {

      setLoading(true);
      setError(null);

      try {
        const result =
          await getTeamMemoryPushPreferences();

        setDevices(result);

      } catch {
        setError(
          "No se pudieron cargar los avisos de Team Memory."
        );

      } finally {
        setLoading(false);
      }
    },
    []
  );

 useEffect(() => {
  void load();
}, [load, refreshKey]);

  const changeDevice = async (
    deviceId: string,
    enabled: boolean
  ): Promise<void> => {

    if (savingId !== null) {
      return;
    }

    setSavingId(deviceId);
    setError(null);

    try {
      const updated =
        await updateTeamMemoryPushPreference(
          deviceId,
          enabled
        );

      setDevices(current =>
        current.map(device =>
          device.id === updated.id
            ? updated
            : device
        )
      );

    } catch {
      setError(
        "No se pudo guardar la preferencia."
      );

    } finally {
      setSavingId(null);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        🧠 Avisos Team Memory
      </Text>

      <Text style={styles.description}>
        Recibe una alerta cuando comience
        un partido de un equipo que
        anteriormente te hizo ganar
        o perder.
      </Text>

      <View style={styles.info}>

        <Text style={styles.infoText}>
          • Detectar equipos de tu historial.
        </Text>

        <Text style={styles.infoText}>
          • Recordar ganancias y pérdidas.
        </Text>

        <Text style={styles.infoText}>
          • Mostrar antecedentes frente al rival.
        </Text>

        <Text style={styles.infoText}>
          • Evitar avisos repetidos del mismo partido.
        </Text>

      </View>

      {loading ? (
        <ActivityIndicator />

      ) : devices.length === 0 ? (
        <Text style={styles.muted}>
          No se encontraron dispositivos
          activos vinculados a tu cuenta.
        </Text>

      ) : (
        devices.map(
          (device, index) => (
            <View
              key={device.id}
              style={styles.deviceRow}
            >

              <View style={styles.deviceInfo}>

                <Text style={styles.deviceName}>
                  {device.platform === "android"
                    ? "Teléfono Android"
                    : "Dispositivo iOS"}
                  {" "}
                  {index + 1}
                </Text>

                <Text style={styles.deviceStatus}>
                  {device.enabled
                    ? "Avisos Team Memory autorizados"
                    : "Avisos Team Memory desactivados"}
                </Text>

              </View>

              <Switch
                accessibilityLabel={
                  `Avisos Team Memory del dispositivo ${index + 1}`
                }
                value={device.enabled}
                disabled={
                  savingId !== null
                }
                onValueChange={value => {
                  void changeDevice(
                    device.id,
                    value
                  );
                }}
              />

            </View>
          )
        )
      )}

      {error ? (
        <View style={styles.errorArea}>

          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            disabled={loading}
            onPress={() => {
              void load();
            }}
          >
            <Text style={styles.retry}>
              Reintentar
            </Text>
          </Pressable>

        </View>
      ) : null}

      <Text style={styles.footer}>
        Estas alertas requieren
        notificaciones push activas
        y consentimiento del dispositivo.
        Por ahora el envío automático
        continúa en modo de prueba.
      </Text>

    </View>
  );
}

