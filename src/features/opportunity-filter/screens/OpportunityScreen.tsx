import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  OpportunityModeFilter,
} from "../components/OpportunityModeFilter";

import {
  OpportunityOptions,
} from "../components/OpportunityOptions";

import {
  OpportunityCard,
} from "../components/OpportunityCard";

import {
  useOpportunityStore,
} from "../store/opportunityStore";

import type {
  BettorFilterMode,
  MatchOpportunity,
  OpportunityFilters,
} from "../types/opportunity";

import {
  styles,
} from "./OpportunityScreen.styles";

const DEFAULT_FILTERS:
  OpportunityFilters =
{
  mode:
    "moderate-favorite",

  /*
   * scanLimit ya NO significa:
   *
   * "solo analizar estos partidos".
   *
   * El backend mantiene todos
   * los candidatos y refresca
   * como máximo uno por petición.
   */
  scanLimit:
    1,

  limit:
    40,

  minDataQuality:
    30,

  requireTable:
    false,

  excludeFriendly:
    true,

  excludeYouth:
    true,

  excludeReserve:
    true,

  excludeWomen:
    false,
};

export default function OpportunityScreen() {

  const [
    filters,
    setFilters,
  ] =
    useState<
      OpportunityFilters
    >(
      DEFAULT_FILTERS
    );

  const items =
    useOpportunityStore(
      state =>
        state.items
    );

	  /*
   * ========================================
   * ORDEN VISUAL ESTABLE
   *
   * No modifica el store.
   * No hace peticiones.
   *
   * kickoff más reciente:
   * arriba.
   *
   * kickoff más antiguo:
   * abajo.
   * ========================================
   */

  const orderedItems =
    useMemo(
      () =>
        [...items]
          .sort(
            (
              left,
              right
            ) => {

              const leftKickoff =
                new Date(
                  left.match.kickoffAt
                ).getTime();

              const rightKickoff =
                new Date(
                  right.match.kickoffAt
                ).getTime();

              if (
                Number.isFinite(
                  leftKickoff
                ) &&
                Number.isFinite(
                  rightKickoff
                )
              ) {
                /*
                 * Más reciente primero.
                 */
                return (
                  rightKickoff -
                  leftKickoff
                );
              }

              return 0;
            }
          ),
      [
        items,
      ]
    );

  const loading =
    useOpportunityStore(
      state =>
        state.loading
    );

  const error =
    useOpportunityStore(
      state =>
        state.error
    );

  const summary =
    useOpportunityStore(
      state =>
        state.summary
    );

  const load =
    useOpportunityStore(
      state =>
        state.load
    );

  /*
   * Una sola petición.
   *
   * Nada de loops automáticos.
   * El presupuesto global vive
   * en el backend.
   */
  const analyze =
    useCallback(
      async () => {

        if (
          useOpportunityStore
            .getState()
            .loading
        ) {
          return;
        }

        await load({
          ...filters,

          scanLimit:
            1,
        });
      },
      [
        filters,
        load,
      ]
    );

  /*
   * Al entrar por primera vez hacemos
   * exactamente una consulta.
   */
  useEffect(
    () => {
      void load({
        ...DEFAULT_FILTERS,

        scanLimit:
          1,
      });
    },
    [
      load,
    ]
  );

  const changeMode =
    (
      mode:
        BettorFilterMode
    ) => {

      setFilters(
        current => ({
          ...current,
          mode,
        })
      );
    };

  const openMatch =
    (
      opportunity:
        MatchOpportunity
    ) => {

      const source =
        getPreferredMatchSource(
          opportunity.match
        );

      if (
        !source
      ) {
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

  const hasPending =
    (
      summary?.pending ??
      0
    ) >
    0;

  return (
    <View
      style={
        styles.screen
      }
    >
      <View
        style={
          styles.header
        }
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={
            () =>
              router.back()
          }
        >
          <Text
            style={
              styles.backText
            }
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.headerText
          }
        >
          <Text
            style={
              styles.title
            }
          >
            Radar de oportunidades
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Tabla · PPG · últimos 5 · contexto del rival
          </Text>
        </View>
      </View>

      <OpportunityModeFilter
        value={
          filters.mode
        }
        onChange={
          changeMode
        }
      />

      <OpportunityOptions
        value={
          filters
        }
        onChange={
          setFilters
        }
      />

      <View
        style={
          styles.actionRow
        }
      >
        <View
          style={
            styles.summaryArea
          }
        >
          {summary && (
            <>
              <Text
                style={
                  styles.summaryMain
                }
              >
                {items.length} resultados
              </Text>

              <Text
                style={
                  styles.summarySub
                }
              >
                {summary.analyzed} de{" "}
                {summary.candidates} analizados
                {" · "}
                {summary.pending} pendientes
                {" · "}
                {summary.totalLive} en vivo
              </Text>

              {summary.unavailable >
                0 && (
                <Text
                  style={
                    styles.summarySub
                  }
                >
                  {summary.unavailable} sin contexto disponible
                </Text>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          disabled={
            loading
          }
          activeOpacity={
            0.8
          }
          onPress={
            analyze
          }
          style={[
            styles.analyzeButton,

            loading &&
              styles.analyzeButtonDisabled,
          ]}
        >
          <Text
            style={
              styles.analyzeText
            }
          >
            {loading
              ? "Analizando..."
              : hasPending
                ? "Analizar siguiente"
                : "Actualizar"}
          </Text>
        </TouchableOpacity>
      </View>

      {!!error && (
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
        </View>
      )}

      {loading &&
      items.length ===
        0 ? (
        <View
          style={
            styles.loadingArea
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
            {summary
              ? `Analizando ${summary.analyzed} de ${summary.candidates} partidos...`
              : "Revisando partidos y contexto..."}
          </Text>
        </View>
      ) : (
        <FlatList
  data={
    orderedItems
  }
			  maintainVisibleContentPosition={{
    minIndexForVisible:
      0,
  }}
          keyExtractor={
  (
    item
  ) =>
    [
      item.match.home.name,
      item.match.away.name,
      item.match.kickoffAt,
    ].join(
      ":"
    )
}
          renderItem={
            ({
              item,
            }) => (
              <OpportunityCard
                opportunity={
                  item
                }
                onPress={
                  () =>
                    openMatch(
                      item
                    )
                }
              />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={
                loading
              }
              onRefresh={
                analyze
              }
            />
          }
          contentContainerStyle={
            items.length >
              0
              ? styles.listContent
              : styles.emptyContent
          }
          ListEmptyComponent={
            !loading ? (
              <View
                style={
                  styles.empty
                }
              >
                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No encontramos partidos con este perfil
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Prueba otro filtro o permite partidos sin tabla.
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
