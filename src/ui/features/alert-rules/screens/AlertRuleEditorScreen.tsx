import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useAlertRulesStore } from
  "../../../../store/alertRulesStore";

import type {
  AlertRuleCondition,
  AlertRulePhase,
  AlertRuleScope,
  SaveAlertRuleInput,
} from "../../../../types/alertRules";

import AlertConditionEditor, {
  newComparison,
  validCondition,
} from "../components/AlertConditionEditor";

import RuleChoiceField from
  "../components/RuleChoiceField";

import { styles } from
  "../styles/AlertRuleEditor.styles";

type Priority = "high" | "normal" | "low";

function parseFilters(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AlertRuleEditorScreen() {
  const { id } =
    useLocalSearchParams<{ id?: string }>();

  const rules = useAlertRulesStore(
    (state) => state.rules
  );

  const load = useAlertRulesStore(
    (state) => state.load
  );

  const add = useAlertRulesStore(
    (state) => state.add
  );

  const replace = useAlertRulesStore(
    (state) => state.replace
  );

  const mutatingId = useAlertRulesStore(
    (state) => state.mutatingId
  );

  const storeError = useAlertRulesStore(
    (state) => state.error
  );

  const rule = id
    ? rules.find((item) => item.id === id)
    : undefined;

  const [attemptedLoad, setAttemptedLoad] =
    useState(false);

  const [hydratedId, setHydratedId] =
    useState<string | null>(null);

  const [name, setName] = useState("");

  const [phase, setPhase] =
    useState<AlertRulePhase>("live");

  const [scope, setScope] =
    useState<AlertRuleScope>("all");

  const [enabled, setEnabled] =
    useState(false);

  const [when, setWhen] =
    useState<AlertRuleCondition>({
      kind: "all",
      conditions: [newComparison()],
    });

  const [countries, setCountries] =
    useState("");

  const [competitions, setCompetitions] =
    useState("");

  const [excluded, setExcluded] =
    useState("");

  const [priority, setPriority] =
    useState<Priority>("normal");

  const [cooldown, setCooldown] =
    useState("30");

  const [reminders, setReminders] =
    useState("");

  /*
   * Cargar la regla si la pantalla
   * se abrió en modo edición.
   */
  useEffect(() => {
    if (!id) {
      setAttemptedLoad(true);
      return;
    }

    if (rules.some((item) => item.id === id)) {
      setAttemptedLoad(true);
      return;
    }

    let active = true;

    setAttemptedLoad(false);

    void load().finally(() => {
      if (active) {
        setAttemptedLoad(true);
      }
    });

    return () => {
      active = false;
    };
  }, [id, load]);

  /*
   * Hidratar el formulario solamente
   * una vez por identificador.
   *
   * No sobrescribir cambios que el
   * usuario esté haciendo.
   */
  useEffect(() => {
    if (!rule || hydratedId === rule.id) {
      return;
    }

    setName(rule.name);
    setPhase(rule.phase);
    setScope(rule.scope);
    setEnabled(rule.enabled);
    setWhen(rule.when);

    setCountries(
      (rule.filters.countries ?? []).join(", ")
    );

    setCompetitions(
      (rule.filters.competitions ?? []).join(", ")
    );

    setExcluded(
      (rule.filters.excludedCompetitions ?? [])
        .join(", ")
    );

    setPriority(rule.delivery.priority);

    setCooldown(
      String(rule.delivery.cooldownMinutes)
    );

    setReminders(
      (
        rule.delivery.remindersBeforeKickoff ?? []
      ).join(", ")
    );

    setHydratedId(rule.id);
  }, [rule, hydratedId]);

  /*
   * Validar y guardar.
   *
   * El backend identifica al propietario
   * mediante JWT, no mediante un ownerId
   * proporcionado por el formulario.
   */
  const save = async () => {
    if (mutatingId !== null) return;

    const trimmedName = name.trim();

    if (
      trimmedName.length < 1 ||
      trimmedName.length > 100
    ) {
      Alert.alert(
        "Nombre inválido",
        "Escribe entre 1 y 100 caracteres."
      );
      return;
    }

    if (!validCondition(when)) {
      Alert.alert(
        "Condiciones inválidas",
        "Revisa los valores y grupos de condiciones."
      );
      return;
    }

    const cooldownMinutes = Number(cooldown);

    if (
      !Number.isInteger(cooldownMinutes) ||
      cooldownMinutes < 5 ||
      cooldownMinutes > 10080
    ) {
      Alert.alert(
        "Cooldown inválido",
        "Debe estar entre 5 y 10080 minutos."
      );
      return;
    }

    const reminderTokens = reminders.trim()
      ? reminders.split(",").map((item) => item.trim())
      : [];

    const reminderValues = reminderTokens.map(
      (item) => item === "" ? Number.NaN : Number(item)
    );

    if (
      reminderValues.length > 5 ||
      reminderValues.some(
        (value) =>
          !Number.isInteger(value) ||
          value < 0 ||
          value > 10080
      )
    ) {
      Alert.alert(
        "Recordatorios inválidos",
        "Introduce hasta cinco números entre 0 y 10080."
      );
      return;
    }

    if (
      phase === "live" &&
      reminderValues.length > 0
    ) {
      Alert.alert(
        "Fase incompatible",
        "Los recordatorios previos requieren fase prematch."
      );
      return;
    }

    const filters = {
      countries: parseFilters(countries),
      competitions: parseFilters(competitions),
      excludedCompetitions: parseFilters(excluded),
    };

    if (
      Object.values(filters).some(
        (items) =>
          items.length > 50 ||
          items.some((item) => item.length > 120)
      )
    ) {
      Alert.alert(
        "Filtros inválidos",
        "Máximo 50 valores de 120 caracteres por lista."
      );
      return;
    }

    const input: SaveAlertRuleInput = {
      name: trimmedName,
      enabled,
      phase,
      scope,
      filters,
      when,
      delivery: {
        priority,
        cooldownMinutes,
        remindersBeforeKickoff:
          phase === "prematch"
            ? reminderValues
            : [],
      },
    };

    try {
      if (id) {
        await replace(id, input);
      } else {
        await add(input);
      }

      router.back();
    } catch (error) {
      Alert.alert(
        "Error al guardar",
        error instanceof Error
          ? error.message
          : "No se pudo guardar la regla."
      );
    }
  };

  /*
   * Evitar mostrar el formulario vacío
   * mientras se carga una regla existente.
   */
  if (
    id &&
    (!rule || hydratedId !== id)
  ) {
    return (
      <View style={styles.loadingContainer}>
        {!attemptedLoad || rule ? (
          <ActivityIndicator color="#59D4C4" />
        ) : (
          <Text style={styles.errorText}>
            {storeError ??
              "No se encontró la regla. Revisa tu sesión y conexión."}
          </Text>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.accent}>
          ‹ Volver
        </Text>
      </Pressable>

      <Text style={styles.title}>
        {id
          ? "Editar regla dinámica"
          : "Nueva regla dinámica"}
      </Text>

      <Text style={styles.subtitle}>
        Combina condiciones de Football Radar
        sin modificar el código del servidor.
      </Text>

      <Text style={styles.label}>
        Nombre de la regla
      </Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        maxLength={100}
        placeholder="Ejemplo: Roja y presión alta"
        placeholderTextColor="#80959D"
      />

      <RuleChoiceField
        label="Fase"
        value={phase}
        options={[
          {
            value: "live",
            label: "Partidos en vivo",
          },
          {
            value: "prematch",
            label: "Antes del partido",
          },
        ]}
        onChange={(value) => {
          const next = value as AlertRulePhase;

          setPhase(next);

          if (next === "live") {
            setReminders("");
          }
        }}
      />

      <RuleChoiceField
        label="Alcance"
        value={scope}
        options={[
          {
            value: "all",
            label: "Todos los partidos",
          },
          {
            value: "watchlist",
            label: "Solo Watchlist",
          },
        ]}
        onChange={(value) =>
          setScope(value as AlertRuleScope)
        }
      />

      {/* Condiciones AND / OR */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Condiciones
        </Text>

        <Text style={styles.hint}>
          Selecciona las métricas y combínalas
          mediante grupos Y (AND) u O (OR).
        </Text>

        <AlertConditionEditor
          value={when}
          onChange={setWhen}
        />
      </View>

      {/* Filtros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Filtros
        </Text>

        <Text style={styles.hint}>
          Separa varios valores con comas.
          Deja vacío para no aplicar el filtro.
        </Text>

        <Text style={styles.label}>
          Países
        </Text>

        <TextInput
          style={styles.input}
          value={countries}
          onChangeText={setCountries}
          placeholder="Bolivia, Perú"
          placeholderTextColor="#80959D"
        />

        <Text style={styles.label}>
          Competiciones incluidas
        </Text>

        <TextInput
          style={styles.input}
          value={competitions}
          onChangeText={setCompetitions}
          placeholder="Nombre de competición"
          placeholderTextColor="#80959D"
        />

        <Text style={styles.label}>
          Competiciones excluidas
        </Text>

        <TextInput
          style={styles.input}
          value={excluded}
          onChangeText={setExcluded}
          placeholder="Competiciones que deseas excluir"
          placeholderTextColor="#80959D"
        />
      </View>

      {/* Configuración de entrega */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Configuración de entrega
        </Text>

        <RuleChoiceField
          label="Prioridad"
          value={priority}
          options={[
            {
              value: "high",
              label: "Alta",
            },
            {
              value: "normal",
              label: "Normal",
            },
            {
              value: "low",
              label: "Baja",
            },
          ]}
          onChange={(value) =>
            setPriority(value as Priority)
          }
        />

        <Text style={styles.label}>
          Cooldown (minutos)
        </Text>

        <TextInput
          style={styles.input}
          value={cooldown}
          onChangeText={setCooldown}
          keyboardType="numeric"
          placeholder="30"
          placeholderTextColor="#80959D"
        />

        <Text style={styles.hint}>
          Tiempo mínimo configurado para evitar
          notificaciones repetitivas de la regla.
        </Text>

        {phase === "prematch" && (
          <>
            <Text style={styles.label}>
              Recordatorios antes del inicio
            </Text>

            <TextInput
              style={styles.input}
              value={reminders}
              onChangeText={setReminders}
              placeholder="1440, 60, 30"
              placeholderTextColor="#80959D"
            />

            <Text style={styles.hint}>
              1440 = 24 horas, 60 = una hora,
              30 = media hora. La ejecución
              automática de reglas prematch
              todavía requiere verificación
              e integración con su scheduler.
            </Text>
          </>
        )}
      </View>

      {/* Estado */}
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.sectionTitle}>
            Regla habilitada
          </Text>

          <Text style={styles.hint}>
            Las reglas nuevas empiezan
            desactivadas. Actívalas cuando
            estén verificadas.
          </Text>
        </View>

        <Switch
          value={enabled}
          onValueChange={setEnabled}
        />
      </View>

      {/* Guardar */}
      <Pressable
        style={[
          styles.buttonPrimary,
          mutatingId !== null &&
            styles.buttonDisabled,
        ]}
        disabled={mutatingId !== null}
        onPress={() => void save()}
      >
        <Text style={styles.buttonText}>
          {mutatingId !== null
            ? "Guardando..."
            : id
              ? "Guardar cambios"
              : "Crear regla"}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        Guardar o habilitar una regla no
        garantiza una notificación. El backend
        debe tener un detector conectado,
        y el dispositivo debe contar con
        autorización para recibir alertas.
      </Text>
    </ScrollView>
  );
}
