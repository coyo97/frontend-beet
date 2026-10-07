import React, {
  useEffect,
} from "react";

import type {
  WatchlistItem,
} from "../../../../types/watchlist";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  useWatchlistStore,
} from "../../../../store/watchlistStore";

import WatchlistItemCard from "../components/WatchlistItemCard";

export default function WatchlistScreen() {

  const {
    items,
    loading,
    mutating,
    error,
    load,
    remove,
    setEnabled,
  } =
    useWatchlistStore();

  const openItem =
  (
    item:
      WatchlistItem
  ) => {

    if (
      item.type !==
      "match"
    ) {
      return;
    }

    const provider =
      item.target
        .provider;

    const id =
      item.target
        .externalId;

    if (
      !provider ||
      !id
    ) {
      return;
    }

    router.push({
      pathname:
        "/match/[provider]/[id]",

      params: {
        provider,
        id,
      },
    });
  };
  useEffect(
    () => {
      void load();
    },
    [
      load,
    ]
  );

  return (
    <ScrollView
      style={
        styles.screen
      }
      contentContainerStyle={
        styles.content
      }
      refreshControl={
        <RefreshControl
          refreshing={
            loading
          }
          onRefresh={
            load
          }
        />
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
          styles.title
        }
      >
        Watchlist
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Partidos, equipos, competiciones y alertas que estás siguiendo.
      </Text>

      <View
        style={
          styles.counter
        }
      >
        <Text
          style={
            styles.counterValue
          }
        >
          {items.length}
        </Text>

        <Text
          style={
            styles.counterLabel
          }
        >
          elementos
        </Text>
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

      {loading &&
        items.length ===
          0 && (
          <ActivityIndicator
            size="large"
          />
        )}

      {items.map(
        (
          item
        ) => (
<WatchlistItemCard
  key={
    item.id
  }
  item={
    item
  }
  disabled={
    mutating
  }
  onPress={
    item.type ===
    "match"
      ? () =>
          openItem(
            item
          )
      : undefined
  }
  onToggle={
    (
      enabled
    ) => {
      void setEnabled(
        item.id,
        enabled
      );
    }
  }
  onDelete={
    () => {
      void remove(
        item.id
      );
    }
  }
/>
        )
      )}

      {!loading &&
        items.length ===
          0 && (
          <View
            style={
              styles.empty
            }
          >
            <Text
              style={
                styles.emptyIcon
              }
            >
              ☆
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Tu Watchlist está vacía
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Abre un partido desde el Radar y selecciona "Seguir partido".
            </Text>
          </View>
        )}
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

    back: {
      alignSelf:
        "flex-start",

      marginBottom:
        20,
    },

    backText: {
      color:
        "#91A9FF",

      fontWeight:
        "600",

      fontSize:
        16,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        28,

      fontWeight:
        "800",
    },

    subtitle: {
      color:
        "#7E8796",

      marginTop:
        5,

      marginBottom:
        20,

      lineHeight:
        20,
    },

    counter: {
      flexDirection:
        "row",

      alignItems:
        "baseline",

      gap:
        6,

      marginBottom:
        20,
    },

    counterValue: {
      color:
        "#FFFFFF",

      fontSize:
        24,

      fontWeight:
        "800",
    },

    counterLabel: {
      color:
        "#7E8796",
    },

    error: {
      color:
        "#FF747F",

      marginBottom:
        15,
    },

    empty: {
      alignItems:
        "center",

      marginTop:
        70,

      paddingHorizontal:
        30,
    },

    emptyIcon: {
      color:
        "#526178",

      fontSize:
        50,
    },

    emptyTitle: {
      color:
        "#FFFFFF",

      fontWeight:
        "700",

      fontSize:
        18,

      marginTop:
        15,
    },

    emptyText: {
      color:
        "#737D8D",

      textAlign:
        "center",

      marginTop:
        8,

      lineHeight:
        20,
    },
  });
