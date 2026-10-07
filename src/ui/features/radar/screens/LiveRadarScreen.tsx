import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useRadarStore,
} from "../../../../store/radarStore";


import {
  useRadarReviewStore,
} from "@/features/radar-review/store/radarReviewStore";

import {
  useRadarRealtime,
} from "../hooks/useRadarRealtime";

import {
  useWatchlistAlertStore,
} from "../../../../store/watchlistAlertStore";

import WatchlistAlertBanner from "../../watchlist/components/WatchlistAlertBanner";

import {
  useRadarPolling,
} from "../hooks/useRadarPolling";

import LiveMatchCard from "../components/LiveMatchCard";

import RadarSignalCard from "../components/RadarSignalCard";

import RedCardMatchCard from "../components/RedCardMatchCard";

import {
  router,
} from "expo-router";

import type {
  LiveMatch,
} from "../../../../types/radar";

import {
  getPreferredMatchSource,
} from "../utils/matchSource";

import RadarTabs, {
  type RadarTab,
} from "../components/RadarTabs";

function normalize(
  value: string
): string {

  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase();
}

export default function LiveRadarScreen() {

  useRadarRealtime();

  useRadarPolling();

  const [
    tab,
    setTab,
  ] =
    useState<RadarTab>(
      "live"
    );

	const watchlistAlerts =
  useWatchlistAlertStore(
    (
      state
    ) =>
      state.alerts
  );

const unreadAlerts =
  useWatchlistAlertStore(
    (
      state
    ) =>
      state.unreadCount
  );

const dismissWatchlistAlert =
  useWatchlistAlertStore(
    (
      state
    ) =>
      state.dismiss
  );

const latestWatchlistAlert =
  watchlistAlerts[0] ??
  null;

const loadRadarReviews =
  useRadarReviewStore(
    (
      state
    ) =>
      state.load
  );

  useEffect(
  () => {
    void loadRadarReviews();
  },
  [
    loadRadarReviews,
  ]
);

const {
  liveMatches,
  redCardMatches,
  recentSignals,
  country,
  loading,
  socketConnected,
  error,
  setCountry,
  refresh,
} =
  useRadarStore();
  const [
    countryInput,
    setCountryInput,
  ] =
    useState(
      country ?? ""
    );

  useEffect(
    () => {
      void refresh();
    },
    []
  );

  const openMatch =
  (
    match:
      LiveMatch
  ) => {

    const source =
      getPreferredMatchSource(
        match
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

  const visibleSignals =
    useMemo(
      () => {

        if (!country) {
          return recentSignals;
        }

        const target =
          normalize(
            country
          );

        return recentSignals.filter(
          (
            item
          ) =>
            normalize(
              item.signal
                .match
                .competition
                .country
            ) ===
            target
        );
      },

      [
        recentSignals,
        country,
      ]
    );

  const applyCountry =
    async () => {

      setCountry(
        countryInput
      );

      await refresh();
    };

  const clearCountry =
    async () => {

      setCountryInput(
        ""
      );

      setCountry(
        undefined
      );

      await refresh();
    };

return (
  <ScrollView
    style={
      styles.screen
    }
    contentContainerStyle={
      styles.content
    }
    refreshControl={
      <RefreshControl
        refreshing={
          loading
        }
        onRefresh={
          refresh
        }
      />
    }
  >
    {/* =========================
        HEADER
    ========================== */}
    <View
      style={
        styles.header
      }
    >
      <View>
        <Text
          style={
            styles.title
          }
        >
          Football Radar
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Monitoreo mundial en vivo
        </Text>
      </View>

      <View
        style={
          styles.connection
        }
      >
        <View
          style={[
            styles.dot,

            socketConnected
              ? styles.dotOnline
              : styles.dotOffline,
          ]}
        />

        <Text
          style={
            styles.connectionText
          }
        >
          {socketConnected
            ? "Live"
            : "Offline"}
        </Text>
      </View>
    </View>

    {/* =========================
        ÚLTIMA ALERTA WATCHLIST
    ========================== */}
    {latestWatchlistAlert && (
      <WatchlistAlertBanner
        entry={
          latestWatchlistAlert
        }
        onPress={
          () =>
            router.push(
              "/alerts"
            )
        }
        onDismiss={
          () =>
            dismissWatchlistAlert(
              latestWatchlistAlert.id
            )
        }
      />
    )}

    {/* =========================
        FILTRO POR PAÍS
    ========================== */}
    <View
      style={
        styles.filter
      }
    >
      <TextInput
        value={
          countryInput
        }
        onChangeText={
          setCountryInput
        }
        onSubmitEditing={
          applyCountry
        }
        placeholder="País: Bolivia, Russia, Cuba..."
        placeholderTextColor="#687182"
        autoCapitalize="words"
        style={
          styles.input
        }
      />

      <View
        style={
          styles.filterActions
        }
      >
        <TouchableOpacity
          onPress={
            applyCountry
          }
          style={
            styles.filterButton
          }
        >
          <Text
            style={
              styles.filterButtonText
            }
          >
            Aplicar
          </Text>
        </TouchableOpacity>

        {!!country && (
          <TouchableOpacity
            onPress={
              clearCountry
            }
            style={
              styles.clearButton
            }
          >
            <Text
              style={
                styles.clearText
              }
            >
              Todos
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    {/* =========================
        TABS
    ========================== */}
    <RadarTabs
      value={
        tab
      }
      liveCount={
        liveMatches.length
      }
      redCardCount={
        redCardMatches.length
      }
      signalCount={
        visibleSignals.length
      }
      onChange={
        setTab
      }
    />

    {/* =========================
        ACCESOS RÁPIDOS
    ========================== */}
    <View
      style={
        styles.quickActions
      }
    >
      <TouchableOpacity
        style={
          styles.watchlistShortcut
        }
        onPress={
          () =>
            router.push(
              "/watchlist"
            )
        }
      >
        <Text
          style={
            styles.watchlistShortcutText
          }
        >
          ⭐ Ver Watchlist
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={
          styles.alertCenterButton
        }
        onPress={
          () =>
            router.push(
              "/alerts"
            )
        }
      >
        <Text
          style={
            styles.alertCenterText
          }
        >
          🔔 Alertas
          {unreadAlerts > 0
            ? ` (${unreadAlerts})`
            : ""}
        </Text>
      </TouchableOpacity>
		<TouchableOpacity
  style={
    styles.settingsButton
  }
  onPress={
    () =>
      router.push(
        "/settings"
      )
  }
>
  <Text
    style={
      styles.settingsButtonText
    }
  >
    ⚙ Ajustes de alertas
  </Text>
</TouchableOpacity>
		<TouchableOpacity
  style={styles.rulesButton}
  onPress={() =>
    router.push(
      "/rules"
    )
  }
>
  <Text
    style={styles.rulesButtonText}
  >
    🔔 Reglas del Radar
  </Text>
</TouchableOpacity>
    </View>

    {/* =========================
        ERROR
    ========================== */}
    {!!error && (
      <View
        style={
          styles.errorBox
        }
      >
        <Text
          style={
            styles.error
          }
        >
          {error}
        </Text>
      </View>
    )}

    {/* =========================
        LOADING INICIAL
    ========================== */}
    {loading &&
      liveMatches.length ===
        0 && (
        <ActivityIndicator
          size="large"
        />
      )}

    {/* =========================
        TODOS LOS PARTIDOS LIVE
    ========================== */}
    {tab ===
      "live" && (
      <>
        {liveMatches.map(
          (
            match,
            index
          ) => {

            const source =
              match.sources[0];

            return (
              <LiveMatchCard
                key={
                  source
                    ? `${source.provider}:${source.externalId}`
                    : `${match.home.name}:${match.away.name}:${index}`
                }
                match={
                  match
                }
                onPress={
                  () =>
                    openMatch(
                      match
                    )
                }
              />
            );
          }
        )}

        {!loading &&
          liveMatches.length ===
            0 && (
            <Text
              style={
                styles.empty
              }
            >
              No hay partidos en vivo con este filtro.
            </Text>
          )}
      </>
    )}

    {/* =========================
        PARTIDOS CON ROJAS
    ========================== */}
    {tab ===
      "red-cards" && (
      <>
        {redCardMatches.map(
          (
            item,
            index
          ) => {

            const source =
              item.match
                .sources[0];

            return (
              <RedCardMatchCard
                key={
                  source
                    ? `${source.provider}:${source.externalId}`
                    : `${item.match.home.name}:${index}`
                }
                item={
                  item
                }
                onPress={
                  () =>
                    openMatch(
                      item.match
                    )
                }
              />
            );
          }
        )}

        {!loading &&
          redCardMatches.length ===
            0 && (
            <Text
              style={
                styles.empty
              }
            >
              No se detectan expulsiones actualmente.
            </Text>
          )}
      </>
    )}

    {/* =========================
        SEÑALES RADAR
    ========================== */}
    {tab ===
      "signals" && (
      <>
        {visibleSignals.map(
          (
            item,
            index
          ) => (
            <RadarSignalCard
              key={
                `${item.publishedAt}-${index}`
              }
              item={
                item
              }
              onPress={
                () =>
                  openMatch(
                    item.signal.match
                  )
              }
            />
          )
        )}

        {visibleSignals.length ===
          0 && (
          <Text
            style={
              styles.empty
            }
          >
            Aún no hay señales de presión con expulsión.
          </Text>
        )}
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
quickActions: {
  flexDirection:
    "row",

  gap:
    10,

  marginBottom:
    18,
},
    content: {
      padding:
        18,

      paddingTop:
        54,

      paddingBottom:
        80,
    },

    header: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom:
        22,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        26,

      fontWeight:
        "800",
    },

    subtitle: {
      color:
        "#7E8796",

      marginTop:
        4,
    },

    connection: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap:
        6,
    },

    dot: {
      width:
        8,

      height:
        8,

      borderRadius:
        4,
    },

    dotOnline: {
      backgroundColor:
        "#52D273",
    },

    dotOffline: {
      backgroundColor:
        "#F06464",
    },

    connectionText: {
      color:
        "#A8AFBA",

      fontSize:
        12,
    },

    filter: {
      marginBottom:
        16,
    },

    input: {
      backgroundColor:
        "#171A21",

      borderColor:
        "#292E39",

      borderWidth:
        1,

      borderRadius:
        13,

      paddingHorizontal:
        14,

      paddingVertical:
        12,

      color:
        "#FFFFFF",
    },

    filterActions: {
      flexDirection:
        "row",

      gap:
        8,

      marginTop:
        8,
    },

    filterButton: {
      flex:
        1,

      backgroundColor:
        "#2458E8",

      borderRadius:
        12,

      alignItems:
        "center",

      padding:
        12,
    },

    filterButtonText: {
      color:
        "#FFFFFF",

      fontWeight:
        "700",
    },

    clearButton: {
      paddingHorizontal:
        20,

      borderRadius:
        12,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#20242D",
    },

    clearText: {
      color:
        "#A8B7E8",

      fontWeight:
        "600",
    },

    errorBox: {
      backgroundColor:
        "#321A1E",

      padding:
        12,

      borderRadius:
        10,

      marginBottom:
        16,
    },

    error: {
      color:
        "#FF8790",
    },

    empty: {
      color:
        "#747D8B",

      textAlign:
        "center",

      marginTop:
        40,

      marginBottom:
        40,
    },
	watchlistShortcut: {
  backgroundColor:
    "#1A1E27",

  borderWidth:
    1,

  borderColor:
    "#303745",

  borderRadius:
    12,

  alignItems:
    "center",

  paddingVertical:
    11,

  marginTop:
    -8,

  marginBottom:
    18,
},

watchlistShortcutText: {
  color:
    "#E6C55A",

  fontWeight:
    "700",
},
alertCenterButton: {
  backgroundColor:
    "#201C13",

  borderColor:
    "#4A4024",

  borderWidth:
    1,

  borderRadius:
    12,

  paddingVertical:
    11,

  alignItems:
    "center",

  marginBottom:
    18,
},

alertCenterText: {
  color:
    "#E4C75B",

  fontWeight:
    "700",
},
settingsButton: {
  backgroundColor:
    "#181B21",

  borderColor:
    "#303540",

  borderWidth:
    1,

  borderRadius:
    12,

  paddingVertical:
    11,

  alignItems:
    "center",

  marginBottom:
    18,
},

settingsButtonText: {
  color:
    "#B9C0CC",

  fontWeight:
    "700",
},
rulesButton: {
  backgroundColor:
    "#181B21",

  borderColor:
    "#303540",

  borderWidth:
    1,

  borderRadius:
    12,

  paddingVertical:
    11,

  alignItems:
    "center",

  marginBottom:
    18,
},

rulesButtonText: {
  color:
    "#B9C0CC",

  fontWeight:
    "700",
},
  });
