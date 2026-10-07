import {
  del,
  get,
  patch,
  post,
} from "../api";

import {
  watchlistRoutes,
} from "../routes/watchlistRoutes";

import type {
  LiveMatch,
  MatchSource,
} from "../../types/radar";

import type {
  CreateWatchlistItemInput,
  WatchlistItem,
} from "../../types/watchlist";

import type {
  WatchlistRadarRule,
} from "../../types/watchlist";

import type {
  DeleteWatchlistResponse,
  WatchlistItemResponse,
  WatchlistResponse,
} from "../../types/watchlist";

function preferredSource(
  match:
    LiveMatch
): MatchSource | null {

  return (
    match.sources.find(
      (
        source
      ) =>
        source.provider ===
        "flashscore"
    ) ??
    match.sources[0] ??
    null
  );
}

export async function getWatchlist():
  Promise<
    WatchlistResponse
  > {

  return get<
    WatchlistResponse
  >(
    watchlistRoutes.list
  );
}

export async function followMatch(
  match:
    LiveMatch
): Promise<
  WatchlistItemResponse
> {

  const source =
    preferredSource(
      match
    );

  if (!source) {
    throw new Error(
      "El partido no tiene una fuente válida"
    );
  }

  return post<
    WatchlistItemResponse
  >(
    watchlistRoutes.create,
    {
      type:
        "match",

      label:
        `${match.home.name} vs ${match.away.name}`,

      target: {
        provider:
          source.provider,

        externalId:
          source.externalId,

        country:
          match
            .competition
            .country,

        competition:
          match
            .competition
            .name,

        homeName:
          match.home.name,

        awayName:
          match.away.name,

        kickoffAt:
          match.kickoffAt,
      },
    }
  );
}

export async function setWatchlistEnabled(
  id: string,
  enabled: boolean
): Promise<
  WatchlistItemResponse
> {

  return patch<
    WatchlistItemResponse
  >(
    watchlistRoutes.enabled(
      id
    ),
    {
      enabled,
    }
  );
}

export async function deleteWatchlistItem(
  id: string
): Promise<
  DeleteWatchlistResponse
> {

  return del<
    DeleteWatchlistResponse
  >(
    watchlistRoutes.remove(
      id
    )
  );
}

async function createWatchlistItem(
  input:
    CreateWatchlistItemInput
): Promise<WatchlistItem> {

  const response =
    await post<{
      item:
        WatchlistItem;
    }>(
      watchlistRoutes.create,
      input
    );

  return response.item;
}
export async function followTeam(
  name: string,
  country?: string | null
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type:
      "team",

    label:
      name,

    target: {
      name,

country:
  country ??
  undefined,
    },
  });
}

export async function followCompetition(
  name: string,
  country?: string | null
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type:
      "competition",

    label:
      country
        ? `${name} · ${country}`
        : name,

    target: {
      name,

      competition:
        name,

country:
  country ??
  undefined,
    },
  });
}

export async function followCountry(
  country: string
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type:
      "country",

    label:
      country,

    target: {
      name:
        country,

      country,
    },
  });
}

export async function createRadarRule(
  label:
    string,

  rule:
    WatchlistRadarRule
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type:
      "radar-rule",

    label,

    target: {
      name:
        label,

      country:
        rule.country ??
        undefined,

      competition:
        rule.competition ??
        undefined,
    },

    rule,
  });
}
