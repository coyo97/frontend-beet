
import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  getUpcomingCatalog,
  type UpcomingCatalogResponse,
} from "@/async/services/radarService";

import OneXBetMatchActions
  from "@/features/radar/components/OneXBetMatchActions";

type CalendarView =
  "today" | "tomorrow" | "week";

function dateInBolivia(
  offset = 0
): string {
  const date = new Date(
    Date.now() + offset * 86_400_000
  );

  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "America/La_Paz",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(date);

  const get = (type: string) =>
    parts.find(p => p.type === type)
      ?.value ?? "";

  return (
    `${get("year")}-` +
    `${get("month")}-` +
    `${get("day")}`
  );
}

function localTime(iso: string): string {
  return new Date(iso).toLocaleString(
    "es-BO",
    {
      timeZone: "America/La_Paz",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function UpcomingRadarScreen() {
  const [view, setView] =
    useState<CalendarView>("today");

  const [query, setQuery] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [reload, setReload] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [data, setData] =
    useState<UpcomingCatalogResponse | null>(
      null
    );

  /*
   * Evitar una consulta HTTP por
   * cada letra que se escribe.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 450);

    return () => clearTimeout(timer);
  }, [query]);

  /*
   * Elegir la fecha local de Bolivia,
   * no la fecha UTC del dispositivo.
   */
  const day =
    view === "today"
      ? dateInBolivia(0)
      : view === "tomorrow"
        ? dateInBolivia(1)
        : undefined;

  useEffect(() => {
    let active = true;

    async function load(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const result =
          await getUpcomingCatalog({
            day,
            q: search || undefined,
            page,
            limit: 30,
          });

        if (active) {
          setData(result);
        }
      } catch {
        if (active) {
          setError(
            "No se pudo cargar el calendario."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [day, search, page, reload]);

  const changeView = (
    next: CalendarView
  ) => {
    setView(next);
    setPage(1);
  };

  const renderMatch = ({
    item,
  }: {
    item: LiveMatch;
  }) => (
    <View style={styles.card}>
      <Text style={styles.competition}>
        {item.competition.name}
      </Text>

      <Text style={styles.country}>
        {item.competition.country}
      </Text>

      <Text style={styles.kickoff}>
        {localTime(item.kickoffAt)}
      </Text>

      <View style={styles.teams}>
        <Text style={styles.team}>
          {item.home.name}
        </Text>

        <Text style={styles.versus}>
          VS
        </Text>

        <Text style={styles.team}>
          {item.away.name}
        </Text>
      </View>

      <OneXBetMatchActions match={item} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>
        Próximos partidos
      </Text>

      <Text style={styles.subtitle}>
        Radar Prematch · Calendario de 7 días
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar equipo o competición"
        placeholderTextColor="#8A939D"
        style={styles.input}
        autoCorrect={false}
      />

      <View style={styles.tabs}>
        {([
          ["today", "Hoy"],
          ["tomorrow", "Mañana"],
          ["week", "7 días"],
        ] as const).map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => changeView(value)}
            style={[
              styles.tab,
              view === value &&
                styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                view === value &&
                  styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {data
            ? `${data.total} partidos encontrados`
            : "Cargando calendario"}
        </Text>

        <Pressable
          onPress={() =>
            setReload(value => value + 1)
          }
        >
          <Text style={styles.refresh}>
            Actualizar
          </Text>
        </Pressable>
      </View>

      {loading && (
        <ActivityIndicator
          color="#22C7A0"
          style={{ marginVertical: 8 }}
        />
      )}

      {!!error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <FlatList
        data={data?.matches ?? []}
        renderItem={renderMatch}
        keyExtractor={(item, index) =>
          item.sources
            .map(source =>
              `${source.provider}:${source.externalId}`
            )
            .join("|") ||
          `${item.kickoffAt}:${index}`
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>
              No hay partidos para estos filtros.
            </Text>
          ) : null
        }
        ListFooterComponent={
          data && data.pages > 1 ? (
            <View style={styles.pagination}>
              <Pressable
                disabled={page <= 1 || loading}
                onPress={() =>
                  setPage(value => value - 1)
                }
                style={styles.pageButton}
              >
                <Text style={styles.pageText}>
                  Anterior
                </Text>
              </Pressable>

              <Text style={styles.pageIndicator}>
                {page} / {data.pages}
              </Text>

              <Pressable
                disabled={
                  page >= data.pages || loading
                }
                onPress={() =>
                  setPage(value => value + 1)
                }
                style={styles.pageButton}
              >
                <Text style={styles.pageText}>
                  Siguiente
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#10161C",
    paddingHorizontal: 12,
    paddingTop: 16,
  },

  title: {
    color: "#F4F6F8",
    fontSize: 23,
    fontWeight: "800",
  },

  subtitle: {
    color: "#9BA7B2",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },

  input: {
    backgroundColor: "#202B34",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    marginBottom: 12,
  },

  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#394550",
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "#163C36",
    borderColor: "#22C7A0",
  },

  tabText: {
    color: "#AAB3BC",
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#22C7A0",
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryText: {
    color: "#CBD4DC",
    fontSize: 12,
  },

  refresh: {
    color: "#22C7A0",
    fontWeight: "700",
    fontSize: 12,
  },

  card: {
    borderWidth: 1,
    borderColor: "#35414B",
    backgroundColor: "#19232B",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  competition: {
    color: "#E0E7ED",
    fontSize: 12,
    fontWeight: "700",
  },

  country: {
    color: "#8E9CA7",
    fontSize: 11,
    marginTop: 2,
  },

  kickoff: {
    color: "#22C7A0",
    fontSize: 12,
    marginTop: 8,
  },

  teams: {
    marginTop: 12,
    marginBottom: 6,
    gap: 6,
  },

  team: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  versus: {
    color: "#93A2AD",
    fontSize: 11,
    fontWeight: "600",
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 16,
  },

  pageButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#22C7A0",
    borderRadius: 9,
  },

  pageText: {
    color: "#22C7A0",
    fontWeight: "700",
  },

  pageIndicator: {
    color: "#FFFFFF",
  },

  empty: {
    color: "#9BA7B2",
    textAlign: "center",
    marginTop: 30,
  },

  error: {
    color: "#FF8C8C",
    marginBottom: 12,
  },
});

