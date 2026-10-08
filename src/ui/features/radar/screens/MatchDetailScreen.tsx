import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MatchContextSummary,
} from "@/features/match-context/components/MatchContextSummary";

import {
  MatchContextUnavailable,
} from "@/features/match-context/components/MatchContextUnavailable/MatchContextUnavailable";

import FollowScopeButton
  from "../../watchlist/components/FollowScopeButton";

  import {
  MatchTeamMemory,
} from "@/features/team-memory/components/MatchTeamMemory";

import {
  MatchCopyActions,
} from "@/features/match-context/components/MatchCopyActions";

import {
  ShareMatchQuickActions,
} from "@/features/shared-match/components/ShareMatchQuickActions";

  import {
  getMatchContextSource,
} from "@/features/match-context/utils/getMatchContextSource";

import {
  useWatchlistStore,
} from "../../../../store/watchlistStore"

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  getMatchPressure,
  getMatchStatistics,
} from "../../../../async/services/matchService";

import {
  useRadarStore,
} from "../../../../store/radarStore";

import type {
  LiveMatch,
  MatchPressureResponse,
  MatchStatisticsResponse,
  RedCardRadarMatch,
} from "../../../../types/radar";

function matchesSource(
  match: LiveMatch,
  provider: string,
  id: string
): boolean {

  return match.sources.some(
    (
      source
    ) =>
      source.provider ===
        provider &&
      source.externalId ===
        id
  );
}

export default function MatchDetailScreen() {

  /*
   * ==========================================
   * ROUTE
   * ==========================================
   */

  const params =
    useLocalSearchParams<{
      provider:
        string;

      id:
        string;
    }>();

  const provider =
    String(
      params.provider ??
      ""
    );

  const id =
    String(
      params.id ??
      ""
    );

  /*
   * ==========================================
   * RADAR STORE
   * ==========================================
   */

  const liveMatches =
    useRadarStore(
      (
        state
      ) =>
        state.liveMatches
    );

  const redCardMatches =
    useRadarStore(
      (
        state
      ) =>
        state.redCardMatches
    );

  const recentSignals =
    useRadarStore(
      (
        state
      ) =>
        state.recentSignals
    );

  /*
   * ==========================================
   * WATCHLIST STORE
   *
   * Una sola lectura de cada valor.
   * Antes tenías items/mutating duplicados.
   * ==========================================
   */

  const watchlistItems =
    useWatchlistStore(
      (
        state
      ) =>
        state.items
    );

  const watchlistLoading =
    useWatchlistStore(
      (
        state
      ) =>
        state.loading
    );

  const watchlistMutating =
    useWatchlistStore(
      (
        state
      ) =>
        state.mutating
    );

  const loadWatchlist =
    useWatchlistStore(
      (
        state
      ) =>
        state.load
    );

  const followCurrentMatch =
    useWatchlistStore(
      (
        state
      ) =>
        state.followMatch
    );

  const followTeam =
    useWatchlistStore(
      (
        state
      ) =>
        state.followTeam
    );

  const followCompetition =
    useWatchlistStore(
      (
        state
      ) =>
        state.followCompetition
    );

  const followCountry =
    useWatchlistStore(
      (
        state
      ) =>
        state.followCountry
    );

  const removeWatchlistItem =
    useWatchlistStore(
      (
        state
      ) =>
        state.remove
    );

  /*
   * ==========================================
   * MATCH
   *
   * Primero resolvemos el partido.
   *
   * IMPORTANTE:
   * matchesSource() permite encontrarlo
   * por cualquiera de sus sources:
   *
   * flashscore
   * fotmob
   * bookmaker
   * api-football
   * etc.
   * ==========================================
   */

  const match =
    useMemo(
      () => {

        const live =
          liveMatches.find(
            (
              item
            ) =>
              matchesSource(
                item,
                provider,
                id
              )
          );

        if (live) {
          return live;
        }

        const red =
          redCardMatches.find(
            (
              item
            ) =>
              matchesSource(
                item.match,
                provider,
                id
              )
          );

        if (red) {
          return red.match;
        }

        const stored =
          recentSignals.find(
            (
              item
            ) =>
              matchesSource(
                item.signal.match,
                provider,
                id
              )
          );

        return (
          stored?.signal
            .match ??
          null
        );
      },
      [
        id,
        provider,
        liveMatches,
        redCardMatches,
        recentSignals,
      ]
    );

  /*
   * ==========================================
   * SOURCES
   * ==========================================
   */

  /*
   * Fuente para MatchContext:
   *
   * prioridad:
   * Flashscore
   * FotMob
   *
   * Bookmaker todavía no tiene
   * MatchContextProvider.
   */
  const contextSource =
    match
      ? getMatchContextSource(
          match
        )
      : null;

  /*
   * Estadísticas y pressure actuales
   * continúan siendo Flashscore.
   *
   * La diferencia importante:
   *
   * NO usamos el provider de la URL.
   *
   * Si entraste por:
   *
   * bookmaker:123
   *
   * pero el partido además contiene:
   *
   * flashscore:ABC
   *
   * seguimos pudiendo cargar stats.
   */
  const flashscoreSource =
    useMemo(
      () => {

        if (!match) {
          return null;
        }

        return (
          match.sources.find(
            (
              source
            ) =>
              source.provider ===
              "flashscore"
          ) ??
          null
        );
      },
      [
        match,
      ]
    );

  const flashscoreExternalId =
    flashscoreSource
      ?.externalId ??
    null;

  /*
   * ==========================================
   * WATCHLIST DERIVED VALUES
   * ==========================================
   */

  const normalize =
    (
      value:
        string
    ) =>
      value
        .trim()
        .toLowerCase();

  const watchlistItem =
    useMemo(
      () => {

        if (!match) {
          return null;
        }

        const sources =
          new Set(
            match.sources.map(
              (
                source
              ) =>
                `${source.provider}:${source.externalId}`
            )
          );

        return (
          watchlistItems.find(
            (
              item
            ) =>
              item.type ===
                "match" &&
              Boolean(
                item.target
                  .provider
              ) &&
              Boolean(
                item.target
                  .externalId
              ) &&
              sources.has(
                `${item.target.provider}:${item.target.externalId}`
              )
          ) ??
          null
        );
      },
      [
        match,
        watchlistItems,
      ]
    );

  /*
   * Estos ahora están DESPUÉS de match.
   *
   * En tu código anterior se utilizaba
   * match antes de declararlo.
   */
  const homeWatch =
    match
      ? (
          watchlistItems.find(
            (
              item
            ) =>
              item.type ===
                "team" &&
              normalize(
                item.target.name ??
                  ""
              ) ===
                normalize(
                  match.home.name
                )
          ) ??
          null
        )
      : null;

  const awayWatch =
    match
      ? (
          watchlistItems.find(
            (
              item
            ) =>
              item.type ===
                "team" &&
              normalize(
                item.target.name ??
                  ""
              ) ===
                normalize(
                  match.away.name
                )
          ) ??
          null
        )
      : null;

  const competitionWatch =
    match
      ? (
          watchlistItems.find(
            (
              item
            ) =>
              item.type ===
                "competition" &&
              normalize(
                item.target
                  .competition ??
                  item.target
                    .name ??
                  ""
              ) ===
                normalize(
                  match
                    .competition
                    .name
                )
          ) ??
          null
        )
      : null;

  const countryWatch =
    match
      ? (
          watchlistItems.find(
            (
              item
            ) =>
              item.type ===
                "country" &&
              normalize(
                item.target
                  .country ??
                  item.target
                    .name ??
                  ""
              ) ===
                normalize(
                  match
                    .competition
                    .country
                )
          ) ??
          null
        )
      : null;

  /*
   * ==========================================
   * LOAD WATCHLIST
   * ==========================================
   */

  useEffect(
    () => {

      void loadWatchlist();
    },
    [
      loadWatchlist,
    ]
  );

  /*
   * ==========================================
   * RED CARD DATA
   *
   * No dependemos únicamente del provider
   * usado en la URL.
   *
   * Buscamos cualquier source compartida.
   * ==========================================
   */

  const redCardData:
    RedCardRadarMatch | null =
      useMemo(
        () => {

          if (!match) {
            return null;
          }

          return (
            redCardMatches.find(
              (
                item
              ) =>
                match.sources.some(
                  (
                    source
                  ) =>
                    matchesSource(
                      item.match,
                      source.provider,
                      source.externalId
                    )
                )
            ) ??
            null
          );
        },
        [
          match,
          redCardMatches,
        ]
      );

  /*
   * ==========================================
   * ADVANCED DATA
   * ==========================================
   */

  const [
    statistics,
    setStatistics,
  ] =
    useState<
      MatchStatisticsResponse |
      null
    >(
      null
    );

  const [
    pressure,
    setPressure,
  ] =
    useState<
      MatchPressureResponse |
      null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );

  /*
   * ==========================================
   * FLASHSCORE STATS + PRESSURE
   *
   * NO se rompe lo existente.
   *
   * Solo consultamos si este partido
   * realmente tiene source Flashscore.
   * ==========================================
   */

  useEffect(
    () => {

      let cancelled =
        false;

      const load =
        async () => {

          /*
           * Limpiamos datos del partido
           * anterior al cambiar de ruta.
           */
          setStatistics(
            null
          );

          setPressure(
            null
          );

          setError(
            null
          );

          /*
           * Si es solo:
           *
           * bookmaker
           * api-football
           * fotmob
           *
           * y no tiene Flashscore,
           * no llamamos endpoints antiguos.
           */
          if (
            !flashscoreExternalId
          ) {
            setLoading(
              false
            );

            return;
          }

          setLoading(
            true
          );

          const [
            statisticsResult,
            pressureResult,
          ] =
            await Promise
              .allSettled([
                getMatchStatistics(
                  flashscoreExternalId
                ),

                getMatchPressure(
                  flashscoreExternalId
                ),
              ]);

          if (cancelled) {
            return;
          }

          if (
            statisticsResult.status ===
            "fulfilled"
          ) {
            setStatistics(
              statisticsResult.value
            );
          }

          if (
            pressureResult.status ===
            "fulfilled"
          ) {
            setPressure(
              pressureResult.value
            );
          }

          if (
            statisticsResult.status ===
              "rejected" &&
            pressureResult.status ===
              "rejected"
          ) {
            setError(
              "No se pudieron cargar los datos avanzados de Flashscore."
            );
          }

          setLoading(
            false
          );
        };

      void load();

      return () => {
        cancelled =
          true;
      };
    },
    [
      flashscoreExternalId,
    ]
  );

  /*
   * ==========================================
   * WATCHLIST ACTION
   * ==========================================
   */

  const toggleWatchlist =
    async () => {

      if (!match) {
        return;
      }

      if (
        watchlistItem
      ) {
        await removeWatchlistItem(
          watchlistItem.id
        );

        return;
      }

      await followCurrentMatch(
        match
      );
    };

  /*
   * ==========================================
   * STATISTICS
   * ==========================================
   */

  const allStatistics =
    statistics
      ?.statistics
      .find(
        (
          item
        ) =>
          item.period ===
          "all"
      ) ??
    statistics
      ?.statistics[0] ??
    null;

  /*
   * ==========================================
   * MATCH NOT FOUND
   * ==========================================
   */

  if (!match) {
    return (
      <View
        style={
          styles.center
        }
      >
        <Text
          style={
            styles.error
          }
        >
          El partido ya no está disponible en el radar local.
        </Text>

        <TouchableOpacity
          onPress={
            () =>
              router.back()
          }
        >
          <Text
            style={
              styles.backLink
            }
          >
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <ScrollView
      style={
        styles.screen
      }
      contentContainerStyle={
        styles.content
      }
    >
      <TouchableOpacity
        onPress={
          () =>
            router.back()
        }
        style={
          styles.back
        }
      >
        <Text
          style={
            styles.backText
          }
        >
          ‹ Volver
        </Text>
      </TouchableOpacity>

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

      {/*
       * ======================================
       * SCORE
       * ======================================
       */}

      <View
        style={
          styles.scoreCard
        }
      >
        <View
          style={
            styles.teamRow
          }
        >
          <Text
            style={
              styles.team
            }
          >
            {match.home.name}
          </Text>

          <Text
            style={
              styles.score
            }
          >
            {match.home.goals ??
              "-"}
          </Text>
        </View>

        <View
          style={
            styles.teamRow
          }
        >
          <Text
            style={
              styles.team
            }
          >
            {match.away.name}
          </Text>

          <Text
            style={
              styles.score
            }
          >
            {match.away.goals ??
              "-"}
          </Text>
        </View>

        <Text
          style={
            styles.status
          }
        >
          {match.status
            .minute !==
          null
            ? `${match.status.minute}'`
            : match.status.long}
        </Text>
      </View>

      {/*
       * ======================================
       * MATCH CONTEXT
       *
       * Flashscore → contexto Flashscore
       * FotMob     → contexto FotMob
       * 1xBet only → contexto limitado
       * ======================================
       */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Contexto
      </Text>

		{match && (
  <>
    <MatchTeamMemory
      match={
        match
      }
      autoLoad
    />

    <MatchCopyActions
      home={
        match.home.name
      }
      away={
        match.away.name
      }
    />

    <ShareMatchQuickActions
      match={
        match
      }
    />
  </>
)}

      {contextSource ? (
        <MatchContextSummary
          match={
            match
          }
          autoLoad
        />
      ) : (
        <MatchContextUnavailable
          match={
            match
          }
        />
      )}

      {/*
       * ======================================
       * RED CARDS
       * ======================================
       */}

      {redCardData &&
        redCardData
          .redCards
          .incidents
          .length >
          0 && (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Expulsiones
            </Text>

            {redCardData
              .redCards
              .incidents
              .map(
                (
                  incident,
                  index
                ) => (
                  <View
                    key={
                      incident.id ??
                      `${incident.side}-${incident.minute}-${index}`
                    }
                    style={
                      styles.redCard
                    }
                  >
                    <Text
                      style={
                        styles.redCardTitle
                      }
                    >
                      🔴{" "}
                      {incident
                        .player
                        ?.name ??
                        "Expulsión"}
                    </Text>

                    <Text
                      style={
                        styles.redCardMeta
                      }
                    >
                      {incident.side ===
                      "home"
                        ? match
                            .home
                            .name
                        : incident.side ===
                          "away"
                        ? match
                            .away
                            .name
                        : "Equipo desconocido"}

                      {" · "}

                      {incident.minute ??
                        "?"}
                      '
                    </Text>
                  </View>
                )
              )}
          </>
        )}

      {/*
       * ======================================
       * PRESSURE
       * ======================================
       */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Presión
      </Text>

      {loading &&
        !pressure && (
          <ActivityIndicator />
        )}

      {pressure
        ?.available &&
      pressure.analysis ? (
        <View
          style={
            styles.pressureCard
          }
        >
          <View
            style={
              styles.pressureRow
            }
          >
            <View>
              <Text
                style={
                  styles.pressureTeam
                }
              >
                {match.home.name}
              </Text>

              <Text
                style={
                  styles.pressureValue
                }
              >
                {pressure
                  .analysis
                  .homeScore
                  .toFixed(
                    1
                  )}
              </Text>
            </View>

            <View
              style={
                styles.pressureCenter
              }
            >
              <Text
                style={
                  styles.level
                }
              >
                {pressure
                  .analysis
                  .level
                  .toUpperCase()}
              </Text>

              <Text
                style={
                  styles.confidence
                }
              >
                Confianza{" "}
                {pressure
                  .analysis
                  .confidence}
              </Text>
            </View>

            <View
              style={
                styles.right
              }
            >
              <Text
                style={
                  styles.pressureTeam
                }
              >
                {match.away.name}
              </Text>

              <Text
                style={
                  styles.pressureValue
                }
              >
                {pressure
                  .analysis
                  .awayScore
                  .toFixed(
                    1
                  )}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        !loading && (
          <Text
            style={
              styles.unavailable
            }
          >
            {flashscoreExternalId
              ? "No hay suficientes datos para calcular presión."
              : "Presión avanzada no disponible para esta fuente."}
          </Text>
        )
      )}

      {/*
       * ======================================
       * STATISTICS
       * ======================================
       */}

      <Text
        style={
          styles.sectionTitle
        }
      >
        Estadísticas
      </Text>

      {allStatistics
        ?.metrics
        .length ? (
        <View
          style={
            styles.statisticsCard
          }
        >
          {allStatistics
            .metrics
            .map(
              (
                metric
              ) => (
                <View
                  key={
                    metric.key
                  }
                  style={
                    styles.statRow
                  }
                >
                  <Text
                    style={
                      styles.statValue
                    }
                  >
                    {String(
                      metric
                        .home
                        .raw ??
                      "-"
                    )}
                  </Text>

                  <Text
                    style={
                      styles.statLabel
                    }
                  >
                    {metric.label}
                  </Text>

                  <Text
                    style={[
                      styles.statValue,
                      styles.right,
                    ]}
                  >
                    {String(
                      metric
                        .away
                        .raw ??
                      "-"
                    )}
                  </Text>
                </View>
              )
            )}
        </View>
      ) : (
        !loading && (
          <Text
            style={
              styles.unavailable
            }
          >
            {flashscoreExternalId
              ? "Estadísticas no disponibles para este partido."
              : "Estadísticas avanzadas no disponibles para esta fuente."}
          </Text>
        )
      )}

      {!!error && (
        <Text
          style={
            styles.error
          }
        >
          {error}
        </Text>
      )}

      {/*
       * ======================================
       * FOLLOW MATCH
       *
       * IMPORTANTE:
       * el View de FollowScopeButton ya NO
       * está dentro del <Text>.
       * ======================================
       */}

      <TouchableOpacity
        disabled={
          watchlistMutating ||
          watchlistLoading
        }
        style={[
          styles.watchButton,

          watchlistItem &&
            styles.watchButtonActive,

          (
            watchlistMutating ||
            watchlistLoading
          ) &&
            styles.watchButtonDisabled,
        ]}
        onPress={
          () => {
            void toggleWatchlist();
          }
        }
      >
        <Text
          style={
            styles.watchButtonText
          }
        >
          {watchlistMutating
            ? "Actualizando..."
            : watchlistItem
            ? "★ Siguiendo"
            : "☆ Seguir partido"}
        </Text>
      </TouchableOpacity>

      {/*
       * ======================================
       * FOLLOW RELATED
       * ======================================
       */}

      <View
        style={
          styles.followSection
        }
      >
        <Text
          style={
            styles.followTitle
          }
        >
          ⭐ Seguir también
        </Text>

        <Text
          style={
            styles.followHint
          }
        >
          El Radar podrá avisarte en futuros partidos relacionados.
        </Text>

        <FollowScopeButton
          label={
            `Equipo: ${match.home.name}`
          }
          followed={
            Boolean(
              homeWatch
            )
          }
          loading={
            watchlistMutating
          }
          onPress={
            () => {

              if (
                homeWatch
              ) {
                void removeWatchlistItem(
                  homeWatch.id
                );

                return;
              }

              void followTeam(
                match.home.name,
                match
                  .competition
                  .country
              );
            }
          }
        />

        <FollowScopeButton
          label={
            `Equipo: ${match.away.name}`
          }
          followed={
            Boolean(
              awayWatch
            )
          }
          loading={
            watchlistMutating
          }
          onPress={
            () => {

              if (
                awayWatch
              ) {
                void removeWatchlistItem(
                  awayWatch.id
                );

                return;
              }

              void followTeam(
                match.away.name,
                match
                  .competition
                  .country
              );
            }
          }
        />

        <FollowScopeButton
          label={
            `Competición: ${match.competition.name}`
          }
          followed={
            Boolean(
              competitionWatch
            )
          }
          loading={
            watchlistMutating
          }
          onPress={
            () => {

              if (
                competitionWatch
              ) {
                void removeWatchlistItem(
                  competitionWatch.id
                );

                return;
              }

              void followCompetition(
                match
                  .competition
                  .name,

                match
                  .competition
                  .country
              );
            }
          }
        />

        {!!match
          .competition
          .country && (
          <FollowScopeButton
            label={
              `País: ${match.competition.country}`
            }
            followed={
              Boolean(
                countryWatch
              )
            }
            loading={
              watchlistMutating
            }
            onPress={
              () => {

                if (
                  countryWatch
                ) {
                  void removeWatchlistItem(
                    countryWatch.id
                  );

                  return;
                }

                void followCountry(
                  match
                    .competition
                    .country
                );
              }
            }
          />
        )}
      </View>
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

    center: {
      flex:
        1,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#0E1015",

      padding:
        30,
    },

    back: {
      alignSelf:
        "flex-start",

      marginBottom:
        22,
    },

    backText: {
      color:
        "#91A9FF",

      fontSize:
        16,

      fontWeight:
        "600",
    },

    backLink: {
      color:
        "#91A9FF",

      marginTop:
        20,
    },

    competition: {
      color:
        "#929BAA",

      fontSize:
        13,

      marginBottom:
        12,
    },

    scoreCard: {
      backgroundColor:
        "#171A21",

      borderRadius:
        18,

      borderWidth:
        1,

      borderColor:
        "#292E39",

      padding:
        18,

      marginBottom:
        24,
    },

    teamRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginVertical:
        5,
    },

    team: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "600",

      flex:
        1,
    },

    score: {
      color:
        "#FFFFFF",

      fontSize:
        25,

      fontWeight:
        "800",
    },

    status: {
      color:
        "#FF6673",

      fontWeight:
        "700",

      marginTop:
        14,
    },

    sectionTitle: {
      color:
        "#FFFFFF",

      fontSize:
        18,

      fontWeight:
        "800",

      marginTop:
        10,

      marginBottom:
        12,
    },

    redCard: {
      backgroundColor:
        "#29191D",

      borderRadius:
        12,

      borderWidth:
        1,

      borderColor:
        "#512A31",

      padding:
        13,

      marginBottom:
        9,
    },

    redCardTitle: {
      color:
        "#FF747F",

      fontWeight:
        "700",
    },

    redCardMeta: {
      color:
        "#AA989C",

      marginTop:
        4,

      fontSize:
        12,
    },

    pressureCard: {
      backgroundColor:
        "#171A21",

      borderRadius:
        16,

      padding:
        16,

      marginBottom:
        20,
    },

    pressureRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      gap:
        12,
    },

    pressureCenter: {
      alignItems:
        "center",
    },

    pressureTeam: {
      color:
        "#949DAA",

      fontSize:
        11,

      maxWidth:
        110,
    },

    pressureValue: {
      color:
        "#FFFFFF",

      fontSize:
        27,

      fontWeight:
        "800",

      marginTop:
        4,
    },

    level: {
      color:
        "#FFB85C",

      fontWeight:
        "800",

      fontSize:
        12,
    },

    confidence: {
      color:
        "#737D8D",

      fontSize:
        10,

      marginTop:
        5,
    },

    right: {
      textAlign:
        "right",

      alignItems:
        "flex-end",
    },

    statisticsCard: {
      backgroundColor:
        "#171A21",

      borderRadius:
        16,

      overflow:
        "hidden",
    },

    statRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingVertical:
        12,

      paddingHorizontal:
        14,

      borderBottomWidth:
        StyleSheet
          .hairlineWidth,

      borderBottomColor:
        "#30343D",
    },

    statValue: {
      color:
        "#FFFFFF",

      width:
        65,

      fontWeight:
        "700",
    },

    statLabel: {
      flex:
        1,

      color:
        "#9BA4B2",

      textAlign:
        "center",

      fontSize:
        12,
    },

    unavailable: {
      color:
        "#737D8D",

      marginBottom:
        20,
    },

    error: {
      color:
        "#FF7883",

      marginTop:
        20,

      textAlign:
        "center",
    },

    watchButton: {
      backgroundColor:
        "#2458E8",

      borderRadius:
        14,

      paddingVertical:
        14,

      alignItems:
        "center",

      marginTop:
        28,
    },

    watchButtonText: {
      color:
        "#FFFFFF",

      fontWeight:
        "800",

      fontSize:
        15,
    },
	watchButtonActive: {
  backgroundColor:
    "#B58B18",
},

watchButtonDisabled: {
  opacity:
    0.55,
},
followSection: {
  marginTop:
    20,

  backgroundColor:
    "#12151A",

  borderWidth:
    1,

  borderColor:
    "#292E37",

  borderRadius:
    16,

  padding:
    14,
},

followTitle: {
  color:
    "#FFFFFF",

  fontSize:
    16,

  fontWeight:
    "800",
},

followHint: {
  color:
    "#777F8C",

  fontSize:
    11,

  lineHeight:
    16,

  marginTop:
    4,

  marginBottom:
    13,
},
  });
