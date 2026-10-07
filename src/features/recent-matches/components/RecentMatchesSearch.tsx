import React from "react";

import {
  TextInput,
  View,
} from "react-native";

import {
  styles,
} from "./RecentMatchesSearch.styles";

interface Props {
  value:
    string;

  onChange:
    (
      value:
        string
    ) =>
      void;
}

export function RecentMatchesSearch({
  value,
  onChange,
}: Props) {

  return (
    <View
      style={
        styles.container
      }
    >
      <TextInput
        value={
          value
        }
        onChangeText={
          onChange
        }
        placeholder="Buscar equipo, liga o país..."
        placeholderTextColor="#77808f"
        autoCapitalize="none"
        autoCorrect={
          false
        }
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={
          styles.input
        }
      />
    </View>
  );
}
