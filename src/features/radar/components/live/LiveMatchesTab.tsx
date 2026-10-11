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
  teamMemoryKey,
  useTeamMemoryStore,
} from "@/features/team-memory/store/teamMemoryStore";

import {
  LiveMemoryFilter,
  type LiveMemoryFilterMode,
} from "./LiveMemoryFilter";

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

  const [
    selectedCountry,
    setSelectedCountry,
  ] =
    useState<
      string |
      null
    >(
      null
    );

  const [
    selectedLeague,
    setSelectedLeague,
  ] =
    useState<
      string |
      null
    >(
      null
    );

  const [
    memoryFilterMode,
    setMemoryFilterMode,
  ] =
    useState<
      LiveMemoryFilterMode
    >(
      "all"
    );

  const [
    visibleKeys,
    setVisibleKeys,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  const memorySummaries =
    useTeamMemoryStore(
      state =>
        state.summaries
    );

  const loadAllSummaries =
    useTeamMemoryStore(
      state =>
        state.loadAllSummaries
    );

  const allSummariesLoading =
    useTeamMemoryStore(
      state =>
        state.allSummariesLoading
    );

  const opponentSummaries =
    useTeamMemoryStore(
      state =>
        state.opponentSummaries
    );

  const loadAllOpponentSummaries =
    useTeamMemoryStore(
      state =>
        state.loadAllOpponentSummaries
    );

  const allOpponentSummariesLoading =
    useTeamMemoryStore(
      state =>
        state.allOpponentSummariesLoading
    );

  const directMemoryMatches =
    useMemo(
      () =>
        matches.filter(
          match => {

            const homeSummary =
              memorySummaries[
                teamMemoryKey(
                  match.home.name
                )
              ];

            const awaySummary =
              memorySummaries[
                teamMemoryKey(
                  match.away.name
                )
              ];

            const homeHasMemory =
              Boolean(
                homeSummary &&
                homeSummary.total >
                  0
              );

            const awayHasMemory =
              Boolean(
                awaySummary &&
                awaySummary.total >
                  0
              );

            return (
              homeHasMemory ||
              awayHasMemory
            );
          }
        ),
      [
        matches,
        memorySummaries,
      ]
    );

  const opponentMemoryMatches =
    useMemo(
      () =>
        matches.filter(
          match => {

            const homeOpponent =
              opponentSummaries[
                teamMemoryKey(
                  match.home.name
                )
              ];

            const awayOpponent =
              opponentSummaries[
                teamMemoryKey(
                  match.away.name
                )
              ];

            const homeIsOpponent =
              Boolean(
                homeOpponent &&
                homeOpponent
                  .appearances >
                  0
              );

            const awayIsOpponent =
              Boolean(
                awayOpponent &&
                awayOpponent
                  .appearances >
                  0
              );

            return (
              homeIsOpponent ||
              awayIsOpponent
            );
          }
        ),
      [
        matches,
        opponentSummaries,
      ]
    );

  const filterBaseMatches =
    useMemo(
      () => {

        if (
          memoryFilterMode ===
          "direct"
        ) {
          return directMemoryMatches;
        }

        if (
          memoryFilterMode ===
          "opponents"
        ) {
          return opponentMemoryMatches;
        }

        return matches;

      },
      [
        memoryFilterMode,
        directMemoryMatches,
        opponentMemoryMatches,
        matches,
      ]
    );

  const countries =
    useMemo(
      () =>
        buildLiveCountryOptions(
          filterBaseMatches
        ),
      [
        filterBaseMatches,
      ]
    );

  const leagues =
    useMemo(
      () =>
        buildLiveLeagueOptions(
          filterBaseMatches,
          selectedCountry
        ),
      [
        filterBaseMatches,
        selectedCountry,
      ]
    );

  const visibleMatches =
    useMemo(
      () =>
        filterLiveMatchesByCompetition(
          filterBaseMatches,
          selectedCountry,
          selectedLeague
        ),
      [
        filterBaseMatches,
        selectedCountry,
        selectedLeague,
      ]
    );

  useEffect(
    () => {

      void Promise.all([
        loadAllSummaries(),
        loadAllOpponentSummaries(),
      ]);

    },
    [
      loadAllSummaries,
      loadAllOpponentSummaries,
    ]
  );

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

  const selectCountry =
    (
      value:
        string |
        null
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
        string |
        null
    ) => {

      setSelectedLeague(
        value
      );
    };

  const selectMemoryFilter =
    (
      value:
        LiveMemoryFilterMode
    ) => {

      setMemoryFilterMode(
        value
      );

      setSelectedCountry(
        null
      );

      setSelectedLeague(
        null
      );
    };

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

  const memoryLoading =
    allSummariesLoading ||
    allOpponentSummariesLoading;

  return (
    <View
      style={
        styles.container
      }
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

            <LiveMemoryFilter
              mode={
                memoryFilterMode
              }

              directCount={
                directMemoryMatches
                  .length
              }

              opponentCount={
                opponentMemoryMatches
                  .length
              }

              loading={
                memoryLoading
              }

              onChange={
                selectMemoryFilter
              }
            />

            <LiveCompetitionFilter
              totalCount={
                filterBaseMatches
                  .length
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
