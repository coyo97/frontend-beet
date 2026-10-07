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
  LiveCompetitionFilter,
} from "@/features/radar/components/LiveCompetitionFilter";

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
  <View
    style={
      styles.screen
    }
  >
    <FlatList
      key="live-matches-list"

      /*
       * IMPORTANTE:
       *
       * Aquí siguen estando TODOS los partidos.
       *
       * Si tenemos 535:
       * data contiene los 535.
       *
       * FlatList simplemente evita renderizarlos
       * todos simultáneamente.
       */
          data={
  visibleLiveMatches
}
      keyExtractor={
        liveMatchKey
      }

		      maintainVisibleContentPosition={{
        minIndexForVisible:
          0,
      }}

      /*
       * visibleLiveKeys cambia mientras hacemos scroll.
       *
       * Esto garantiza que una tarjeta se actualice
       * cuando pasa a ser visible y puede cargar:
       *
       * - MatchContext
       * - memoria
       * - últimos partidos
       *
       * sin hacerlo para los 535 a la vez.
       */
      extraData={
        visibleLiveKeys
      }

      renderItem={
        ({
          item,
        }) => {

          const key =
            liveMatchKey(
              item
            );

          const contextVisible =
            visibleLiveKeys.has(
              key
            );

          return (
            <AllMatchContextCard
              match={
                item
              }
              contextVisible={
                contextVisible
              }
            />
          );
        }
      }

      ListHeaderComponent={
  <>
    {listHeader}

    <LiveCompetitionFilter
      totalCount={
        orderedLiveMatches
          .length
      }
      visibleCount={
        visibleLiveMatches
          .length
      }
      countries={
        liveCountryOptions
      }
      leagues={
        liveLeagueOptions
      }
      selectedCountry={
        liveCountryFilter
      }
      selectedLeague={
        liveLeagueFilter
      }
      onCountryChange={
        selectLiveCountry
      }
      onLeagueChange={
        selectLiveLeague
      }
    />
  </>
}

      ListEmptyComponent={
        !loading
          ? (
            <Text
              style={
                styles.empty
              }
            >
              No hay partidos en vivo con este filtro.
            </Text>
          )
          : null
      }

      refreshControl={
        refreshControl
      }

      /*
       * Nos permite saber qué partidos
       * están realmente en pantalla.
       */
      onViewableItemsChanged={
        onViewableLiveItemsChanged
      }

      viewabilityConfig={
        viewabilityConfig
      }

      /*
       * Aunque haya 535 partidos,
       * inicialmente React Native
       * construye solamente 8.
       */
      initialNumToRender={
        8
      }

      /*
       * Luego agrega máximo 8
       * por cada tanda.
       */
      maxToRenderPerBatch={
        8
      }

      /*
       * Da tiempo al hilo JS
       * entre lotes.
       */
      updateCellsBatchingPeriod={
        50
      }

      /*
       * Mantiene una ventana relativamente
       * pequeña alrededor de lo visible.
       */
      windowSize={
        7
      }

      /*
       * Lo dejamos FALSE inicialmente.
       *
       * Con tarjetas cuya altura cambia
       * al cargar contexto, Android puede
       * dar problemas visuales si se recortan
       * agresivamente los elementos.
       *
       * Cuando todo quede estable podemos
       * probar true y medir rendimiento.
       */
      removeClippedSubviews={
        false
      }

      keyboardShouldPersistTaps="handled"

      contentContainerStyle={
        styles.listContent
      }
    />
  </View>
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
      <View
        style={
          styles.screen
        }
      >
        <FlatList
  key="red-card-matches-list"

  data={
    visibleRedCardMatches
  }
          keyExtractor={
            (
              item,
              index
            ) => {

              const source =
                getPreferredMatchSource(
                  item.match
                );

              return source
                ? `${source.provider}:${source.externalId}`
                : [
                    item.match.home.name,
                    item.match.away.name,
                    index,
                  ].join(
                    ":"
                  );
            }
          }
          renderItem={
            ({
              item,
            }) => (
              <RedCardMatchCard
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
            )
          }
          ListHeaderComponent={
            listHeader
          }
          ListEmptyComponent={
            !loading
              ? (
                <Text
                  style={
                    styles.empty
                  }
                >
                  {redCardMatches.length ===
                  0
                    ? "No se detectan expulsiones actualmente."
                    : "No hay rojas con este estado."}
                </Text>
              )
              : null
          }
          refreshControl={
            refreshControl
          }
          initialNumToRender={
            6
          }
          maxToRenderPerBatch={
            6
          }
          windowSize={
            6
          }
          removeClippedSubviews={
            true
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.listContent
          }
        />
      </View>
    );
  }

  /*
   * ========================================
   * SIGNALS
   * ========================================
   */

  return (
    <View
      style={
        styles.screen
      }
    >
      <FlatList
        data={
          visibleSignals
        }
        keyExtractor={
          (
            item,
            index
          ) => {

            const source =
              getPreferredMatchSource(
                item.signal
                  .match
              );

            if (source) {
              return [
                source.provider,
                source.externalId,
                item.publishedAt,
              ].join(
                ":"
              );
            }

            return (
              `${item.publishedAt}:` +
              index
            );
          }
        }
        renderItem={
          ({
            item,
          }) => (
            <RadarSignalCard
              item={
                item
              }
              onPress={
                () =>
                  openMatch(
                    item.signal
                      .match
                  )
              }
            />
          )
        }
        ListHeaderComponent={
          listHeader
        }
        ListEmptyComponent={
          !loading
            ? (
              <Text
                style={
                  styles.empty
                }
              >
                Aún no hay señales de presión con expulsión.
              </Text>
            )
            : null
        }
        refreshControl={
          refreshControl
        }
        initialNumToRender={
          6
        }
        maxToRenderPerBatch={
          6
        }
        windowSize={
          6
        }
        removeClippedSubviews={
          true
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.listContent
        }
      />
    </View>
  );
}
