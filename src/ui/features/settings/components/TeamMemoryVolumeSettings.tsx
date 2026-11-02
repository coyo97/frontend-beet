
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
  ApiError,
} from "@/async/api";

import {
  getTeamMemoryVolume,
  updateTeamMemoryVolume,
  type TeamMemoryCooldown,
  type TeamMemoryVolumeStatus,
} from "@/async/services/teamMemoryVolumeService";

import {
  NumberStepper,
} from "@/ui/shared/molecules/NumberStepper/NumberStepper";

import {
  styles,
} from "./TeamMemoryVolumeSettings.styles";

const COOLDOWNS: readonly TeamMemoryCooldown[] = [
  0, 15, 30, 60, 120,
];

function errorMessage(error: unknown): string {
  if (
    error instanceof Error &&
    error.message === "NO_SESSION"
  ) {
    return "Inicia sesión para configurar los avisos.";
  }

  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Tu sesión no está disponible o ha expirado.";
    }

    if (error.status === 404) {
      return "El backend no reconoce la ruta de Team Memory.";
    }

    if (error.status === 500) {
      return "El servidor no pudo procesar la configuración.";
    }
  }

  return "No se pudo conectar con el servicio.";
}

export function TeamMemoryVolumeSettings() {

  const [current, setCurrent] =
    useState<TeamMemoryVolumeStatus | null>(null);

  const [dailyLimit, setDailyLimit] =
    useState(4);

  const [cooldownMinutes, setCooldownMinutes] =
    useState<TeamMemoryCooldown>(30);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result =
        await getTeamMemoryVolume();

      setCurrent(result);
      setDailyLimit(result.dailyLimit);
      setCooldownMinutes(result.cooldownMinutes);

    } catch (err) {
      console.warn(
        "[TeamMemoryVolume.load]",
        err instanceof ApiError
          ? err.status
          : "client"
      );

      setError(errorMessage(err));

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const hasChanges =
    current !== null &&
    (
      dailyLimit !== current.dailyLimit ||
      cooldownMinutes !== current.cooldownMinutes
    );

  const save = async (): Promise<void> => {
    if (
      !current ||
      !hasChanges ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result =
        await updateTeamMemoryVolume({
          dailyLimit,
          cooldownMinutes,
        });

      setCurrent(result);
      setDailyLimit(result.dailyLimit);
      setCooldownMinutes(result.cooldownMinutes);

      setSuccess(
        "Configuración de Team Memory guardada."
      );

    } catch (err) {
      setError(errorMessage(err));

    } finally {
      setSaving(false);
    }
  };

  const nextAllowedText =
    current?.nextAllowedAt
      ? new Date(
          current.nextAllowedAt
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Frecuencia de avisos Team Memory
      </Text>

      <Text style={styles.description}>
        Configura cuántas alertas de equipos
        de tu historial quieres recibir
        y cuánto tiempo debe transcurrir
        entre encuentros diferentes.
      </Text>

      {loading ? (
        <ActivityIndicator color="#53D6C8" />
      ) : current ? (
        <>
          <Text style={styles.label}>
            Máximo de avisos diarios
          </Text>

          <NumberStepper
            value={dailyLimit}
            min={1}
            max={20}
            disabled={saving}
            onChange={value => {
              setDailyLimit(value);
              setSuccess(null);
            }}
          />

          <Text style={styles.label}>
            Pausa entre alertas
          </Text>

          <View style={styles.options}>
            {COOLDOWNS.map(value => {
              const selected =
                cooldownMinutes === value;

              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected,
                    disabled: saving,
                  }}
                  disabled={saving}
                  onPress={() => {
                    setCooldownMinutes(value);
                    setSuccess(null);
                  }}
                  style={[
                    styles.option,
                    selected && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {value === 0
                      ? "Sin pausa"
                      : `${value} min`}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.usage}>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>
                Avisos contabilizados hoy
              </Text>
              <Text style={styles.usageValue}>
                {current.used}
              </Text>
            </View>

            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>
                Cupos restantes
              </Text>
              <Text style={styles.usageValue}>
                {current.remaining}
              </Text>
            </View>

            {nextAllowedText ? (
              <Text style={styles.helper}>
                Próximo aviso permitido desde
                las {nextAllowedText}
              </Text>
            ) : (
              <Text style={styles.helper}>
                Sin pausa activa en este momento.
              </Text>
            )}
          </View>

          {hasChanges ? (
            <Text style={styles.unsaved}>
              Cambios pendientes de guardar
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={!hasChanges || saving}
            onPress={() => {
              void save();
            }}
            style={[
              styles.saveButton,
              (!hasChanges || saving) &&
                styles.disabled,
            ]}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? "Guardando..."
                : "Guardar configuración"}
            </Text>
          </Pressable>

          {success ? (
            <Text style={styles.success}>
              {success}
            </Text>
          ) : null}

          <Text style={styles.footer}>
            El límite es compartido por todos
            tus teléfonos. Los avisos se
            contabilizan al reservar intentos
            de entrega, no cuando Android
            confirma que los recibió.
            El día se calcula en UTC.
          </Text>
        </>
      ) : null}

      {error ? (
        <View style={styles.errorArea}>
          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={loading || saving}
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
    </View>
  );
}

