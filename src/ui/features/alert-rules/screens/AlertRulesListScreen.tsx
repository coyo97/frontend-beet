import React, { useCallback } from "react";

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useAlertRulesStore,
} from "../../../../store/alertRulesStore";

import AlertRuleCard from "../components/AlertRuleCard";

import {
  styles,
} from "../styles/AlertRulesListScreen.styles";

export default function AlertRulesListScreen() {
  const rules = useAlertRulesStore(
    (state) => state.rules
  );

  const loading = useAlertRulesStore(
    (state) => state.loading
  );

  const mutatingId = useAlertRulesStore(
    (state) => state.mutatingId
  );

  const error = useAlertRulesStore(
    (state) => state.error
  );

  const load = useAlertRulesStore(
    (state) => state.load
  );

  const setEnabled = useAlertRulesStore(
    (state) => state.setEnabled
  );

  const remove = useAlertRulesStore(
    (state) => state.remove
  );

  /*
   * EXISTENTE:
   * Recargar las reglas cuando
   * la pantalla recupera el foco.
   */
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  /*
   * Evitar operaciones simultáneas
   * mientras cargamos o modificamos.
   */
  const busy =
    loading || mutatingId !== null;

  /*
   * EXISTENTE:
   * Habilitar o deshabilitar regla.
   */
  const toggle = async (
    id: string,
    enabled: boolean
  ) => {
    try {
      await setEnabled(id, enabled);
    } catch (error) {
      Alert.alert(
        "No se pudo actualizar",
        error instanceof Error
          ? error.message
          : "Inténtalo nuevamente"
      );
    }
  };

  /*
   * EXISTENTE:
   * Confirmar eliminación.
   *
   * Mantiene la misma llamada
   * al store y el mismo manejo
   * de errores.
   */
  const confirmDelete = (
    id: string,
    name: string
  ) => {
    Alert.alert(
      "Eliminar regla",
      `¿Eliminar "${name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            void remove(id).catch((error) => {
              Alert.alert(
                "No se pudo eliminar",
                error instanceof Error
                  ? error.message
                  : "Inténtalo nuevamente"
              );
            });
          },
        },
      ]
    );
  };

  /*
   * NUEVO:
   * Abrir editor para crear una regla.
   *
   * Sin ID = nueva regla.
   */
  const createRule = () => {
    router.push("/alert-rule-editor");
  };

  /*
   * NUEVO:
   * Abrir editor con identificador.
   *
   * Con ID = editar regla existente.
   */
  const editRule = (id: string) => {
    router.push({
      pathname: "/alert-rule-editor",
      params: { id },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          ‹ Volver
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Mis reglas dinámicas
      </Text>

      <Text style={styles.subtitle}>
        Gestiona las reglas personales
        guardadas en Football Radar.
      </Text>

      {/*
       * NUEVO:
       * Acceso al editor visual.
       */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={createRule}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.refreshText}>
          + Crear regla dinámica
        </Text>
      </TouchableOpacity>

      {/*
       * EXISTENTE:
       * Actualización manual de reglas.
       */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => void load()}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.refreshText}>
          Actualizar reglas
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#59D4C4"
        />
      )}

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {!loading && !error && rules.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            Aún no tienes reglas avanzadas
          </Text>

          <Text style={styles.emptyText}>
            Crea tu primera regla dinámica
            y combina condiciones mediante
            Y (AND) u O (OR).
          </Text>
        </View>
      )}

      {/*
       * EXISTENTE:
       * Listar reglas del usuario.
       *
       * NUEVO:
       * Añadir navegación para editar.
       */}
      {!loading && rules.map((rule) => (
        <AlertRuleCard
          key={rule.id}
          rule={rule}
          disabled={busy}
          onToggle={(enabled) => {
            void toggle(rule.id, enabled);
          }}
          onEdit={() => {
            editRule(rule.id);
          }}
          onDelete={() => {
            confirmDelete(
              rule.id,
              rule.name
            );
          }}
        />
      ))}

      <Text style={styles.notice}>
        Las reglas de Watchlist existentes
        permanecen independientes.
      </Text>
    </ScrollView>
  );
}
