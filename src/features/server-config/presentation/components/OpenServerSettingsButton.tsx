import React from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  styles,
} from "./OpenServerSettingsButton.styles";

export function OpenServerSettingsButton() {

  const router =
    useRouter();

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.help
        }
      >
        ¿No puedes conectar con el servidor?
      </Text>

      <TouchableOpacity
        activeOpacity={
          0.8
        }
        onPress={
          () =>
            router.push(
              "/server-settings"
            )
        }
        style={
          styles.button
        }
      >
        <Text
          style={
            styles.buttonText
          }
        >
          ⚙ Configurar servidor
        </Text>
      </TouchableOpacity>
    </View>
  );
}
