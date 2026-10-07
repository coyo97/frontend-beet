import React, {
  useEffect,
  useMemo,
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
} from "react-native";

import {
  router,
} from "expo-router";

import {
  useRecentMatchesStore,
} from "../store/recentMatchesStore";

import {
  RecentMatchCard,
} from "../components/RecentMatchCard";

import type {
  RecentMatch,
} from "../types/recentMatch";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  styles,
} from "./RecentMatchesScreen.styles";

function recentKey(
  item:
    RecentMatch
): string {

  const source =
    getPreferredMatchSource(
      item.match
    ) ??
    item.match.sources[0];

  if (source) {
    return (
      `${source.provider}:` +
      source.externalId
    );
  }

  return [
    item.match.home.name,
    item.match.away.name,
    item.match.kickoffAt,
  ].join(
    ":"
  );
}

function normalizeSearch(
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
    .toLowerCase()
    .trim();
}

export default function RecentMatchesScreen() {

  const items =
    useRecentMatchesStore(
      state =>
        state.items
    );

  const loading =
    useRecentMatchesStore(
      state =>
        state.loading
    );

  const error =
    useRecentMatchesStore(
      state =>
        state.error
    );

  const refresh =
    useRecentMatchesStore(
      state =>
        state.refresh
    );

  /*
   * ========================================
   * SEARCH LOCAL
   *
   * No consulta backend.
   * Filtra solamente los partidos que
   * ya tenemos cargados en memoria.
   * ========================================
   */

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  useEffect(
    () => {
      void refresh();
    },
    [
      refresh,
    ]
  );

  const visibleMatches =
    useMemo(
      () => {

        const query =
          normalizeSearch(
            search
          );

        if (!query) {
          return items;
        }

        return items.filter(
          item => {

            const match =
              item.match;

            const searchable =
              [
                match.home
                  ?.name,

                match.away
                  ?.name,

                match.competition
                  ?.name,

                match.competition
                  ?.country,
              ]
                .filter(
                  Boolean
                )
                .map(
                  value =>
                    normalizeSearch(
                      String(
                        value
                      )
                    )
                )
                .join(
                  " "
                );

            return searchable
              .includes(
                query
              );
          }
        );
      },
      [
        items,
        search,
      ]
    );

  const openMatch =
    (
      item:
        RecentMatch
    ) => {

      const source =
        getPreferredMatchSource(
          item.match
        ) ??
        item.match
          .sources[0];

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
          onPress={
            () =>
              router.back()
          }
          style={
            styles.backButton
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
            Partidos recientes
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Últimas 48 horas ·{" "}
            {items.length} partidos
          </Text>
        </View>
      </View>

      {/* =========================
          BUSCADOR LOCAL
      ========================== */}

      <View
        style={
          styles.searchContainer
        }
      >
        <TextInput
          value={
            search
          }
          onChangeText={
            setSearch
          }
          placeholder="Buscar equipo, liga o país..."
          placeholderTextColor="#737B87"
          autoCapitalize="none"
          autoCorrect={
            false
          }
          returnKeyType="search"
          style={
            styles.searchInput
          }
        />

        {search.length >
          0 && (
          <TouchableOpacity
            activeOpacity={
              0.8
            }
            onPress={
              () =>
                setSearch(
                  ""
                )
            }
            style={
              styles.searchClear
            }
          >
            <Text
              style={
                styles.searchClearText
              }
            >
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!!search.trim() && (
        <Text
          style={
            styles.searchSummary
          }
        >
          {visibleMatches.length} de{" "}
          {items.length} partidos
        </Text>
      )}

      {error && (
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

      {loading &&
      items.length ===
        0 ? (
        <View
          style={
            styles.loader
          }
        >
          <ActivityIndicator
            size="large"
          />

          <Text
            style={
              styles.loaderText
            }
          >
            Buscando partidos recientes...
          </Text>
        </View>
      ) : (
        <FlatList
          /*
           * IMPORTANTE:
           *
           * Ya no usamos:
           *
           * data={items}
           *
           * sino la lista filtrada
           * localmente.
           */
          data={
            visibleMatches
          }
          keyExtractor={
            recentKey
          }
          renderItem={
            ({
              item,
            }) => (
              <RecentMatchCard
                item={
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
                refresh
              }
            />
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            visibleMatches.length ===
              0
              ? styles.emptyContent
              : styles.content
          }
          ListEmptyComponent={
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
                {search.trim()
                  ? "No se encontraron partidos"
                  : "Todavía no hay partidos recientes"}
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                {search.trim()
                  ? `No hay resultados para "${search.trim()}".`
                  : "Los partidos aparecerán aquí cuando salgan del live."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
