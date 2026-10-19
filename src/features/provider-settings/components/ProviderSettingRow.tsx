import React from "react";

import {
  ActivityIndicator,
  Switch,
  Text,
  View,
} from "react-native";

import type {
  FootballProviderKey,
  FootballProviderSetting,
} from "../types/providerSettings";

import {
  styles,
} from "./ProviderSettingRow.styles";

interface Props {
  item:
    FootballProviderSetting;

  updating:
    boolean;

  onChange:
    (
      key:
        FootballProviderKey,

      enabled:
        boolean
    ) => void;
}

function providerLabel(
  key:
    FootballProviderKey
): string {

  switch (
    key
  ) {

    case "sofascore":
      return "SofaScore";

    case "flashscore":
      return "Flashscore";

    case "fotmob":
      return "FotMob";

    case "api-football":
      return "API-Football";

    case "1xbet":
      return "1XBet";
  }
}

function providerDescription(
  key:
    FootballProviderKey
): string {

  switch (
    key
  ) {

    case "sofascore":
      return "Partidos Live y contexto SofaScore.";

    case "flashscore":
      return "Live, estadísticas e incidencias Flashscore.";

    case "fotmob":
      return "Enriquecimiento y contexto FotMob.";

    case "api-football":
      return "Proveedor API-Football.";

    case "1xbet":
      return "Partidos Live obtenidos desde 1XBet.";
  }
}

export function ProviderSettingRow({
  item,
  updating,
  onChange,
}: Props) {

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.info
        }
      >
        <View
          style={
            styles.titleRow
          }
        >
          <View
            style={[
              styles.dot,

              item.enabled
                ? styles.dotEnabled
                : styles.dotDisabled,
            ]}
          />

          <Text
            style={
              styles.title
            }
          >
            {providerLabel(
              item.key
            )}
          </Text>
        </View>

        <Text
          style={
            styles.description
          }
        >
          {providerDescription(
            item.key
          )}
        </Text>

        <Text
          style={
            styles.state
          }
        >
          {item.enabled
            ? "ACTIVO"
            : "DESACTIVADO"}
          {" · "}
          {item.source ===
          "stored"
            ? "configuración guardada"
            : "valor predeterminado"}
        </Text>
      </View>

      {updating ? (
        <View
          style={
            styles.loader
          }
        >
          <ActivityIndicator
            size="small"
          />
        </View>
      ) : (
        <Switch
          value={
            item.enabled
          }
          onValueChange={
            value =>
              onChange(
                item.key,
                value
              )
          }
        />
      )}
    </View>
  );
}
