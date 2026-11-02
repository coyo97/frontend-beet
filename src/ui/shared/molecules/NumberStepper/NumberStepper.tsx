
import React from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  styles,
} from "./NumberStepper.styles";

interface NumberStepperProps {
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function NumberStepper({
  value,
  min,
  max,
  disabled = false,
  onChange,
}: NumberStepperProps) {

  const cannotDecrease =
    disabled || value <= min;

  const cannotIncrease =
    disabled || value >= max;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Disminuir límite"
        accessibilityState={{
          disabled: cannotDecrease,
        }}
        disabled={cannotDecrease}
        onPress={() => onChange(value - 1)}
        style={[
          styles.button,
          cannotDecrease &&
            styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          −
        </Text>
      </Pressable>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {value}
        </Text>
        <Text style={styles.valueLabel}>
          por día
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Aumentar límite"
        accessibilityState={{
          disabled: cannotIncrease,
        }}
        disabled={cannotIncrease}
        onPress={() => onChange(value + 1)}
        style={[
          styles.button,
          cannotIncrease &&
            styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

