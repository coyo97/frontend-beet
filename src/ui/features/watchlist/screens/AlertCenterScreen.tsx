import React, {
  useEffect,
} from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  showTestNotification,
} from "../../../../notifications/notificationService";

import {
  router,
} from "expo-router";

import {
  useWatchlistAlertStore,
} from "../../../../store/watchlistAlertStore";

import {
  getPreferredMatchSource,
} from "../../radar/utils/matchSource";

import type {
  WatchlistAlertEntry,
} from "../../../../types/watchlist";

export default function AlertCenterScreen() {

  const alerts =
    useWatchlistAlertStore(
      (
        state
      ) =>
        state.alerts
    );

  const markAllRead =
    useWatchlistAlertStore(
      (
        state
      ) =>
        state.markAllRead
    );

  const clear =
    useWatchlistAlertStore(
      (
        state
      ) =>
        state.clear
    );

  useEffect(
    () => {
      markAllRead();
    },
    [
      markAllRead,
    ]
  );

  const openMatch =
    (
      entry:
        WatchlistAlertEntry
    ) => {

      const source =
        getPreferredMatchSource(
          entry.payload
            .signal
            .match
        );

      if (!source) {
        return;
      }

      router.push({
        pathname:
          "/match/[provider]/[id]",

        params: {
          provider:
            source.provider,

          id:
            source.externalId,
        },
      });
    };

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
          styles.top
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

        {alerts.length >
          0 && (
          <TouchableOpacity
            onPress={
              clear
            }
          >
            <Text
              style={
                styles.clear
              }
            >
              Limpiar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={
          styles.title
        }
      >
        Alertas
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Señales detectadas en elementos de tu Watchlist.
      </Text>
<TouchableOpacity
  style={
    styles.testButton
  }
  onPress={
    () => {
      void showTestNotification();
    }
  }
>
  <Text
    style={
      styles.testButtonText
    }
  >
    🔔 Probar notificación
  </Text>
</TouchableOpacity>
      {alerts.map(
        (
          entry
        ) => {

          const {
            signal,
            watchlistItem,
            matchedBy,
          } =
            entry.payload;

          const match =
            signal.match;

          return (
            <TouchableOpacity
              key={
                entry.id
              }
              activeOpacity={
                0.85
              }
              onPress={
                () =>
                  openMatch(
                    entry
                  )
              }
              style={
                styles.card
              }
            >
              <View
                style={
                  styles.badgeRow
                }
              >
                <Text
                  style={
                    styles.badge
                  }
                >
                  ⭐ WATCHLIST
                </Text>

                <Text
                  style={
                    styles.minute
                  }
                >
                  {match.status
                    .minute !==
                  null
                    ? `${match.status.minute}'`
                    : match.status
                        .short}
                </Text>
              </View>

              <Text
                style={
                  styles.match
                }
              >
                {match.home.name}
                {"  "}
                {match.home.goals ??
                  "-"}
                {" - "}
                {match.away.goals ??
                  "-"}
                {"  "}
                {match.away.name}
              </Text>

              <Text
                style={
                  styles.competition
                }
              >
                {match
                  .competition
                  .country}
                {" · "}
                {match
                  .competition
                  .name}
              </Text>

              <View
                style={
                  styles.signalBox
                }
              >
                <Text
                  style={
                    styles.signal
                  }
                >
                  🔴 Rojas:{" "}
                  {signal.redCards
                    .home}
                  {" - "}
                  {signal.redCards
                    .away}
                </Text>

                <Text
                  style={
                    styles.signal
                  }
                >
                  🔥 Presión:{" "}
                  {signal.pressure
                    .homeScore}
                  {" - "}
                  {signal.pressure
                    .awayScore}
                </Text>

                <Text
                  style={
                    styles.signal
                  }
                >
                  Intensidad:{" "}
                  {signal.strength}
                </Text>
              </View>

              <Text
                style={
                  styles.reason
                }
              >
                Coincidencia por{" "}
                {matchedBy}
                {" · "}
                {watchlistItem.label}
              </Text>

              <Text
                style={
                  styles.time
                }
              >
                {new Date(
                  entry.receivedAt
                ).toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
          );
        }
      )}

      {alerts.length ===
        0 && (
        <View
          style={
            styles.empty
          }
        >
          <Text
            style={
              styles.emptyIcon
            }
          >
            🔔
          </Text>

          <Text
            style={
              styles.emptyTitle
            }
          >
            Sin alertas
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Cuando el Radar encuentre una señal relacionada con tu Watchlist aparecerá aquí.
          </Text>
        </View>
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
      padding:
        18,

      paddingTop:
        50,

      paddingBottom:
        80,
    },

    top: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      marginBottom:
        20,
    },

    back: {
      color:
        "#91A9FF",

      fontSize:
        16,

      fontWeight:
        "600",
    },

    clear: {
      color:
        "#FF7883",

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
    },

    subtitle: {
      color:
        "#7E8796",

      marginTop:
        5,

      marginBottom:
        22,
    },

    card: {
      backgroundColor:
        "#191A1C",

      borderRadius:
        16,

      borderWidth:
        1,

      borderColor:
        "#393322",

      padding:
        16,

      marginBottom:
        12,
    },

    badgeRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",
    },

    badge: {
      color:
        "#E5C457",

      fontSize:
        10,

      fontWeight:
        "900",
    },

    minute: {
      color:
        "#FF6975",

      fontWeight:
        "800",
    },

    match: {
      color:
        "#FFFFFF",

      fontSize:
        16,

      fontWeight:
        "700",

      marginTop:
        10,
    },

    competition: {
      color:
        "#818A98",

      fontSize:
        11,

      marginTop:
        5,
    },

    signalBox: {
      marginTop:
        13,

      gap:
        4,
    },

    signal: {
      color:
        "#CEC7B5",

      fontSize:
        12,
    },

    reason: {
      color:
        "#A08E59",

      fontSize:
        11,

      marginTop:
        12,
    },

    time: {
      color:
        "#646B76",

      fontSize:
        10,

      marginTop:
        7,
    },

    empty: {
      alignItems:
        "center",

      marginTop:
        80,

      paddingHorizontal:
        30,
    },

    emptyIcon: {
      fontSize:
        42,
    },

    emptyTitle: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "700",

      marginTop:
        14,
    },

    emptyText: {
      color:
        "#727B88",

      textAlign:
        "center",

      lineHeight:
        20,

      marginTop:
        7,
    },
	testButton: {
  backgroundColor:
    "#242832",

  borderWidth:
    1,

  borderColor:
    "#4C566A",

  borderRadius:
    12,

  paddingVertical:
    12,

  alignItems:
    "center",

  marginBottom:
    20,
},

testButtonText: {
  color:
    "#FFFFFF",

  fontWeight:
    "700",
}
  });
