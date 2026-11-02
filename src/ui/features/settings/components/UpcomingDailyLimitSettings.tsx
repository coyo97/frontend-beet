
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  getUpcomingDailyLimit,
  updateUpcomingDailyLimit,
  type UpcomingDailyLimit,
} from "@/async/services/upcomingDailyLimitService";

import {
  ApiError,
} from "@/async/api";

import {
  NumberStepper,
} from "@/ui/shared/molecules/NumberStepper/NumberStepper";

import {
  styles,
} from "./UpcomingDailyLimitSettings.styles";

export function UpcomingDailyLimitSettings() {

  const [current, setCurrent] =
    useState<UpcomingDailyLimit | null>(null);

  const [draft, setDraft] =
    useState(8);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  /*
   * Solo consultar al abrir
   * la configuración o reintentar.
   *
   * No consultar al cambiar el número.
   */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result =
        await getUpcomingDailyLimit();

      setCurrent(result);
      setDraft(result.dailyLimit);

} catch (error) {

  const status =
    error instanceof ApiError
      ? error.status
      : undefined;

  console.warn(
    "[UpcomingDailyLimit.load]",
    status,
    error instanceof Error
      ? error.message
      : error
  );

  if (
    status === 401 ||
    (
      error instanceof Error &&
      error.message === "NO_SESSION"
    )
  ) {
    setError(
      "La sesión no está disponible o ha expirado."
    );

  } else if (status === 404) {
    setError(
      "El backend no reconoce la ruta del límite diario."
    );

  } else if (status === 500) {
    setError(
      "El servidor encontró un error al consultar el límite."
    );

  } else {
    setError(
      "No se pudo conectar con el servicio del límite diario."
    );
  }

} finally {
  setLoading(false);
}
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const hasChanges =
    current !== null &&
    draft !== current.dailyLimit;

  /*
   * Una sola petición PATCH
   * cuando el usuario pulsa Guardar.
   */
  const save = async (): Promise<void> => {

    if (
      saving ||
      !current ||
      !hasChanges
    ) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated =
        await updateUpcomingDailyLimit(
          draft
        );

      setCurrent(updated);
      setDraft(updated.dailyLimit);

      setMessage(
        "Límite diario actualizado."
      );

    } catch {
      setError(
        "No se pudo guardar el límite."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Límite diario de avisos
      </Text>

      <Text style={styles.description}>
        Controla cuántas oportunidades
        de próximos partidos puede
        notificar Football Radar cada día.
      </Text>

      {loading ? (
        <ActivityIndicator
          color="#47CFC3"
        />
      ) : current ? (
        <>
          <NumberStepper
            value={draft}
            min={1}
            max={20}
            disabled={saving}
            onChange={value => {
              setDraft(value);
              setMessage(null);
            }}
          />

          <Text style={styles.range}>
            Mínimo 1 · Máximo 20
          </Text>

          <View style={styles.usageBox}>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>
                Avisos utilizados hoy
              </Text>
              <Text style={styles.usageValue}>
                {current.used}
              </Text>
            </View>

            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>
                Avisos restantes
              </Text>
              <Text style={styles.usageValue}>
                {current.remaining}
              </Text>
            </View>

            <Text style={styles.helper}>
              El consumo corresponde al
              límite actualmente guardado.
            </Text>
          </View>

          {hasChanges ? (
            <Text style={styles.unsaved}>
              Tienes cambios sin guardar.
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void save();
            }}
            disabled={
              saving || !hasChanges
            }
            style={[
              styles.saveButton,
              (!hasChanges || saving) &&
                styles.saveButtonDisabled,
            ]}
          >
            <Text style={styles.saveText}>
              {saving
                ? "Guardando..."
                : "Guardar límite"}
            </Text>
          </Pressable>

          {message ? (
            <Text style={styles.success}>
              {message}
            </Text>
          ) : null}

          <Text style={styles.footer}>
            Cada partido y ventana de
            recordatorio consume un cupo
            por cuenta, aunque tengas
            varios teléfonos autorizados.
            El contador actual usa UTC.
          </Text>
        </>
      ) : null}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void load();
            }}
            disabled={loading || saving}
          >
            <Text style={styles.retry}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

