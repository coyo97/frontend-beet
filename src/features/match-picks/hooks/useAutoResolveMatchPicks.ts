import {
  useEffect,
  useRef,
} from "react";

import {
  fetchRecentMatches,
} from "@/features/recent-matches/api/recentMatchesService";

import type {
  RecentMatch,
} from "@/features/recent-matches/types/recentMatch";

import {
  teamMemoryKey,
  useTeamMemoryStore,
} from "@/features/team-memory/store/teamMemoryStore";

import type {
  TeamMemoryEvent,
} from "@/features/team-memory/types/teamMemory";

import {
  useMatchPickStore,
} from "../store/matchPickStore";

import type {
  MatchPick,
} from "../types/matchPick";

function kickoffClose(
  left:
    string |
    null,

  right:
    string
): boolean {

  if (!left) {
    return false;
  }

  const a =
    new Date(
      left
    ).getTime();

  const b =
    new Date(
      right
    ).getTime();

  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {
    return false;
  }

  return (
    Math.abs(
      a - b
    ) <=
    15 *
      60 *
      1000
  );
}

function findRecentMatch(
  pick:
    MatchPick,

  recent:
    RecentMatch[]
): RecentMatch | null {

  /*
   * Identidad fuerte:
   * provider + externalId.
   */
  if (
    pick.provider &&
    pick.externalId
  ) {
    const exact =
      recent.find(
        item =>
          item.match.sources
            .some(
              source =>
                source.provider ===
                  pick.provider &&
                source.externalId ===
                  pick.externalId
            )
      );

    if (exact) {
      return exact;
    }
  }

  /*
   * Fallback:
   * equipos + kickoff cercano.
   */
  return (
    recent.find(
      item => {

        const sameTeams =
          (
            teamMemoryKey(
              item.match
                .home.name
            ) ===
              teamMemoryKey(
                pick.homeName
              ) &&
            teamMemoryKey(
              item.match
                .away.name
            ) ===
              teamMemoryKey(
                pick.awayName
              )
          );

        return (
          sameTeams &&
          kickoffClose(
            item.match
              .kickoffAt,
            pick.kickoffAt
          )
        );
      }
    ) ??
    null
  );
}

function alreadyRegistered(
  events:
    TeamMemoryEvent[],

  pick:
    MatchPick
): boolean {

  return events.some(
    event => {

      if (
        pick.provider &&
        pick.externalId &&
        event.provider ===
          pick.provider &&
        event.externalId ===
          pick.externalId
      ) {
        return true;
      }

      return (
        teamMemoryKey(
          event
            .opponentName ??
          ""
        ) ===
          teamMemoryKey(
            pick.opponentName
          ) &&
        kickoffClose(
          event.kickoffAt,
          pick.kickoffAt
        )
      );
    }
  );
}

export function useAutoResolveMatchPicks(
  refreshSignal:
    unknown
) {

  const lastCheck =
    useRef(
      0
    );

  const items =
    useMatchPickStore(
      state =>
        state.items
    );

  useEffect(
    () => {

      const pending =
        Object.values(
          useMatchPickStore
            .getState()
            .items
        );

      if (
        pending.length ===
        0
      ) {
        return;
      }

      /*
       * Evitamos consultar Recent en cada
       * actualización del socket.
       */
      const now =
        Date.now();

      if (
        now -
          lastCheck.current <
        60_000
      ) {
        return;
      }

      lastCheck.current =
        now;

      const resolve =
        async () => {

          try {
            const recent =
              await fetchRecentMatches({
                /*
                 * Cuatro días:
                 * coincide con el margen
                 * que ya manejamos.
                 */
                hours:
                  96,

                limit:
                  400,
              });

            for (
              const pick
              of pending
            ) {

              const recentItem =
                findRecentMatch(
                  pick,
                  recent
                );

              if (!recentItem) {
                continue;
              }

              const match =
                recentItem.match;

              const homeGoals =
                match.home
                  .goals;

              const awayGoals =
                match.away
                  .goals;

              if (
                homeGoals ===
                  null ||
                awayGoals ===
                  null
              ) {
                continue;
              }

              const selectedGoals =
                pick.side ===
                  "home"
                  ? homeGoals
                  : awayGoals;

              const opponentGoals =
                pick.side ===
                  "home"
                  ? awayGoals
                  : homeGoals;

              /*
               * El usuario marcó:
               * "este equipo ganará".
               *
               * Por eso empate = pérdida.
               */
              const outcome =
                selectedGoals >
                opponentGoals
                  ? "win"
                  : "loss";

              const memory =
                useTeamMemoryStore
                  .getState();

              /*
               * Primero comprobamos que
               * no se haya registrado ya.
               *
               * Esto evita duplicados si
               * la app se cerró en medio
               * de una resolución.
               */
              await memory
                .ensureHistory(
                  pick.teamName
                );

              const events =
                useTeamMemoryStore
                  .getState()
                  .history[
                    teamMemoryKey(
                      pick.teamName
                    )
                  ] ??
                [];

              if (
                !alreadyRegistered(
                  events,
                  pick
                )
              ) {
                await useTeamMemoryStore
                  .getState()
                  .record({
                    teamName:
                      pick.teamName,

                    opponentName:
                      pick.opponentName,

                    outcome,

                    competitionName:
                      pick
                        .competitionName,

                    kickoffAt:
                      pick.kickoffAt,

                    provider:
                      pick.provider,

                    externalId:
                      pick.externalId,

                    note:
                      null,
                  });
              }

              /*
               * Ya está reflejado en
               * Team Memory.
               *
               * Eliminamos la apuesta
               * pendiente.
               */
              useMatchPickStore
                .getState()
                .remove(
                  pick.key
                );
            }

          } catch (
            error
          ) {

            console.warn(
              "[MatchPicks] auto resolve failed",
              error
            );
          }
        };

      void resolve();

    },
    [
      items,
      refreshSignal,
    ]
  );
}
