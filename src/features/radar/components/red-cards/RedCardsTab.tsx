import React from "react";

import {
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import RedCardMatchCard
  from "@/ui/features/radar/components/RedCardMatchCard";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  styles,
} from "./RedCardsTab.styles";

/*
 * Aprovechamos el tipo real que ya
 * acepta RedCardMatchCard.
 *
 * Así no duplicamos interfaces.
 */
type RedCardItem =
  React.ComponentProps<
    typeof RedCardMatchCard
  >["item"];

interface Props {
  matches:
    RedCardItem[];

  totalMatches:
    number;

  loading:
    boolean;

  header?:
    React.ReactElement |
    null;

  onRefresh:
    () => void;

  onOpenMatch:
    (
      match:
        LiveMatch
    ) => void;
}

export function RedCardsTab({
  matches,
  totalMatches,
  loading,
  header = null,
  onRefresh,
  onOpenMatch,
}: Props) {
  return (
    <View
      style={
        styles.container
      }
    >
      <FlatList
        key="red-card-matches-list"

        data={
          matches
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
              ? [
                  source.provider,
                  source.externalId,
                ].join(":")
              : [
                  item.match
                    .home.name,

                  item.match
                    .away.name,

                  index,
                ].join(":");
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
                  onOpenMatch(
                    item.match
                  )
              }
            />
          )
        }

        ListHeaderComponent={
          header
        }

        ListEmptyComponent={
          !loading
            ? (
              <Text
                style={
                  styles.empty
                }
              >
                {totalMatches ===
                0
                  ? "No se detectan expulsiones actualmente."
                  : "No hay rojas con este estado."}
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
