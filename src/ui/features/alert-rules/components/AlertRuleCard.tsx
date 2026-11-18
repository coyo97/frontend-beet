import React from "react";

import {
  View,
  Text,
  Switch,
  TouchableOpacity,
} from "react-native";

import type {
  AlertRule,
  AlertRuleCondition,
} from "../../../../types/alertRules";

import { styles } from "../styles/AlertRuleCard.styles";

interface Props {
  rule: AlertRule;
  disabled: boolean;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function describeCondition(
  condition: AlertRuleCondition
): string {

  /*
   * Condición individual:
   * métrica + operador + valor.
   *
   * Conservamos la representación
   * original de las condiciones.
   */
  if (condition.kind === "comparison") {
    return [
      condition.metric,
      condition.operator,
      String(condition.value),
    ].join(" ");
  }

  /*
   * Condiciones agrupadas:
   * AND / OR.
   *
   * Conservamos los paréntesis
   * para distinguir los grupos.
   */
  const separator =
    condition.kind === "all"
      ? " Y "
      : " O ";

  const children =
    condition.conditions.map(
      describeCondition
    );

  return `(${children.join(separator)})`;
}

export default function AlertRuleCard({
  rule,
  disabled,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.title}>
            {rule.name}
          </Text>

          <Text style={styles.subtitle}>
            {rule.phase === "live"
              ? "En vivo"
              : "Antes del partido"}
            {" · "}
            {rule.scope === "all"
              ? "Todos los partidos"
              : "Watchlist"}
          </Text>
        </View>

        <Switch
          value={rule.enabled}
          disabled={disabled}
          onValueChange={onToggle}
          accessibilityLabel={
            `${rule.enabled ? "Desactivar" : "Activar"} ${rule.name}`
          }
        />
      </View>

      <Text style={styles.conditions}>
        {describeCondition(rule.when)}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.detail}>
          Prioridad: {rule.delivery.priority}
          {" · "}
          Cooldown: {rule.delivery.cooldownMinutes} min
        </Text>

        <View style={styles.actions}>
          {/*
           * NUEVO:
           * Editar regla existente.
           */}
          <TouchableOpacity
            disabled={disabled}
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${rule.name}`}
            style={styles.editButton}
          >
            <Text style={styles.editText}>
              Editar
            </Text>
          </TouchableOpacity>

          {/*
           * EXISTENTE:
           * Eliminar con confirmación
           * desde la pantalla principal.
           */}
          <TouchableOpacity
            disabled={disabled}
            onPress={onDelete}
            accessibilityRole="button"
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
