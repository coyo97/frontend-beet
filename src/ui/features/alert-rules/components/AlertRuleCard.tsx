
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
  onDelete: () => void;
}


function describeCondition(
  condition: AlertRuleCondition
): string {

  /*
   * Condición individual:
   * métrica + operador + valor.
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
          accessibilityLabel={`Activar ${rule.name}`}
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
  );
}

