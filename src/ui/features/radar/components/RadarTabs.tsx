import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type RadarTab =
  | "live"
  | "red-cards"
  | "signals";

interface Props {
  value:
    RadarTab;

  liveCount:
    number;

  redCardCount:
    number;

  signalCount:
    number;

  onChange:
    (
      value:
        RadarTab
    ) => void;
}

interface TabItem {
  key:
    RadarTab;

  label:
    string;

  count:
    number;
}

export default function RadarTabs({
  value,
  liveCount,
  redCardCount,
  signalCount,
  onChange,
}: Props) {

  const tabs:
    TabItem[] = [
      {
        key:
          "live",

        label:
          "Todos",

        count:
          liveCount,
      },

      {
        key:
          "red-cards",

        label:
          "Rojas",

        count:
          redCardCount,
      },

      {
        key:
          "signals",

        label:
          "Señales",

        count:
          signalCount,
      },
    ];

  return (
    <View
      style={
        styles.container
      }
    >
      {tabs.map(
        (
          tab
        ) => {

          const selected =
            value ===
            tab.key;

          return (
            <TouchableOpacity
              key={
                tab.key
              }
              onPress={
                () =>
                  onChange(
                    tab.key
                  )
              }
              style={[
                styles.tab,

                selected &&
                  styles
                    .tabSelected,
              ]}
            >
              <Text
                style={[
                  styles.label,

                  selected &&
                    styles
                      .labelSelected,
                ]}
              >
                {tab.label}
              </Text>

              <View
                style={[
                  styles.counter,

                  selected &&
                    styles
                      .counterSelected,
                ]}
              >
                <Text
                  style={[
                    styles.counterText,

                    selected &&
                      styles
                        .counterTextSelected,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flexDirection:
        "row",

      backgroundColor:
        "#171A21",

      borderRadius:
        14,

      padding:
        4,

      marginBottom:
        20,
    },

    tab: {
      flex:
        1,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      gap:
        6,

      borderRadius:
        11,

      paddingVertical:
        10,
    },

    tabSelected: {
      backgroundColor:
        "#252A35",
    },

    label: {
      color:
        "#7F8898",

      fontSize:
        13,

      fontWeight:
        "600",
    },

    labelSelected: {
      color:
        "#FFFFFF",
    },

    counter: {
      minWidth:
        20,

      height:
        20,

      paddingHorizontal:
        5,

      borderRadius:
        10,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        "#232832",
    },

    counterSelected: {
      backgroundColor:
        "#315CE8",
    },

    counterText: {
      color:
        "#8992A1",

      fontSize:
        10,

      fontWeight:
        "700",
    },

    counterTextSelected: {
      color:
        "#FFFFFF",
    },
  });
