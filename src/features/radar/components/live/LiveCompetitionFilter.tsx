import React from "react";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  LiveFilterOption,
} from "../../utils/liveCompetitionFilter";

import {
  styles,
} from "./LiveCompetitionFilter.styles";

interface Props {
  totalCount:
    number;

  visibleCount:
    number;

  countries:
    LiveFilterOption[];

  leagues:
    LiveFilterOption[];

  selectedCountry:
    string | null;

  selectedLeague:
    string | null;

  onCountryChange:
    (
      value:
        string | null
    ) => void;

  onLeagueChange:
    (
      value:
        string | null
    ) => void;
}

export function LiveCompetitionFilter({
  totalCount,
  visibleCount,
  countries,
  leagues,
  selectedCountry,
  selectedLeague,
  onCountryChange,
  onLeagueChange,
}: Props) {
  return (
    <View
      style={
        styles.container
      }
    >
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
          PARTIDOS EN VIVO
        </Text>

        <Text
          style={
            styles.counter
          }
        >
          {visibleCount}
          {" / "}
          {totalCount}
        </Text>
      </View>

      <Text
        style={
          styles.sectionLabel
        }
      >
        País
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.row
        }
      >
        <TouchableOpacity
          onPress={
            () =>
              onCountryChange(
                null
              )
          }
          style={[
            styles.chip,

            selectedCountry ===
              null &&
              styles.chipActive,
          ]}
        >
          <Text
            style={[
              styles.chipText,

              selectedCountry ===
                null &&
                styles
                  .chipTextActive,
            ]}
          >
            Todos {totalCount}
          </Text>
        </TouchableOpacity>

        {countries.map(
          (
            item
          ) => {
            const active =
              selectedCountry ===
              item.value;

            return (
              <TouchableOpacity
                key={
                  item.value
                }
                onPress={
                  () =>
                    onCountryChange(
                      item.value
                    )
                }
                style={[
                  styles.chip,

                  active &&
                    styles
                      .chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,

                    active &&
                      styles
                        .chipTextActive,
                  ]}
                >
                  {item.label}
                  {" "}
                  {item.count}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </ScrollView>

      {selectedCountry && (
        <>
          <Text
            style={
              styles.sectionLabel
            }
          >
            Liga
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.row
            }
          >
            <TouchableOpacity
              onPress={
                () =>
                  onLeagueChange(
                    null
                  )
              }
              style={[
                styles.chip,

                selectedLeague ===
                  null &&
                  styles
                    .chipActiveSecondary,
              ]}
            >
              <Text
  style={[
    styles.chipText,

    selectedLeague ===
      null &&
      styles
        .chipTextActiveSecondary,
  ]}
>
  Todas
</Text>
            </TouchableOpacity>

            {leagues.map(
              (
                item
              ) => {
                const active =
                  selectedLeague ===
                  item.value;

                return (
                  <TouchableOpacity
                    key={
                      item.value
                    }
                    onPress={
                      () =>
                        onLeagueChange(
                          item.value
                        )
                    }
                    style={[
                      styles.chip,

                      active &&
                        styles
                          .chipActiveSecondary,
                    ]}
                  >
                   <Text
  style={[
    styles.chipText,

    active &&
      styles
        .chipTextActiveSecondary,
  ]}
>
                      {item.label}
                      {" "}
                      {item.count}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </ScrollView>
        </>
      )}

      {(selectedCountry ||
        selectedLeague) && (
        <Text
  style={
    styles.filterInfo
  }
>
  {visibleCount} de{" "}
  {totalCount} partidos
</Text>
      )}
    </View>
  );
}
