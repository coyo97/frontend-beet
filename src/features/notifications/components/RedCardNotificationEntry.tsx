
import React from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  MatchCopyActions,
} from "@/features/match-context/components/MatchCopyActions";

import {
  styles,
} from "./RedCardNotificationEntry.styles";

interface Props {
  homeName?: string;
  awayName?: string;

  affectedSide?: string;
  minute?: string;

  onDismiss: () => void;
}

export function RedCardNotificationEntry({
  homeName,
  awayName,
  affectedSide,
  minute,
  onDismiss,
}: Props) {

  const hasTeams =
    Boolean(
      homeName?.trim() &&
      awayName?.trim()
    );

  const affectedTeam =
    affectedSide === "home"
      ? homeName
      : affectedSide === "away"
        ? awayName
        : affectedSide === "both"
          ? "Ambos equipos"
          : null;

  const validMinute =
    minute &&
    /^\d{1,3}$/.test(minute)
      ? minute
      : null;

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <View
          style={styles.heading}
        >
          <Text style={styles.icon}>
            🟥
          </Text>

          <View style={styles.headingText}>
            <Text style={styles.title}>
              Alerta de tarjeta roja
            </Text>

            <Text style={styles.subtitle}>
              Abierto desde una notificación
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Cerrar aviso"
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>
            ✕
          </Text>
        </Pressable>
      </View>

      {hasTeams && (
        <Text style={styles.match}>
          {homeName} vs {awayName}
        </Text>
      )}

      <View style={styles.details}>
        <Text style={styles.detailText}>
          {affectedTeam
            ? `Expulsión: ${affectedTeam}`
            : "Expulsión detectada"}
        </Text>

        {validMinute && (
          <Text style={styles.minute}>
            Minuto {validMinute}'
          </Text>
        )}
      </View>

      <Text style={styles.description}>
        Consulta el marcador y los incidentes
        actualizados antes de analizar el
        encuentro.
      </Text>

      {hasTeams && (
        <MatchCopyActions
          home={homeName!}
          away={awayName!}
        />
      )}
    </View>
  );
}

