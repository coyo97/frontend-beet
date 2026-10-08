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

import RadarSignalCard
  from "@/ui/features/radar/components/RadarSignalCard";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  styles,
} from "./RadarSignalsTab.styles";

type RadarSignalItem =
  React.ComponentProps<
    typeof RadarSignalCard
  >["item"];

interface Props {
  signals:
    RadarSignalItem[];

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

export function RadarSignalsTab({
  signals,
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
        key="radar-signals-list"

        data={
          signals
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
              ].join(":");
            }

            return [
              item.publishedAt,
              index,
            ].join(":");
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
                  onOpenMatch(
                    item.signal
                      .match
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
                Aún no hay señales de presión con expulsión.
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
