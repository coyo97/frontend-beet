
import React from "react";
import {
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import type {
  AlertRuleCondition,
  AlertRuleMetric,
  AlertRuleOperator,
} from "../../../../types/alertRules";

import RuleChoiceField from "./RuleChoiceField";
import { styles } from "../styles/AlertRuleEditor.styles";

const METRICS = [
  { value: "totalRedCards", label: "Total de tarjetas rojas" },
  { value: "homeRedCards", label: "Rojas del local" },
  { value: "awayRedCards", label: "Rojas del visitante" },
  { value: "minute", label: "Minuto del partido" },
  { value: "pointGap", label: "Diferencia de puntos" },
  { value: "positionGap", label: "Diferencia de posiciones" },
  { value: "favoritePosition", label: "Posición del favorito" },
  { value: "favoriteGoalsBehind", label: "Goles de desventaja" },
  { value: "favoriteAtHome", label: "Favorito juega de local" },
  { value: "favoritePressure", label: "Presión del favorito" },
  { value: "favoriteAverageGoals", label: "Promedio de goles" },
  { value: "teamMemoryWins", label: "Victorias en Team Memory" },
  { value: "teamMemoryLosses", label: "Derrotas en Team Memory" },
] as const;

const OPERATORS = [
  { value: "eq", label: "Igual a (=)" },
  { value: "gt", label: "Mayor que (>)" },
  { value: "gte", label: "Mayor o igual (≥)" },
  { value: "lt", label: "Menor que (<)" },
  { value: "lte", label: "Menor o igual (≤)" },
] as const;

type Comparison = Extract<
  AlertRuleCondition,
  { kind: "comparison" }
>;

export function newComparison(): Comparison {
  return {
    kind: "comparison",
    metric: "totalRedCards",
    operator: "gte",
    value: 1,
  };
}

export function validCondition(
  value: AlertRuleCondition,
  depth = 0
): boolean {
  if (depth > 3) return false;

  if (value.kind !== "comparison") {
    return (
      value.conditions.length >= 1 &&
      value.conditions.length <= 8 &&
      value.conditions.every((item) =>
        validCondition(item, depth + 1)
      )
    );
  }

  if (value.metric === "favoriteAtHome") {
    return (
      value.operator === "eq" &&
      typeof value.value === "boolean"
    );
  }

  return (
    typeof value.value === "number" &&
    Number.isFinite(value.value) &&
    Math.abs(value.value) <= 10000
  );
}

interface Props {
  value: AlertRuleCondition;
  onChange: (value: AlertRuleCondition) => void;
  onRemove?: () => void;
  depth?: number;
}

export default function AlertConditionEditor({
  value,
  onChange,
  onRemove,
  depth = 0,
}: Props) {
  if (value.kind === "comparison") {
    const isBoolean =
      value.metric === "favoriteAtHome";

    return (
      <View style={styles.condition}>
        <RuleChoiceField
          label="Métrica"
          value={value.metric}
          options={METRICS}
          onChange={(metric) => {
            const nextMetric =
              metric as AlertRuleMetric;

            onChange({
              kind: "comparison",
              metric: nextMetric,
              operator:
                nextMetric === "favoriteAtHome"
                  ? "eq"
                  : "gte",
              value:
                nextMetric === "favoriteAtHome"
                  ? true
                  : 1,
            });
          }}
        />

        {isBoolean ? (
          <View style={styles.switchRow}>
            <Text style={styles.label}>
              Debe cumplirse
            </Text>
            <Switch
              value={value.value === true}
              onValueChange={(checked) =>
                onChange({
                  ...value,
                  operator: "eq",
                  value: checked,
                })
              }
            />
          </View>
        ) : (
          <>
            <RuleChoiceField
              label="Operador"
              value={value.operator}
              options={OPERATORS}
              onChange={(operator) =>
                onChange({
                  ...value,
                  operator:
                    operator as AlertRuleOperator,
                })
              }
            />

            <Text style={styles.label}>
              Valor
            </Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={
                typeof value.value === "number" &&
                Number.isNaN(value.value)
                  ? ""
                  : String(value.value)
              }
              onChangeText={(text) =>
                onChange({
                  ...value,
                  value: text.trim()
                    ? Number(text)
                    : Number.NaN,
                })
              }
              placeholder="Ejemplo: 60"
              placeholderTextColor="#80959D"
            />
          </>
        )}

        {onRemove && (
          <Pressable
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Text style={styles.removeText}>
              Quitar condición
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  const updateChild = (
    index: number,
    next: AlertRuleCondition
  ) => {
    onChange({
      ...value,
      conditions: value.conditions.map(
        (item, position) =>
          position === index ? next : item
      ),
    });
  };

  const removeChild = (index: number) => {
    if (value.conditions.length <= 1) return;

    onChange({
      ...value,
      conditions: value.conditions.filter(
        (_, position) => position !== index
      ),
    });
  };

  const canAdd =
    value.conditions.length < 8;

  // El backend permite un máximo de 3
  // niveles de anidamiento de condiciones.
  const canAddGroup = depth < 2;

  return (
    <View style={styles.group}>
      <RuleChoiceField
        label="Combinación del grupo"
        value={value.kind}
        options={[
          { value: "all", label: "Todas (Y / AND)" },
          { value: "any", label: "Alguna (O / OR)" },
        ]}
        onChange={(kind) =>
          onChange({
            ...value,
            kind: kind as "all" | "any",
          })
        }
      />

      {value.conditions.map((child, index) => (
        <View
          key={index}
          style={styles.child}
        >
          <Text style={styles.childTitle}>
            Condición {index + 1}
          </Text>

          <AlertConditionEditor
            value={child}
            depth={depth + 1}
            onChange={(next) =>
              updateChild(index, next)
            }
            onRemove={
              value.conditions.length > 1
                ? () => removeChild(index)
                : undefined
            }
          />
        </View>
      ))}

      {canAdd && (
        <View style={styles.actionRow}>
          <Pressable
            style={styles.buttonSecondary}
            onPress={() =>
              onChange({
                ...value,
                conditions: [
                  ...value.conditions,
                  newComparison(),
                ],
              })
            }
          >
            <Text style={styles.buttonText}>
              + Condición
            </Text>
          </Pressable>

          {canAddGroup && (
            <Pressable
              style={styles.buttonSecondary}
              onPress={() =>
                onChange({
                  ...value,
                  conditions: [
                    ...value.conditions,
                    {
                      kind: "all",
                      conditions: [
                        newComparison(),
                      ],
                    },
                  ],
                })
              }
            >
              <Text style={styles.buttonText}>
                + Grupo
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {onRemove && (
        <Pressable
          style={styles.removeButton}
          onPress={onRemove}
        >
          <Text style={styles.removeText}>
            Eliminar grupo
          </Text>
        </Pressable>
      )}
    </View>
  );
}

