import React from "react";

import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  TeamMemoryEvent,
} from "../types/teamMemory";

import {
  styles,
} from "./TeamMemoryHistory.styles";

interface Props {
  items:
    TeamMemoryEvent[];

  loading:
    boolean;

  mutating:
    boolean;

  onDelete:
    (
      event:
        TeamMemoryEvent
    ) => void;
}

function formatDate(
  value:
    string | null
): string {

  if (!value) {
    return "Fecha no registrada";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date
    .toLocaleString(
      undefined,
      {
        day:
          "2-digit",

        month:
          "2-digit",

        year:
          "numeric",

        hour:
          "2-digit",

        minute:
          "2-digit",
      }
    );
}

export function TeamMemoryHistory({
  items,
  loading,
  mutating,
  onDelete,
}: Props) {

  if (loading) {
    return (
      <View
        style={
          styles.loading
        }
      >
        <ActivityIndicator
          size="small"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Cargando historial...
        </Text>
      </View>
    );
  }

  if (
    items.length ===
    0
  ) {
    return (
      <Text
        style={
          styles.empty
        }
      >
        Todavía no registraste experiencias con este equipo.
      </Text>
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >
      {items.map(
        (
          item
        ) => {

          const positive =
            item.outcome ===
            "win";

          return (
            <View
              key={
                item.id
              }
              style={
                styles.event
              }
            >
              <View
                style={
                  styles.eventHeader
                }
              >
                <Text
                  style={[
                    styles.outcome,

                    positive
                      ? styles.win
                      : styles.loss,
                  ]}
                >
                  {positive
                    ? "🟢 Me hizo ganar"
                    : "🔴 Me hizo perder"}
                </Text>

                <TouchableOpacity
                  disabled={
                    mutating
                  }
                  onPress={
                    () => {
                      Alert.alert(
                        "Eliminar registro",
                        "¿Eliminar este elemento de tu memoria del equipo?",
                        [
                          {
                            text:
                              "Cancelar",

                            style:
                              "cancel",
                          },

                          {
                            text:
                              "Eliminar",

                            style:
                              "destructive",

                            onPress:
                              () =>
                                onDelete(
                                  item
                                ),
                          },
                        ]
                      );
                    }
                  }
                >
                  <Text
                    style={
                      styles.delete
                    }
                  >
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={
                  styles.opponent
                }
              >
                vs{" "}
                {item.opponentName ??
                  "Rival no registrado"}
              </Text>

              {item.competitionName && (
                <Text
                  style={
                    styles.competition
                  }
                >
                  {item.competitionName}
                </Text>
              )}

              <Text
                style={
                  styles.date
                }
              >
                Partido:{" "}
                {formatDate(
                  item.kickoffAt
                )}
              </Text>

              <Text
                style={
                  styles.registered
                }
              >
                Registrado:{" "}
                {formatDate(
                  item.createdAt
                )}
              </Text>
            </View>
          );
        }
      )}
    </View>
  );
}
