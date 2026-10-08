import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  FlatList,
  RefreshControl,
  Text,
  View,
  type ViewToken,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  styles,
} from "./LiveMatchesTab.styles";

import {
  AllMatchContextCard,
} from "@/features/radar/components/AllMatchContextCard";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  LiveCompetitionFilter,
} from "./LiveCompetitionFilter";

import {
  buildLiveCountryOptions,
  buildLiveLeagueOptions,
  filterLiveMatchesByCompetition,
} from "../../utils/liveCompetitionFilter";

interface Props {
  matches:
    LiveMatch[];

  loading:
    boolean;

  header?:
    React.ReactElement | null;

  onRefresh:
    () => void;
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
  ].join(":");
}

export function LiveMatchesTab({
  matches,
  loading,
  header = null,
  onRefresh,
}: Props) {
  /*
   * ========================================
   * LOCAL FILTER STATE
   * ========================================
   *
   * Este estado pertenece solamente
   * a la pestaña LIVE.
   */

  const [
    selectedCountry,
    setSelectedCountry,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    selectedLeague,
    setSelectedLeague,
  ] =
    useState<
      string | null
    >(
      null
    );

  /*
   * ========================================
   * VISIBLE MATCHES
   * ========================================
   */

  const [
    visibleKeys,
    setVisibleKeys,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  /*
   * ========================================
   * FILTER OPTIONS
   * ========================================
   */

  const countries =
    useMemo(
      () =>
        buildLiveCountryOptions(
          matches
        ),
      [
        matches,
      ]
    );

  const leagues =
    useMemo(
      () =>
        buildLiveLeagueOptions(
          matches,
          selectedCountry
        ),
      [
        matches,
        selectedCountry,
      ]
    );

  const visibleMatches =
    useMemo(
      () =>
        filterLiveMatchesByCompetition(
          matches,
          selectedCountry,
          selectedLeague
        ),
      [
        matches,
        selectedCountry,
        selectedLeague,
      ]
    );

  /*
   * ========================================
   * INVALID FILTER CLEANUP
   * ========================================
   */

  useEffect(
    () => {
      if (
        !selectedCountry
      ) {
        return;
      }

      const exists =
        countries.some(
          item =>
            item.value ===
            selectedCountry
        );

      if (!exists) {
        setSelectedCountry(
          null
        );

        setSelectedLeague(
          null
        );
      }
    },
    [
      countries,
      selectedCountry,
    ]
  );

  useEffect(
    () => {
      if (
        !selectedLeague
      ) {
        return;
      }

      const exists =
        leagues.some(
          item =>
            item.value ===
            selectedLeague
        );

      if (!exists) {
        setSelectedLeague(
          null
        );
      }
    },
    [
      leagues,
      selectedLeague,
    ]
  );

  /*
   * ========================================
   * FILTER ACTIONS
   * ========================================
   */

  const selectCountry =
    (
      value:
        string | null
    ) => {
      setSelectedCountry(
        value
      );

      setSelectedLeague(
        null
      );
    };

  const selectLeague =
    (
      value:
        string | null
    ) => {
      setSelectedLeague(
        value
      );
    };

  /*
   * ========================================
   * VIEWABILITY
   * ========================================
   */

  const viewabilityConfig =
    useRef({
      itemVisiblePercentThreshold:
        20,

      minimumViewTime:
        150,
    })
      .current;

  const onViewableItemsChanged =
    useRef(
      ({
        viewableItems,
      }: {
        viewableItems:
          ViewToken<LiveMatch>[];
      }) => {
        const next =
          new Set<string>();

        for (
          const item
          of viewableItems
        ) {
          if (!item.item) {
            continue;
          }

          next.add(
            liveMatchKey(
              item.item
            )
          );
        }

        setVisibleKeys(
          next
        );
      }
    )
      .current;

  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        key="live-matches-list"

        data={
          visibleMatches
        }

        keyExtractor={
          liveMatchKey
        }

        maintainVisibleContentPosition={{
          minIndexForVisible:
            0,
        }}

        extraData={
          visibleKeys
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
              visibleKeys.has(
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
            {header}

            <LiveCompetitionFilter
              totalCount={
                matches.length
              }

              visibleCount={
                visibleMatches
                  .length
              }

              countries={
                countries
              }

              leagues={
                leagues
              }

              selectedCountry={
                selectedCountry
              }

              selectedLeague={
                selectedLeague
              }

              onCountryChange={
                selectCountry
              }

              onLeagueChange={
                selectLeague
              }
            />
          </>
        }

        ListEmptyComponent={
          !loading
            ? (
              <Text>
                No hay partidos en vivo con este filtro.
              </Text>
            )
            : null
        }

        refreshControl={
          <RefreshControl
            refreshing={
              loading
            }
            onRefresh={
              onRefresh
            }
          />
        }

        onViewableItemsChanged={
          onViewableItemsChanged
        }

        viewabilityConfig={
          viewabilityConfig
        }

        initialNumToRender={
          8
        }

        maxToRenderPerBatch={
          8
        }

        updateCellsBatchingPeriod={
          50
        }

        windowSize={
          7
        }

        removeClippedSubviews={
          false
        }

        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
