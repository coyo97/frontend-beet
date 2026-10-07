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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  fetchAllTeamMemorySummaries,
} from "@/features/team-memory/api/teamMemoryService";

import {
  teamMemoryKey,
} from "@/features/team-memory/store/teamMemoryStore";

import type {
  TeamMemorySummary,
} from "@/features/team-memory/types/teamMemory";

import {
  useTeamPersonalProfileStore,
} from "@/features/team-profile/store/teamPersonalProfileStore";

import type {
  TeamPersonalProfile,
} from "@/features/team-profile/types/teamPersonalProfile";

import {
  MyTeamCard,
} from "../components/MyTeamCard";

import {
  styles,
} from "./MyTeamsScreen.styles";

interface Item {
  key:
    string;

  teamName:
    string;

  summary?:
    TeamMemorySummary;

  profile?:
    TeamPersonalProfile;

  updatedAt:
    number;
}

export default function MyTeamsScreen() {

  const [
    memory,
    setMemory,
  ] =
    useState<
      TeamMemorySummary[]
    >(
      []
    );

  const [
    loadingMemory,
    setLoadingMemory,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState<
      string |
      null
    >(
      null
    );

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const profiles =
    useTeamPersonalProfileStore(
      state =>
        state.all
    );

  const profilesLoading =
    useTeamPersonalProfileStore(
      state =>
        state.allLoading
    );

  const refreshProfiles =
    useTeamPersonalProfileStore(
      state =>
        state.refreshAll
    );

  const refresh =
    useCallback(
      async () => {

        setError(
          null
        );

        setLoadingMemory(
          true
        );

        try {
          const [
            summaries,
          ] =
            await Promise.all([
              fetchAllTeamMemorySummaries(),
              refreshProfiles(),
            ]);

          setMemory(
            summaries
          );
        } catch (
          cause
        ) {

          setError(
            cause instanceof
              Error
              ? cause.message
              : "No se pudieron cargar tus equipos"
          );
        } finally {
          setLoadingMemory(
            false
          );
        }
      },
      [
        refreshProfiles,
      ]
    );

  useEffect(
    () => {
      void refresh();
    },
    [
      refresh,
    ]
  );

  const items =
    useMemo(
      () => {

        const map =
          new Map<
            string,
            Item
          >();

        for (
          const summary
          of memory
        ) {

          const key =
            teamMemoryKey(
              summary.teamName
            );

          map.set(
            key,
            {
              key,

              teamName:
                summary.teamName,

              summary,

              updatedAt:
                summary
                  .lastUpdatedAt
                  ? new Date(
                      summary.lastUpdatedAt
                    )
                      .getTime()
                  : 0,
            }
          );
        }

        for (
          const profile
          of profiles
        ) {

          const key =
            teamMemoryKey(
              profile.teamName
            );

          const existing =
            map.get(
              key
            );

          const profileTime =
            new Date(
              profile.updatedAt
            ).getTime();

          map.set(
            key,
            {
              key,

              teamName:
                existing
                  ?.teamName ??
                profile.teamName,

              summary:
                existing
                  ?.summary,

              profile,

              updatedAt:
                Math.max(
                  existing
                    ?.updatedAt ??
                    0,

                  Number.isFinite(
                    profileTime
                  )
                    ? profileTime
                    : 0
                ),
            }
          );
        }

        const needle =
          search
            .trim()
            .toLowerCase();

        return Array
          .from(
            map.values()
          )
          .filter(
            item =>
              !needle ||
              item.teamName
                .toLowerCase()
                .includes(
                  needle
                ) ||
              item.profile
                ?.note
                ?.toLowerCase()
                .includes(
                  needle
                )
          )
          .sort(
            (
              a,
              b
            ) =>
              b.updatedAt -
              a.updatedAt
          );
      },
      [
        memory,
        profiles,
        search,
      ]
    );

  const loading =
    loadingMemory ||
    profilesLoading;

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

        <View>
          <Text
            style={
              styles.title
            }
          >
            Mis equipos
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Tu memoria personal
          </Text>
        </View>
      </View>

      <View
        style={
          styles.searchArea
        }
      >
        <TextInput
          value={
            search
          }
          onChangeText={
            setSearch
          }
          placeholder="Buscar equipo o nota..."
          placeholderTextColor="#626C78"
          style={
            styles.search
          }
        />

        <Text
          style={
            styles.count
          }
        >
          {items.length}{" "}
          {items.length ===
          1
            ? "equipo"
            : "equipos"}
        </Text>
      </View>

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
            Cargando tu memoria...
          </Text>
        </View>
      ) : (
        <FlatList
          data={
            items
          }
          keyExtractor={
            item =>
              item.key
          }
          renderItem={
            ({
              item,
            }) => (
              <MyTeamCard
                teamName={
                  item.teamName
                }
                summary={
                  item.summary
                }
                initialProfile={
                  item.profile
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
          contentContainerStyle={
            items.length
              ? styles.content
              : styles.emptyContent
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
                Aún no tienes equipos guardados
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Marca un equipo como “me hizo ganar/perder” o añade una nota personal y aparecerá aquí.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
