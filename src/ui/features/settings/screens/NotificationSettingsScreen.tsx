import React, {
  useEffect,
} from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  useNotificationSettingsStore,
} from "../../../../store/notificationSettingsStore";

import type {
  PushMinimumStrength,
  PushWatchlistTypes,
} from "../../../../types/notifications";

type WatchlistTypeKey =
  keyof PushWatchlistTypes;

interface ToggleRowProps {
  title: string;
  description: string;

  value: boolean;

  disabled?: boolean;

  onValueChange:
    (
      value:
        boolean
    ) => void;
}

function ToggleRow({
  title,
  description,
  value,
  disabled,
  onValueChange,
}: ToggleRowProps) {

  return (
    <View
      style={
        styles.row
      }
    >
      <View
        style={
          styles.rowText
        }
      >
        <Text
          style={
            styles.rowTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.rowDescription
          }
        >
          {description}
        </Text>
      </View>

      <Switch
        value={
          value
        }
        disabled={
          disabled
        }
        onValueChange={
          onValueChange
        }
      />
    </View>
  );
}

export default function NotificationSettingsScreen() {

  const preferences =
    useNotificationSettingsStore(
      (
        state
      ) =>
        state.preferences
    );

  const loading =
    useNotificationSettingsStore(
      (
        state
      ) =>
        state.loading
    );

  const saving =
    useNotificationSettingsStore(
      (
        state
      ) =>
        state.saving
    );

  const error =
    useNotificationSettingsStore(
      (
        state
      ) =>
        state.error
    );

  const load =
    useNotificationSettingsStore(
      (
        state
      ) =>
        state.load
    );

  const update =
    useNotificationSettingsStore(
      (
        state
      ) =>
        state.update
    );

  useEffect(
    () => {
      void load();
    },
    [
      load,
    ]
  );

  const changeStrength =
    (
      value:
        PushMinimumStrength
    ) => {

      if (
        saving ||
        preferences
          ?.minimumStrength ===
          value
      ) {
        return;
      }

      void update({
        minimumStrength:
          value,
      });
    };

  const changeWatchlistType =
    (
      key:
        WatchlistTypeKey,

      value:
        boolean
    ) => {

      if (saving) {
        return;
      }

      void update({
        watchlistTypes: {
          [key]:
            value,
        },
      });
    };

  if (
    loading &&
    !preferences
  ) {
    return (
      <View
        style={
          styles.loadingScreen
        }
      >
        <ActivityIndicator
          size="large"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Cargando ajustes...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={
        styles.screen
      }
      contentContainerStyle={
        styles.content
      }
    >
      <View
        style={
          styles.header
        }
      >
        <TouchableOpacity
          onPress={
            () =>
              router.back()
          }
        >
          <Text
            style={
              styles.back
            }
          >
            ‹ Volver
          </Text>
        </TouchableOpacity>

        {saving && (
          <ActivityIndicator
            size="small"
          />
        )}
      </View>

      <Text
        style={
          styles.title
        }
      >
        ⚙ Alertas
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Decide qué señales de Football Radar merecen enviarte una notificación.
      </Text>

      {error && (
        <View
          style={
            styles.errorBox
          }
        >
          <Text
            style={
              styles.errorText
            }
          >
            {error}
          </Text>

          <TouchableOpacity
            onPress={
              () => {
                void load();
              }
            }
          >
            <Text
              style={
                styles.retry
              }
            >
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {preferences && (
        <>
          <View
            style={
              styles.section
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Notificaciones push
            </Text>

            <ToggleRow
              title="Alertas activas"
              description="Football Radar podrá avisarte aunque no estés mirando el Radar."
              value={
                preferences.enabled
              }
              disabled={
                saving
              }
              onValueChange={
                (
                  value
                ) => {
                  void update({
                    enabled:
                      value,
                  });
                }
              }
            />
          </View>

          <View
            style={[
              styles.section,

              !preferences
                .enabled &&
                styles.disabledSection,
            ]}
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Intensidad mínima
            </Text>

            <Text
              style={
                styles.sectionHint
              }
            >
              Define cuánta presión debe detectar el Radar antes de avisarte.
            </Text>

            <View
              style={
                styles.strengthRow
              }
            >
              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  saving ||
                  !preferences
                    .enabled
                }
                style={[
                  styles.strengthButton,

                  preferences
                    .minimumStrength ===
                    "clear" &&
                    styles.strengthButtonSelected,
                ]}
                onPress={
                  () =>
                    changeStrength(
                      "clear"
                    )
                }
              >
                <Text
                  style={[
                    styles.strengthTitle,

                    preferences
                      .minimumStrength ===
                      "clear" &&
                      styles.strengthTextSelected,
                  ]}
                >
                  CLEAR
                </Text>

                <Text
                  style={
                    styles.strengthDescription
                  }
                >
                  Presión clara
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  saving ||
                  !preferences
                    .enabled
                }
                style={[
                  styles.strengthButton,

                  preferences
                    .minimumStrength ===
                    "strong" &&
                    styles.strengthButtonSelected,
                ]}
                onPress={
                  () =>
                    changeStrength(
                      "strong"
                    )
                }
              >
                <Text
                  style={[
                    styles.strengthTitle,

                    preferences
                      .minimumStrength ===
                      "strong" &&
                      styles.strengthTextSelected,
                  ]}
                >
                  STRONG
                </Text>

                <Text
                  style={
                    styles.strengthDescription
                  }
                >
                  Solo presión fuerte
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={
                styles.explanation
              }
            >
              CLEAR incluye señales clear y strong. STRONG reduce el ruido y avisa únicamente cuando la ventaja de presión es fuerte.
            </Text>
          </View>

          <View
            style={[
              styles.section,

              !preferences
                .enabled &&
                styles.disabledSection,
            ]}
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Mi Watchlist
            </Text>

            <Text
              style={
                styles.sectionHint
              }
            >
              Selecciona qué tipos de elementos pueden generar una alerta.
            </Text>

            <ToggleRow
              title="Partidos"
              description="Alertarme por partidos específicos que estoy siguiendo."
              value={
                preferences
                  .watchlistTypes
                  .match
              }
              disabled={
                saving ||
                !preferences
                  .enabled
              }
              onValueChange={
                (
                  value
                ) =>
                  changeWatchlistType(
                    "match",
                    value
                  )
              }
            />

            <ToggleRow
              title="Equipos"
              description="Avisarme cuando participe un equipo seguido."
              value={
                preferences
                  .watchlistTypes
                  .team
              }
              disabled={
                saving ||
                !preferences
                  .enabled
              }
              onValueChange={
                (
                  value
                ) =>
                  changeWatchlistType(
                    "team",
                    value
                  )
              }
            />

            <ToggleRow
              title="Competiciones"
              description="Recibir señales de competiciones que estoy siguiendo."
              value={
                preferences
                  .watchlistTypes
                  .competition
              }
              disabled={
                saving ||
                !preferences
                  .enabled
              }
              onValueChange={
                (
                  value
                ) =>
                  changeWatchlistType(
                    "competition",
                    value
                  )
              }
            />

            <ToggleRow
              title="Países"
              description="Recibir señales de partidos pertenecientes a países seguidos."
              value={
                preferences
                  .watchlistTypes
                  .country
              }
              disabled={
                saving ||
                !preferences
                  .enabled
              }
              onValueChange={
                (
                  value
                ) =>
                  changeWatchlistType(
                    "country",
                    value
                  )
              }
            />

            <ToggleRow
              title="Reglas del Radar"
              description="Permitir alertas creadas mediante reglas personalizadas."
              value={
                preferences
                  .watchlistTypes
                  .radarRule
              }
              disabled={
                saving ||
                !preferences
                  .enabled
              }
              onValueChange={
                (
                  value
                ) =>
                  changeWatchlistType(
                    "radarRule",
                    value
                  )
              }
            />
          </View>

          <View
            style={
              styles.infoBox
            }
          >
            <Text
              style={
                styles.infoTitle
              }
            >
              🔴 RED CARD PRESSURE
            </Text>

            <Text
              style={
                styles.infoText
              }
            >
              Por ahora las notificaciones automáticas se generan cuando Football Radar confirma una tarjeta roja y detecta presión clara o fuerte del equipo con ventaja numérica.
            </Text>
          </View>

          <Text
            style={
              styles.updated
            }
          >
            Última actualización:{" "}
            {new Date(
              preferences
                .updatedAt
            ).toLocaleString()}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,

      backgroundColor:
        "#0E1015",
    },

    content: {
      paddingHorizontal:
        18,

      paddingTop:
        48,

      paddingBottom:
        80,
    },

    loadingScreen: {
      flex:
        1,

      backgroundColor:
        "#0E1015",

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    loadingText: {
      color:
        "#8C95A3",

      marginTop:
        12,
    },

    header: {
      minHeight:
        34,

      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",
    },

    back: {
      color:
        "#91A9FF",

      fontSize:
        16,

      fontWeight:
        "600",
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        28,

      fontWeight:
        "800",

      marginTop:
        14,
    },

    subtitle: {
      color:
        "#7E8796",

      lineHeight:
        20,

      marginTop:
        7,

      marginBottom:
        24,
    },

    section: {
      backgroundColor:
        "#171A20",

      borderWidth:
        1,

      borderColor:
        "#292E38",

      borderRadius:
        17,

      padding:
        16,

      marginBottom:
        14,
    },

    disabledSection: {
      opacity:
        0.55,
    },

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "800",

      marginBottom:
        4,
    },

    sectionHint: {
      color:
        "#777F8D",

      fontSize:
        12,

      lineHeight:
        17,

      marginBottom:
        12,
    },

    row: {
      minHeight:
        67,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      borderTopWidth:
        1,

      borderTopColor:
        "#252A33",

      paddingVertical:
        11,

      gap:
        15,
    },

    rowText: {
      flex:
        1,
    },

    rowTitle: {
      color:
        "#ECEEF2",

      fontSize:
        14,

      fontWeight:
        "700",
    },

    rowDescription: {
      color:
        "#717986",

      fontSize:
        11,

      lineHeight:
        16,

      marginTop:
        3,
    },

    strengthRow: {
      flexDirection:
        "row",

      gap:
        10,

      marginTop:
        10,
    },

    strengthButton: {
      flex:
        1,

      backgroundColor:
        "#111319",

      borderWidth:
        1,

      borderColor:
        "#303640",

      borderRadius:
        12,

      padding:
        13,
    },

    strengthButtonSelected: {
      borderColor:
        "#D0A934",

      backgroundColor:
        "#282313",
    },

    strengthTitle: {
      color:
        "#AAB0BA",

      fontSize:
        13,

      fontWeight:
        "900",
    },

    strengthTextSelected: {
      color:
        "#F0CB59",
    },

    strengthDescription: {
      color:
        "#737B87",

      fontSize:
        10,

      marginTop:
        3,
    },

    explanation: {
      color:
        "#767E89",

      fontSize:
        11,

      lineHeight:
        17,

      marginTop:
        12,
    },

    infoBox: {
      backgroundColor:
        "#221A1C",

      borderWidth:
        1,

      borderColor:
        "#543039",

      borderRadius:
        15,

      padding:
        15,
    },

    infoTitle: {
      color:
        "#FF6D79",

      fontSize:
        12,

      fontWeight:
        "900",
    },

    infoText: {
      color:
        "#A99196",

      fontSize:
        12,

      lineHeight:
        18,

      marginTop:
        7,
    },

    errorBox: {
      backgroundColor:
        "#2B171A",

      borderColor:
        "#633038",

      borderWidth:
        1,

      borderRadius:
        12,

      padding:
        12,

      marginBottom:
        16,
    },

    errorText: {
      color:
        "#FF8790",
    },

    retry: {
      color:
        "#91A9FF",

      fontWeight:
        "700",

      marginTop:
        8,
    },

    updated: {
      color:
        "#555D68",

      fontSize:
        10,

      textAlign:
        "center",

      marginTop:
        16,
    },
  });
