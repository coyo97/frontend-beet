
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
  getUpcomingPushPreferences,
  updateUpcomingPushPreference,
  type UpcomingPushDevice,
} from "@/async/services/upcomingPushPreferencesService";

import {
  styles,
} from "./UpcomingPushSettings.styles";

import {
  UpcomingDailyLimitSettings,
} from "./UpcomingDailyLimitSettings";

export function UpcomingPushSettings({
  refreshKey = 0,
}: {
  refreshKey?: number;
}) {
  const [devices, setDevices] =
    useState<UpcomingPushDevice[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result =
        await getUpcomingPushPreferences();

      setDevices(result);

} catch (error) {

  console.warn(
    "[UpcomingPushSettings] Error GET",
    error
  );

  const status =
    typeof error === "object" &&
    error !== null &&
    "status" in error
      ? (error as { status?: unknown }).status
      : null;

  setError(
    "No se pudieron cargar las preferencias." +
    (typeof status === "number"
      ? ` HTTP ${status}`
      : " Revisa la conexión.")
  );

} finally {
      setLoading(false);
    }
  }, []);

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
        await updateUpcomingPushPreference(
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
        "No se pudo guardar el cambio."
      );

    } finally {
      setSavingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Avisos de próximos partidos
      </Text>

      <Text style={styles.description}>
        Recibe alertas cuando Football Radar
        detecte enfrentamientos con diferencias
        importantes de puntos y posiciones.
      </Text>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          • Hasta 24 horas antes del partido
        </Text>

        <Text style={styles.infoText}>
          • Recordatorio 60 minutos antes
        </Text>

        <Text style={styles.infoText}>
          • Solo oportunidades de prioridad alta
        </Text>
      </View>

		<UpcomingDailyLimitSettings />	

      {loading ? (
        <ActivityIndicator />
      ) : devices.length === 0 ? (
        <Text style={styles.muted}>
          No se encontraron dispositivos
          activos asociados a esta cuenta.
        </Text>
      ) : (
        devices.map((device, index) => (
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
                  ? "Avisos autorizados"
                  : "Avisos desactivados"}
              </Text>
            </View>

            <Switch
              accessibilityLabel={
                `Avisos de próximos partidos ` +
                `para dispositivo ${index + 1}`
              }
              value={device.enabled}
              disabled={savingId !== null}
              onValueChange={value => {
                void changeDevice(
                  device.id,
                  value
                );
              }}
            />
          </View>
        ))
      )}

      {error ? (
        <View style={styles.errorArea}>
          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            onPress={() => {
              void load();
            }}
            disabled={loading}
          >
            <Text style={styles.retry}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.footer}>
        Estas preferencias no sustituyen
        el interruptor general de
        notificaciones. Si está desactivado,
        no se enviarán avisos.
      </Text>
    </View>
  );
}

