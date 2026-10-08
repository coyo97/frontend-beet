import React, {
  useEffect,
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

import * as Clipboard
  from "expo-clipboard";

import {
  useSharedMatchStore,
} from "../store/sharedMatchStore";

import {
  SharedMatchCard,
} from "../components/SharedMatchCard";

import type {
  SharedMatchInsight,
} from "../types/sharedMatch";

import {
  styles,
} from "./SharedMatchesScreen.styles";

function itemKey(
  item:
    SharedMatchInsight
): string {
  return item._id;
}

export default function SharedMatchesScreen() {
  const group =
    useSharedMatchStore(
      state =>
        state.group
    );

  const items =
    useSharedMatchStore(
      state =>
        state.items
    );

  const loading =
    useSharedMatchStore(
      state =>
        state.loading
    );

  const error =
    useSharedMatchStore(
      state =>
        state.error
    );

  const loadGroup =
    useSharedMatchStore(
      state =>
        state.loadGroup
    );

  const load =
    useSharedMatchStore(
      state =>
        state.load
    );

  const createGroup =
    useSharedMatchStore(
      state =>
        state.createGroup
    );

  const joinGroup =
    useSharedMatchStore(
      state =>
        state.joinGroup
    );

  const markAllRead =
    useSharedMatchStore(
      state =>
        state.markAllRead
    );

  const [
    inviteCode,
    setInviteCode,
  ] =
    useState(
      ""
    );

  const [
    working,
    setWorking,
  ] =
    useState(
      false
    );

  useEffect(
    () => {
      void loadGroup();
      void load();

      markAllRead();
    },
    [
      load,
      loadGroup,
      markAllRead,
    ]
  );

  const create =
    async () => {
      if (working) {
        return;
      }

      setWorking(
        true
      );

      try {
        await createGroup(
          "Hermanos"
        );

        await load();
      } finally {
        setWorking(
          false
        );
      }
    };

  const join =
    async () => {
      const code =
        inviteCode
          .trim();

      if (
        !code ||
        working
      ) {
        return;
      }

      setWorking(
        true
      );

      try {
        await joinGroup(
          code
        );

        setInviteCode(
          ""
        );

        await load();
      } finally {
        setWorking(
          false
        );
      }
    };

  const refresh =
    async () => {
      await Promise.all([
        loadGroup(),
        load(),
      ]);
    };

  const openMatch =
    (
      item:
        SharedMatchInsight
    ) => {
      const source =
  item.match.sources.find(
    source =>
      source.provider ===
      "flashscore"
  ) ??
  item.match.sources.find(
    source =>
      source.provider ===
      "fotmob"
  ) ??
  item.match.sources[0];

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

  if (!group) {
    return (
      <View
        style={
          styles.screen
        }
      >
        <View
          style={
            styles.onboarding
          }
        >
          <Text
            style={
              styles.onboardingTitle
            }
          >
            Compartidos
          </Text>

          <Text
            style={
              styles.onboardingText
            }
          >
            Crea un grupo privado
            para compartir partidos
            rápidamente con tus
            hermanos, o usa el código
            que te enviaron.
          </Text>

          {!!error && (
            <Text
              style={
                styles.error
              }
            >
              {error}
            </Text>
          )}

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={
              styles.primaryButton
            }
            disabled={
              working
            }
            onPress={
              () => {
                void create();
              }
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              {working
                ? "Creando..."
                : "Crear grupo Hermanos"}
            </Text>
          </TouchableOpacity>

          <Text
            style={
              styles.divider
            }
          >
            O UNIRME A UNO
            EXISTENTE
          </Text>

          <TextInput
            value={
              inviteCode
            }
            onChangeText={
              setInviteCode
            }
            autoCapitalize="characters"
            autoCorrect={
              false
            }
            placeholder="Código del grupo"
            placeholderTextColor="#626D7C"
            style={
              styles.input
            }
          />

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={
              styles.joinButton
            }
            disabled={
              working
            }
            onPress={
              () => {
                void join();
              }
            }
          >
            <Text
              style={
                styles.joinButtonText
              }
            >
              Unirme al grupo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={
        styles.screen
      }
    >
      <FlatList
        data={
          items
        }

        keyExtractor={
          itemKey
        }

        refreshControl={
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
        }

        contentContainerStyle={
          styles.content
        }

        ListHeaderComponent={
          <>
            <View
              style={
                styles.header
              }
            >
              <Text
                style={
                  styles.title
                }
              >
                Compartidos
              </Text>

              <Text
                style={
                  styles.subtitle
                }
              >
                Partidos compartidos
                por tu grupo
              </Text>
            </View>

            <View
              style={
                styles.groupBox
              }
            >
              <Text
                style={
                  styles.groupName
                }
              >
                {group.name}
              </Text>

              <Text
                style={
                  styles.groupMeta
                }
              >
                {group
                  .memberIds
                  .length}
                {" "}
                miembro
                {group
                  .memberIds
                  .length ===
                1
                  ? ""
                  : "s"}
              </Text>

              <View
                style={
                  styles.codeRow
                }
              >
                <Text
                  selectable
                  style={
                    styles.code
                  }
                >
                  {group
                    .inviteCode}
                </Text>

                <TouchableOpacity
                  activeOpacity={
                    0.8
                  }
                  style={
                    styles.smallButton
                  }
                  onPress={
                    () => {
                      void Clipboard
                        .setStringAsync(
                          group
                            .inviteCode
                        );
                    }
                  }
                >
                  <Text
                    style={
                      styles.smallButtonText
                    }
                  >
                    Copiar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {!!error && (
              <Text
                style={
                  styles.error
                }
              >
                {error}
              </Text>
            )}

            <Text
              style={
                styles.sectionTitle
              }
            >
              RECIENTES
            </Text>
          </>
        }

        renderItem={
          ({
            item,
          }) => (
            <SharedMatchCard
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

        ListEmptyComponent={
          !loading
            ? (
              <Text
                style={
                  styles.empty
                }
              >
                Todavía no hay
                partidos compartidos.
              </Text>
            )
            : (
              <ActivityIndicator />
            )
        }
      />
    </View>
  );
}
