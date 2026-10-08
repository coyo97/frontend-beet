import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewToken,
} from "react-native";

import {
  RedCardsTab,
} from "@/features/radar/components/red-cards/RedCardsTab";

import {
  useSharedMatchStore,
} from "@/features/shared-match/store/sharedMatchStore";

import {
  LiveMatchesTab,
} from "@/features/radar/components/live/LiveMatchesTab";

import {
  useSharedMatchRealtime,
} from "@/features/shared-match/hooks/useSharedMatchRealtime";

import {
  buildLiveCountryOptions,
  buildLiveLeagueOptions,
  filterLiveMatchesByCompetition,
} from "@/features/radar/utils/liveCompetitionFilter";

import {
  router,
} from "expo-router";

import {
  useRadarStore,
} from "@/store/radarStore";

import {
  compareLiveMatchesByProgress,
  withEstimatedLiveMinute,
} from "@/features/radar/utils/liveMatchTime";

import {
  useWatchlistAlertStore,
} from "@/store/watchlistAlertStore";

import {
  radarReviewKey,
  useRadarReviewStore,
} from "@/features/radar-review/store/radarReviewStore";

import {
  RadarReviewFilter,
  type RadarReviewFilterValue,
} from "@/features/radar-review/components/RadarReviewFilter";

import {
  AllMatchContextCard,
} from "@/features/radar/components/AllMatchContextCard";

/*
 * Temporalmente seguimos usando estos
 * componentes/hooks desde ui/features
 * mientras terminamos la migración.
 */
import {
  useRadarRealtime,
} from "@/ui/features/radar/hooks/useRadarRealtime";

import {
  useRadarPolling,
} from "@/ui/features/radar/hooks/useRadarPolling";

import RadarSignalCard
  from "@/ui/features/radar/components/RadarSignalCard";

import RedCardMatchCard
  from "@/ui/features/radar/components/RedCardMatchCard";

import RadarTabs, {
  type RadarTab,
} from "@/ui/features/radar/components/RadarTabs";

import WatchlistAlertBanner
  from "@/ui/features/watchlist/components/WatchlistAlertBanner";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  styles,
} from "./LiveRadarScreen.styles";

import {
  RadarSignalsTab,
} from "@/features/radar/components/signals/RadarSignalsTab";

/*
 * ========================================
 * HELPERS
 * ========================================
 */

function normalize(
  value:
    string
): string {

  return value
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase();
}

function liveMatchKey(
  match:
    LiveMatch
): string {

  const source =
    getPreferredMatchSource(
      match
    );

  if (source) {
    return (
      `${source.provider}:` +
      source.externalId
    );
  }

  return [
    match.home.name,
    match.away.name,
    match.kickoffAt,
  ].join(
    ":"
  );
}

/*
 * ========================================
 * SCREEN
 * ========================================
 */

export default function LiveRadarScreen() {

  /*
   * ========================================
   * REALTIME / POLLING
   * ========================================
   */

useRadarRealtime();

useSharedMatchRealtime();

useRadarPolling();

  /*
   * ========================================
   * LOCAL STATE
   * ========================================
   */

  const [
    tab,
    setTab,
  ] =
    useState<RadarTab>(
      "live"
    );

  const [
    redReviewFilter,
    setRedReviewFilter,
  ] =
    useState<
      RadarReviewFilterValue
    >(
      "all"
    );

const [
  liveCountryFilter,
  setLiveCountryFilter,
] =
  useState<
    string | null
  >(
    null
  );

  const unreadSharedMatches =
  useSharedMatchStore(
    state =>
      state.unreadCount
  );

const [
  liveLeagueFilter,
  setLiveLeagueFilter,
] =
  useState<
    string | null
  >(
    null
  );
  /*
   * ========================================
   * RADAR STORE
   *
   * IMPORTANTE:
   * Esto tiene que estar ANTES del memo
   * visibleRedCardMatches.
   * ========================================
   */

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

    /*
   * ========================================
   * LOCAL LIVE CLOCK
   *
   * Solo actualiza la UI.
   * NO hace peticiones HTTP.
   * ========================================
   */

  const [
    localNowMs,
    setLocalNowMs,
  ] =
    useState(
      Date.now()
    );



  /*
   * Un tick cada 15 segundos.
   *
   * El minuto visible solo cambiará
   * aproximadamente una vez por minuto,
   * pero así no dependemos de caer justo
   * sobre el cambio de minuto.
   */
  useEffect(
    () => {

      const timer =
        setInterval(
          () => {
            setLocalNowMs(
              Date.now()
            );
          },
          15_000
        );

      return () => {
        clearInterval(
          timer
        );
      };
    },
    []
  );

  /*
   * Cuando llegan datos reales nuevos,
   * reiniciamos la referencia del reloj
   * local.
   */
 

  /*
   * - recién iniciados arriba
   * - partidos avanzados abajo
   * - minuto visual actualizado localmente
   */
const orderedLiveMatches =
  useMemo(
    () => {

      const ordered =
        [...liveMatches]
          .sort(
            (
              left,
              right
            ) =>
              compareLiveMatchesByProgress(
                left,
                right,
                localNowMs
              )
          );

      return ordered.map(
        match =>
          withEstimatedLiveMinute(
            match,
            localNowMs
          )
      );
    },
    [
      liveMatches,
      localNowMs,
    ]
  );



  const liveCountryOptions =
  useMemo(
    () =>
      buildLiveCountryOptions(
        orderedLiveMatches
      ),
    [
      orderedLiveMatches,
    ]
  );

  useEffect(
  () => {
    if (
      !liveCountryFilter
    ) {
      return;
    }

    const exists =
      liveCountryOptions
        .some(
          (
            item
          ) =>
            item.value ===
            liveCountryFilter
        );

    if (!exists) {
      setLiveCountryFilter(
        null
      );

      setLiveLeagueFilter(
        null
      );
    }
  },
  [
    liveCountryFilter,
    liveCountryOptions,
  ]
);
const liveLeagueOptions =
  useMemo(
    () =>
      buildLiveLeagueOptions(
        orderedLiveMatches,
        liveCountryFilter
      ),
    [
      orderedLiveMatches,
      liveCountryFilter,
    ]
  );

useEffect(
  () => {
    if (
      !liveLeagueFilter
    ) {
      return;
    }

    const exists =
      liveLeagueOptions
        .some(
          (
            item
          ) =>
            item.value ===
            liveLeagueFilter
        );

    if (!exists) {
      setLiveLeagueFilter(
        null
      );
    }
  },
  [
    liveLeagueFilter,
    liveLeagueOptions,
  ]
);



const visibleLiveMatches =
  useMemo(
    () =>
      filterLiveMatchesByCompetition(
        orderedLiveMatches,
        liveCountryFilter,
        liveLeagueFilter
      ),
    [
      orderedLiveMatches,
      liveCountryFilter,
      liveLeagueFilter,
    ]
  );

  const selectLiveCountry =
  (
    value:
      string | null
  ) => {
    setLiveCountryFilter(
      value
    );

    /*
     * Al cambiar de país,
     * una liga seleccionada
     * anteriormente deja de
     * tener sentido.
     */
    setLiveLeagueFilter(
      null
    );
  };

const selectLiveLeague =
  (
    value:
      string | null
  ) => {
    setLiveLeagueFilter(
      value
    );
  };

  /*
   * ========================================
   * RADAR REVIEW STORE
   * ========================================
   */

  const radarReviews =
    useRadarReviewStore(
      (
        state
      ) =>
        state.items
    );

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

  /*
   * ========================================
   * WATCHLIST ALERT STORE
   * ========================================
   */

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

  /*
   * ========================================
   * COUNTRY FILTER STATE
   * ========================================
   */

  const [
    countryInput,
    setCountryInput,
  ] =
    useState(
      country ??
      ""
    );

  /*
   * ========================================
   * INITIAL REFRESH
   * ========================================
   */

  useEffect(
    () => {
      void refresh();
    },
    [
      refresh,
    ]
  );

  /*
   * ========================================
   * COUNTRY ACTIONS
   * ========================================
   */

  const applyCountry =
    async () => {

      const value =
        countryInput
          .trim();

      setCountry(
        value ||
        undefined
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

  /*
   * ========================================
   * NAVIGATION
   * ========================================
   */

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

  /*
   * ========================================
   * SIGNAL FILTER
   * ========================================
   */

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

  /*
   * ========================================
   * RED CARD REVIEW FILTER
   *
   * IMPORTANTE:
   * Solo existe UNA declaración.
   * Y ocurre después de tener:
   *
   * - redCardMatches
   * - radarReviews
   * - redReviewFilter
   * ========================================
   */

  const visibleRedCardMatches =
    useMemo(
      () => {

        if (
          redReviewFilter ===
          "all"
        ) {
          return redCardMatches;
        }

        return redCardMatches.filter(
          (
            item
          ) => {

            const source =
              getPreferredMatchSource(
                item.match
              );

            /*
             * Si por alguna razón no
             * podemos identificar la
             * fuente, todavía se trata
             * como una roja nueva.
             */
            if (!source) {
              return (
                redReviewFilter ===
                "new"
              );
            }

            const review =
              radarReviews[
                radarReviewKey(
                  source.provider,
                  source.externalId
                )
              ];

            const status =
              review?.status ??
              "new";

            return (
              status ===
              redReviewFilter
            );
          }
        );
      },

      [
        redCardMatches,
        radarReviews,
        redReviewFilter,
      ]
    );

  /*
   * ========================================
   * FLATLIST VIEWABILITY
   *
   * Solo cargamos MatchContext para
   * partidos live visibles.
   * ========================================
   */

  const [
    visibleLiveKeys,
    setVisibleLiveKeys,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  const viewabilityConfig =
    useRef({
      itemVisiblePercentThreshold:
        30,

      minimumViewTime:
        150,
    }).current;

  const onViewableLiveItemsChanged =
    useRef(
      (
        {
          viewableItems,
        }: {
          viewableItems:
            Array<
              ViewToken<LiveMatch>
            >;
        }
      ) => {

        const keys =
          new Set<
            string
          >();

        for (
          const token
          of viewableItems
        ) {

          if (!token.item) {
            continue;
          }

          keys.add(
            liveMatchKey(
              token.item
            )
          );
        }

        setVisibleLiveKeys(
          keys
        );
      }
    ).current;

  /*
   * ========================================
   * INITIAL LOADING
   * ========================================
   */

  const currentTabIsEmpty =
    tab ===
      "live"
      ? liveMatches.length ===
        0
      : tab ===
          "red-cards"
        ? visibleRedCardMatches.length ===
          0
        : visibleSignals.length ===
          0;

  const showInitialLoading =
    loading &&
    currentTabIsEmpty;

  /*
   * ========================================
   * SHARED LIST HEADER
   * ========================================
   */

  const listHeader =
    (
      <>
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
            WATCHLIST ALERT
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
            COUNTRY FILTER
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
              () => {
                void applyCountry();
              }
            }
            placeholder="País: Bolivia, Russia, Cuba..."
            placeholderTextColor="#687182"
            autoCapitalize="words"
            returnKeyType="search"
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
              activeOpacity={
                0.8
              }
              onPress={
                () => {
                  void applyCountry();
                }
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
                activeOpacity={
                  0.8
                }
                onPress={
                  () => {
                    void clearCountry();
                  }
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
            MAIN TABS
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
            RED CARD STATE FILTER
        ========================== */}

        {tab ===
          "red-cards" && (
          <RadarReviewFilter
            value={
              redReviewFilter
            }
            onChange={
              setRedReviewFilter
            }
          />
        )}

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <View
          style={
            styles.quickActions
          }
        >
          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              styles.quickActionButton,
              styles.watchlistShortcut,
            ]}
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
              ⭐ Watchlist
            </Text>
          </TouchableOpacity>
			<TouchableOpacity
  style={
    styles.watchlistShortcut
  }
  onPress={
    () =>
      router.push(
        "/recent"
      )
  }
>
  <Text
    style={
      styles.watchlistShortcutText
    }
  >
    🕘 Partidos recientes
  </Text>
</TouchableOpacity>
			<TouchableOpacity
  style={
    styles.watchlistShortcut
  }
  onPress={
    () =>
      router.push(
        "/opportunities"
      )
  }
>
  <Text
    style={
      styles.watchlistShortcutText
    }
  >
    🎯 Radar de oportunidades
  </Text>
</TouchableOpacity>
			<TouchableOpacity
  style={
    styles.watchlistShortcut
  }
  onPress={
    () =>
      router.push(
        "/my-teams"
      )
  }
>
  <Text
    style={
      styles.watchlistShortcutText
    }
  >
    🧠 Mis equipos
  </Text>
</TouchableOpacity>

			<TouchableOpacity
  activeOpacity={
    0.8
  }
  style={[
    styles.quickActionButton,
    styles.watchlistShortcut,
  ]}
  onPress={
    () =>
      router.push(
        "/shared"
      )
  }
>
  <Text
    style={
      styles.watchlistShortcutText
    }
  >
    👥 Compartidos
    {unreadSharedMatches >
    0
      ? ` (${unreadSharedMatches})`
      : ""}
  </Text>
</TouchableOpacity>

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              styles.quickActionButton,
              styles.alertCenterButton,
            ]}
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
              {unreadAlerts >
              0
                ? ` (${unreadAlerts})`
                : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              styles.quickActionButton,
              styles.settingsButton,
            ]}
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
              ⚙ Ajustes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              styles.quickActionButton,
              styles.rulesButton,
            ]}
            onPress={
              () =>
                router.push(
                  "/rules"
                )
            }
          >
            <Text
              style={
                styles.rulesButtonText
              }
            >
              📡 Reglas
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
            INITIAL LOADING
        ========================== */}

        {showInitialLoading && (
          <View
            style={
              styles.initialLoader
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
              Actualizando Radar...
            </Text>
          </View>
        )}
      </>
    );

  /*
   * ========================================
   * COMMON REFRESH CONTROL
   * ========================================
   */

  const refreshControl =
    (
      <RefreshControl
        refreshing={
          loading
        }
        onRefresh={
          () => {
            void refresh();
          }
        }
      />
    );

  /*
   * ========================================
   * LIVE
   * ========================================
   */
if (
  tab ===
  "live"
) {
  return (
    <LiveMatchesTab
      matches={
        orderedLiveMatches
      }

      loading={
        loading
      }

      header={
        listHeader
      }

      onRefresh={
        () => {
          void refresh();
        }
      }
    />
  );
}

  /*
   * ========================================
   * RED CARDS
   * ========================================
   */

  if (
  tab ===
  "red-cards"
) {
  return (
    <RedCardsTab
      matches={
        visibleRedCardMatches
      }

      totalMatches={
        redCardMatches.length
      }

      loading={
        loading
      }

      header={
        listHeader
      }

      onRefresh={
        () => {
          void refresh();
        }
      }

      onOpenMatch={
        openMatch
      }
    />
  );
}

return (
  <RadarSignalsTab
    signals={
      visibleSignals
    }

    loading={
      loading
    }

    header={
      listHeader
    }

    onRefresh={
      () => {
        void refresh();
      }
    }

    onOpenMatch={
      openMatch
    }
  />
);
}
