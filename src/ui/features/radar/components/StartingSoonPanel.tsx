import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Text,
  View,
} from "react-native";

import type {
  LiveMatch,
} from "../../../../types/radar";

import {
  getStartingSoonMatches,
} from "../../../../async/services/radarService";

import {
  styles,
} from "./StartingSoonPanel.styles";

interface Props {
  country?: string;
  liveMatches: LiveMatch[];
}

const REFRESH_MS =
  3 * 60 * 1000;

const CLOCK_MS =
  15 * 1000;

const BEFORE_MS =
  15 * 60 * 1000;

const GRACE_MS =
  10 * 60 * 1000;

function normalize(
  value: string
): string {

  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase();
}

/*
 * Evitar duplicar partidos que
 * ya aparecen en Live.
 *
 * Primero comprobamos identificadores
 * compartidos. Después utilizamos
 * equipos, competición y horario.
 */
function isSameMatch(
  upcoming: LiveMatch,
  live: LiveMatch
): boolean {

  const sharedSource =
    upcoming.sources.some(
      source =>
        live.sources.some(
          current =>
            current.provider ===
              source.provider &&
            current.externalId ===
              source.externalId
        )
    );

  if (sharedSource) {
    return true;
  }

  const sameTeams =
    normalize(upcoming.home.name) ===
      normalize(live.home.name) &&
    normalize(upcoming.away.name) ===
      normalize(live.away.name);

  if (!sameTeams) {
    return false;
  }

  const sameCompetition =
    normalize(
      upcoming.competition.name
    ) ===
    normalize(
      live.competition.name
    );

  if (!sameCompetition) {
    return false;
  }

  const upcomingTime =
    Date.parse(
      upcoming.kickoffAt
    );

  const liveTime =
    Date.parse(
      live.kickoffAt
    );

  return (
    Number.isFinite(upcomingTime) &&
    Number.isFinite(liveTime) &&
    Math.abs(
      upcomingTime - liveTime
    ) <= 30 * 60 * 1000
  );
}

function describeKickoff(
  kickoffAt: string,
  now: number
): string {

  const remaining =
    Date.parse(kickoffAt) - now;

  if (remaining <= 0) {
    return "Inicio pendiente de confirmar";
  }

  const minutes =
    Math.ceil(
      remaining / 60_000
    );

  return `Comienza en ${minutes} min`;
}

export default function StartingSoonPanel({
  country,
  liveMatches,
}: Props) {

  const [
    upcoming,
    setUpcoming,
  ] = useState<LiveMatch[]>([]);

  const [
    now,
    setNow,
  ] = useState(
    Date.now()
  );

  const [
  fetchState,
  setFetchState,
] = useState<
  "loading" | "ready" | "error"
>("loading");

const [
  fetchError,
  setFetchError,
] = useState<string | null>(null);

  /*
   * Consulta independiente.
   *
   * No modifica radarStore,
   * liveMatches ni redCardMatches.
   */
  useEffect(() => {

    let active = true;

const refresh = async () => {
  try {
    const response =
      await getStartingSoonMatches({
        country,
      });

    if (!active) {
      return;
    }

    if (!Array.isArray(response.matches)) {
      throw new Error(
        "La respuesta no contiene un array matches"
      );
    }

    setUpcoming(response.matches);

    setFetchState("ready");
    setFetchError(null);

    console.log(
      "[StartingSoonPanel] response",
      {
        country: country ?? "all",
        count: response.count,
        received: response.matches.length,
      }
    );

  } catch (error) {
    if (!active) {
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    setFetchState("error");
    setFetchError(message);

    console.warn(
      "[StartingSoonPanel] failed",
      message
    );
  }
};

    void refresh();

    const refreshTimer =
      setInterval(
        () => {
          void refresh();
        },
        REFRESH_MS
      );

    const clockTimer =
      setInterval(
        () => {
          setNow(
            Date.now()
          );
        },
        CLOCK_MS
      );

    return () => {
      active = false;

      clearInterval(
        refreshTimer
      );

      clearInterval(
        clockTimer
      );
    };

  }, [
    country,
  ]);

  /*
   * Filtramos nuevamente en el móvil
   * para que la cuenta regresiva avance
   * sin consultar al backend cada segundo.
   */
  const visible =
    useMemo(() => {

      return upcoming
        .filter(match => {

          if (
            match.status.short !== "NS"
          ) {
            return false;
          }

          const kickoff =
            Date.parse(
              match.kickoffAt
            );

          if (
            !Number.isFinite(kickoff)
          ) {
            return false;
          }

          const remaining =
            kickoff - now;

          if (
            remaining > BEFORE_MS ||
            remaining < -GRACE_MS
          ) {
            return false;
          }

          return !liveMatches.some(
            live =>
              isSameMatch(
                match,
                live
              )
          );
        })
        .sort(
          (a, b) =>
            Date.parse(a.kickoffAt) -
            Date.parse(b.kickoffAt)
        );

    }, [
      upcoming,
      liveMatches,
      now,
    ]);

if (visible.length === 0) {

  const inWindow =
    upcoming.filter(match => {

      const kickoff =
        Date.parse(match.kickoffAt);

      if (!Number.isFinite(kickoff)) {
        return false;
      }

      const remaining =
        kickoff - now;

      return (
        match.status.short === "NS" &&
        remaining <= BEFORE_MS &&
        remaining >= -GRACE_MS
      );
    }).length;

  const message =
    fetchState === "loading"
      ? "Consultando partidos próximos..."
      : fetchState === "error"
        ? `Error: ${fetchError ?? "desconocido"}`
        : inWindow > 0
          ? "Los partidos recibidos coinciden con encuentros que ya figuran en LIVE."
          : "No hay partidos dentro de la ventana de 15 minutos.";

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        ⏳ Próximos a comenzar
      </Text>

      <Text style={styles.subtitle}>
        {message}
      </Text>

      <Text style={styles.subtitle}>
        {`Recibidos: ${upcoming.length} | En ventana: ${inWindow} | Live: ${liveMatches.length}`}
      </Text>

      <Text style={styles.subtitle}>
        {`País: ${country || "Todos"} | Estado: ${fetchState}`}
      </Text>

    </View>
  );
}

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        ⏳ Próximos a comenzar
      </Text>

      <Text style={styles.subtitle}>
        Partidos programados para los próximos 15 minutos
      </Text>

      {visible.map(match => {

        const source =
          match.sources[0];

        const key =
          source
            ? `${source.provider}:${source.externalId}`
            : `${match.home.name}:${match.away.name}:${match.kickoffAt}`;

        const kickoffDate =
          new Date(
            match.kickoffAt
          );

        const kickoffTime =
          kickoffDate.toLocaleTimeString(
            undefined,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

        return (
          <View
            key={key}
            style={styles.card}
          >

            <Text
              style={styles.competition}
            >
              {match.competition.name}
              {" · "}
              {match.competition.country}
            </Text>

            <View
              style={styles.teams}
            >

              <Text
                style={styles.team}
                numberOfLines={2}
              >
                {match.home.name}
              </Text>

              <Text
                style={styles.versus}
              >
                VS
              </Text>

              <Text
                style={styles.team}
                numberOfLines={2}
              >
                {match.away.name}
              </Text>

            </View>

            <View
              style={styles.footer}
            >

              <Text
                style={styles.kickoff}
              >
                {kickoffTime}
              </Text>

              <Text
                style={styles.countdown}
              >
                {describeKickoff(
                  match.kickoffAt,
                  now
                )}
              </Text>

            </View>

          </View>
        );
      })}

    </View>
  );
}
