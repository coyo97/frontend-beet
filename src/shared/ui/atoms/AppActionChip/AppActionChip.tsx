import React from "react";

import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  styles,
} from "./AppActionChip.styles";

interface Props {
  label:
    string;

  active?:
    boolean;

  disabled?:
    boolean;

  loading?:
    boolean;

  onPress:
    () => void;
}

export function AppActionChip({
  label,
  active = false,
  disabled = false,
  loading = false,
  onPress,
}: Props) {

  return (
    <TouchableOpacity
      activeOpacity={
        0.8
      }
      disabled={
        disabled ||
        loading
      }
      onPress={
        onPress
      }
      style={[
        styles.container,

        active &&
          styles.active,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,

            active &&
              styles.activeLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
