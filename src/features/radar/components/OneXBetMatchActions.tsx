
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  searchOneXBetCandidates,
  type OneXBetSearchResponse,
  type OneXBetSearchCandidate,
} from "@/async/services/radarService";

interface Props {
  match: LiveMatch;
}

const LIVE_URL =
  "https://bol.1xbet.com/es/live/football";

const PREMATCH_URL =
  "https://bol.1xbet.com/es/line/football";

function trustedMatchUrl(
  value: unknown
): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      (
        url.hostname === "1xbet.com" ||
        url.hostname.endsWith(".1xbet.com")
      ) &&
      /^\/(?:es|en)\/(?:live|line)\/football\/\d+-[a-z0-9-]+\/\d+-[a-z0-9-]+\/?$/.test(
        url.pathname
      )
    );
  } catch {
    return false;
  }
}

const SEARCH_EVENTS_URL =
  "https://bol.1xbet.com/es/search-events";

async function openOneXBetSearch(
  searchText: string
): Promise<void> {
  const query = searchText
    .replace(/\s+/g, " ")
    .trim();

  if (!query) {
    Alert.alert(
      "Búsqueda vacía",
      "Introduce el nombre de un equipo."
    );
    return;
  }

  const url =
    `${SEARCH_EVENTS_URL}?searchtext=` +
    encodeURIComponent(query);

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      "No se pudo abrir",
      "No fue posible abrir la búsqueda de 1xBet."
    );
  }
}

async function openMatch(
  url: string
): Promise<void> {
  if (!trustedMatchUrl(url)) {
    Alert.alert(
      "Enlace no válido",
      "No se pudo verificar el enlace."
    );
    return;
  }

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      "No se pudo abrir",
      "Comprueba tu navegador."
    );
  }
}

async function openSection(
  section: "live" | "prematch"
): Promise<void> {
  const url = section === "live"
    ? LIVE_URL
    : PREMATCH_URL;

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      "Error",
      "No se pudo abrir 1xBet."
    );
  }
}

function matchTypeLabel(
  type: OneXBetSearchCandidate["matchType"]
): string {
  switch (type) {
    case "same_match":
      return "Mismo encuentro probable";

    case "same_teams_other_date":
      return "Mismos equipos · Otra fecha";

    case "same_teams_unverified":
      return "Mismos equipos · Hora sin verificar";

    case "home_team":
      return "Coincidencia de equipo";

    case "away_team":
      return "Coincidencia de equipo";
  }
}

function formatKickoff(
  value: string | null
): string {
  if (!value) {
    return "Horario no disponible";
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "Horario no disponible";
  }

  return date.toLocaleString("es-BO", {
    timeZone: "America/La_Paz",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OneXBetMatchActions({
  match,
}: Props) {
  const [visible, setVisible] =
    useState(false);

  const [searching, setSearching] =
    useState(false);

  const [home, setHome] =
    useState(match.home.name);

  const [away, setAway] =
    useState(match.away.name);

  const [response, setResponse] =
    useState<OneXBetSearchResponse | null>(
      null
    );

  const [error, setError] =
    useState("");

  const preferredSection =
    match.status.short === "NS"
      ? "prematch"
      : "live";

  const directUrl = match.sources
    .filter(source =>
      source.provider === "bookmaker"
    )
    .map(source =>
      (
        source as typeof source & {
          url?: string;
        }
      ).url
    )
    .find(trustedMatchUrl);

  async function runSearch(): Promise<void> {
    if (!home.trim() && !away.trim()) {
      Alert.alert(
        "Búsqueda vacía",
        "Escribe al menos un equipo."
      );
      return;
    }

    if (searching) return;

    setSearching(true);
    setError("");
    setResponse(null);

    try {
      const result =
        await searchOneXBetCandidates({
          home: home.trim(),
          away: away.trim(),
          kickoffAt: match.kickoffAt,
          preferredSection,
        });

      setResponse(result);
    } catch {
      setError(
        "No fue posible consultar 1xBet."
      );
    } finally {
      setSearching(false);
    }
  }

  function showSearch(): void {
    setVisible(true);
    void runSearch();
  }

  function selectCandidate(
    candidate: OneXBetSearchCandidate
  ): void {
    setVisible(false);
    void openMatch(candidate.url);
  }

  return (
    <View style={styles.container}>
      {directUrl && (
        <Pressable
          style={styles.button}
          onPress={() =>
            void openMatch(directUrl)
          }
        >
          <Text style={styles.buttonText}>
            Abrir en 1xBet ↗
          </Text>
        </Pressable>
      )}

      <Pressable
        style={[
          styles.button,
          directUrl && styles.secondaryButton,
        ]}
        onPress={showSearch}
      >
        <Text style={styles.buttonText}>
          {directUrl
            ? "Buscar partidos relacionados"
            : "Buscar en 1xBet"}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setVisible(false)
        }
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Buscar en 1xBet
              </Text>

              <Pressable
                onPress={() =>
                  setVisible(false)
                }
              >
                <Text style={styles.close}>
                  Cerrar ✕
                </Text>
              </Pressable>
            </View>

            <Text style={styles.description}>
              Busca por ambos equipos o
              modifica los nombres para
              encontrar otros partidos.
            </Text>

            <TextInput
              value={home}
              onChangeText={setHome}
              placeholder="Equipo local"
              placeholderTextColor="#8A939D"
              style={styles.input}
              autoCorrect={false}
            />

            <TextInput
              value={away}
              onChangeText={setAway}
              placeholder="Equipo visitante"
              placeholderTextColor="#8A939D"
              style={styles.input}
              autoCorrect={false}
            />

<View style={styles.nativeSearchContainer}>
  <Text style={styles.nativeSearchTitle}>
    Búsqueda amplia de 1xBet
  </Text>

  <Pressable
    style={styles.nativeSearchButton}
    onPress={() =>
      void openOneXBetSearch(
        [home.trim(), away.trim()]
          .filter(Boolean)
          .join(" vs ")
      )
    }
  >
    <Text style={styles.nativeSearchText}>
      🔎 Buscar partido completo
    </Text>
  </Pressable>

  {!!home.trim() && (
    <Pressable
      style={styles.nativeSearchButton}
      onPress={() =>
        void openOneXBetSearch(home)
      }
    >
      <Text style={styles.nativeSearchText}>
        Buscar solo: {home}
      </Text>
    </Pressable>
  )}

  {!!away.trim() && (
    <Pressable
      style={styles.nativeSearchButton}
      onPress={() =>
        void openOneXBetSearch(away)
      }
    >
      <Text style={styles.nativeSearchText}>
        Buscar solo: {away}
      </Text>
    </Pressable>
  )}
</View>


            <Pressable
              style={styles.searchButton}
              disabled={searching}
              onPress={() =>
                void runSearch()
              }
            >
              {searching ? (
                <ActivityIndicator
                  color="#10161C"
                />
              ) : (
                <Text style={styles.searchText}>
                  Buscar coincidencias
                </Text>
              )}
            </Pressable>

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}

            {response && (
              <Text style={styles.count}>
                {response.count} resultados
                encontrados
              </Text>
            )}

            <ScrollView
              style={styles.results}
              contentContainerStyle={{
                paddingBottom: 12,
              }}
            >
              {response?.candidates.map(
                candidate => (
                  <Pressable
                    key={
                      `${candidate.section}:` +
                      `${candidate.id}:` +
                      candidate.url
                    }
                    style={styles.resultCard}
                    onPress={() =>
                      selectCandidate(candidate)
                    }
                  >
                    <View style={styles.resultHeader}>
                      <Text
                        style={[
                          styles.section,
                          candidate.section === "live" &&
                            styles.live,
                        ]}
                      >
                        {candidate.section === "live"
                          ? "● EN DIRECTO"
                          : "PRÓXIMO PARTIDO"}
                      </Text>

                      <Text style={styles.date}>
                        {formatKickoff(
                          candidate.kickoffAt
                        )}
                      </Text>
                    </View>

                    <Text style={styles.teams}>
                      {candidate.home}
                    </Text>

                    <Text style={styles.teams}>
                      {candidate.away}
                    </Text>

                    <Text style={styles.competition}>
                      {candidate.competition}
                    </Text>

                    <Text style={styles.matchType}>
                      {matchTypeLabel(
                        candidate.matchType
                      )}
                    </Text>

                    <Text style={styles.openLink}>
                      Abrir este partido ↗
                    </Text>
                  </Pressable>
                )
              )}

              {response?.count === 0 && (
                <Text style={styles.empty}>
                  No encontramos coincidencias
                  entre los partidos consultados.
                  Puedes buscar solo por un equipo
                  o abrir el catálogo de 1xBet.
                </Text>
              )}

              {response?.limitedCoverage && (
                <Text style={styles.notice}>
                  La búsqueda todavía no incluye
                  todas las competiciones de 1xBet.
                  Un resultado ausente no significa
                  que el partido no exista.
                </Text>
              )}

              {response && (
                <Text style={styles.coverage}>
                  Directos consultados:{" "}
                  {response.coverage.liveGames}
                  {"\n"}
                  Competiciones Prematch:{" "}
                  {response.coverage
                    .prematchCompetitionsChecked}
                  /
                  {response.coverage
                    .prematchCompetitionsRequested}
                </Text>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                style={styles.footerButton}
                onPress={() =>
                  void openSection("live")
                }
              >
                <Text style={styles.footerText}>
                  Ver Directos
                </Text>
              </Pressable>

              <Pressable
                style={styles.footerButton}
                onPress={() =>
                  void openSection("prematch")
                }
              >
                <Text style={styles.footerText}>
                  Ver Deportes
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 12,
    gap: 7,
  },

  button: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#22C7A0",
    alignItems: "center",
  },

  secondaryButton: {
    borderColor: "#52616D",
  },

  buttonText: {
    color: "#22C7A0",
    fontSize: 13,
    fontWeight: "700",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#151F27",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    maxHeight: "92%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  close: {
    color: "#22C7A0",
    fontWeight: "700",
  },

  description: {
    color: "#A9B7C1",
    fontSize: 12,
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#25323C",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
    marginBottom: 8,
  },

  searchButton: {
    backgroundColor: "#22C7A0",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 3,
    marginBottom: 12,
  },

  searchText: {
    color: "#10161C",
    fontWeight: "800",
  },

  error: {
    color: "#FF8C8C",
    marginVertical: 10,
  },

  count: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 10,
  },

  results: {
    flexGrow: 0,
    marginBottom: 10,
  },

  resultCard: {
    borderWidth: 1,
    borderColor: "#394A54",
    borderRadius: 12,
    padding: 13,
    marginBottom: 9,
    backgroundColor: "#1E2A33",
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },

  section: {
    color: "#9FB4C2",
    fontSize: 10,
    fontWeight: "800",
  },

  live: {
    color: "#FF7777",
  },

  date: {
    color: "#B5C3CC",
    fontSize: 10,
  },

  teams: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },

  competition: {
    color: "#94A3AE",
    fontSize: 11,
    marginTop: 5,
  },

  matchType: {
    color: "#22C7A0",
    fontSize: 11,
    marginTop: 8,
  },

  openLink: {
    color: "#22C7A0",
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },

  empty: {
    color: "#AFBDC7",
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 14,
  },

  notice: {
    color: "#C9AD78",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },

  coverage: {
    color: "#8195A3",
    fontSize: 10,
    marginTop: 12,
  },

  footer: {
    flexDirection: "row",
    gap: 9,
  },

  footerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#52616D",
    alignItems: "center",
  },

  footerText: {
    color: "#D5E3EA",
    fontWeight: "700",
    fontSize: 12,
  },
  nativeSearchContainer: {
  marginBottom: 12,
  gap: 7,
},

nativeSearchTitle: {
  color: "#B6C7D0",
  fontSize: 12,
  fontWeight: "700",
  marginBottom: 3,
},

nativeSearchButton: {
  borderColor: "#22C7A0",
  borderWidth: 1,
  borderRadius: 10,
  paddingVertical: 11,
  paddingHorizontal: 12,
  backgroundColor: "#163C36",
},

nativeSearchText: {
  color: "#22C7A0",
  fontSize: 12,
  fontWeight: "700",
},
});

