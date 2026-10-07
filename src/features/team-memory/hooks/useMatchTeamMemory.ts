import {
  useEffect,
} from "react";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  teamMemoryKey,
  useTeamMemoryStore,
} from "../store/teamMemoryStore";

interface Options {
  enabled?:
    boolean;
}

export function useMatchTeamMemory(
  match:
    LiveMatch,

  options: Options = {}
) {
  const {
    enabled = true,
  } =
    options;

  const ensureTeams =
    useTeamMemoryStore(
      (
        state
      ) =>
        state.ensureTeams
    );

  const summaries =
    useTeamMemoryStore(
      (
        state
      ) =>
        state.summaries
    );

  const loadingKeys =
    useTeamMemoryStore(
      (
        state
      ) =>
        state.loadingKeys
    );

  const homeKey =
    teamMemoryKey(
      match.home.name
    );

  const awayKey =
    teamMemoryKey(
      match.away.name
    );

  useEffect(
    () => {

      if (!enabled) {
        return;
      }

      void ensureTeams([
        match.home.name,
        match.away.name,
      ]);
    },
    [
      enabled,
      ensureTeams,
      match.home.name,
      match.away.name,
    ]
  );

  return {
    homeKey,

    awayKey,

    homeSummary:
      summaries[
        homeKey
      ],

    awaySummary:
      summaries[
        awayKey
      ],

    homeLoading:
      Boolean(
        loadingKeys[
          homeKey
        ]
      ),

    awayLoading:
      Boolean(
        loadingKeys[
          awayKey
        ]
      ),
  };
}
