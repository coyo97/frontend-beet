
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

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

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

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => void load()}
        disabled={loading || mutatingId !== null}
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
            El editor para crear condiciones
            personalizadas será el siguiente módulo.
          </Text>
        </View>
      )}

      {!loading && rules.map((rule) => (
        <AlertRuleCard
          key={rule.id}
          rule={rule}
          disabled={mutatingId !== null}
          onToggle={(enabled) => {
            void toggle(rule.id, enabled);
          }}
          onDelete={() =>
            confirmDelete(rule.id, rule.name)
          }
        />
      ))}

      <Text style={styles.notice}>
        Las reglas de Watchlist existentes
        permanecen independientes.
      </Text>
    </ScrollView>
  );
}

