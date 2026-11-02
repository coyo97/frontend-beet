
import {
  del,
  get,
  patch,
  post,
} from "../api";

import {
  watchlistRoutes,
} from "../routes/watchlistRoutes";

import {
  getAuthToken,
} from "../../features/auth/storage/authToken";

import type {
  LiveMatch,
  MatchSource,
} from "../../types/radar";

import type {
  CreateWatchlistItemInput,
  WatchlistItem,
  WatchlistRadarRule,
  DeleteWatchlistResponse,
  WatchlistItemResponse,
  WatchlistResponse,
} from "../../types/watchlist";

/*
 * Las rutas de Watchlist requieren JWT.
 *
 * El usuario propietario se obtiene
 * en el backend, no desde el móvil.
 */
async function authenticatedOptions() {
  const token =
    await getAuthToken();

  if (!token) {
    throw new Error("NO_SESSION");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function preferredSource(
  match: LiveMatch
): MatchSource | null {

  return (
    match.sources.find(
      source =>
        source.provider === "flashscore"
    ) ??
    match.sources[0] ??
    null
  );
}

/*
 * Obtener solamente la Watchlist
 * del usuario autenticado.
 */
export async function getWatchlist():
  Promise<WatchlistResponse> {

  return get<WatchlistResponse>(
    watchlistRoutes.list,
    {},
    await authenticatedOptions()
  );
}

/*
 * Seguir un partido.
 */
export async function followMatch(
  match: LiveMatch
): Promise<WatchlistItemResponse> {

  const source =
    preferredSource(match);

  if (!source) {
    throw new Error(
      "El partido no tiene una fuente válida"
    );
  }

  return post<WatchlistItemResponse>(
    watchlistRoutes.create,
    {
      type: "match",

      label:
        `${match.home.name} vs ${match.away.name}`,

      target: {
        provider:
          source.provider,

        externalId:
          source.externalId,

        country:
          match.competition.country,

        competition:
          match.competition.name,

        homeName:
          match.home.name,

        awayName:
          match.away.name,

        kickoffAt:
          match.kickoffAt,
      },
    },
    await authenticatedOptions()
  );
}

/*
 * Activar o desactivar
 * una entrada de Watchlist.
 */
export async function setWatchlistEnabled(
  id: string,
  enabled: boolean
): Promise<WatchlistItemResponse> {

  return patch<WatchlistItemResponse>(
    watchlistRoutes.enabled(id),
    {
      enabled,
    },
    await authenticatedOptions()
  );
}

/*
 * Eliminar una entrada propia.
 */
export async function deleteWatchlistItem(
  id: string
): Promise<DeleteWatchlistResponse> {

  return del<DeleteWatchlistResponse>(
    watchlistRoutes.remove(id),
    await authenticatedOptions()
  );
}

/*
 * Crear entradas de los diferentes
 * tipos utilizando la misma
 * autenticación.
 */
async function createWatchlistItem(
  input: CreateWatchlistItemInput
): Promise<WatchlistItem> {

  const response =
    await post<{
      item: WatchlistItem;
    }>(
      watchlistRoutes.create,
      input,
      await authenticatedOptions()
    );

  return response.item;
}

export async function followTeam(
  name: string,
  country?: string | null
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type: "team",

    label: name,

    target: {
      name,

      country:
        country ?? undefined,
    },
  });
}

export async function followCompetition(
  name: string,
  country?: string | null
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type: "competition",

    label:
      country
        ? `${name} · ${country}`
        : name,

    target: {
      name,

      competition: name,

      country:
        country ?? undefined,
    },
  });
}

export async function followCountry(
  country: string
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type: "country",

    label: country,

    target: {
      name: country,

      country,
    },
  });
}

export async function createRadarRule(
  label: string,
  rule: WatchlistRadarRule
): Promise<WatchlistItem> {

  return createWatchlistItem({
    type: "radar-rule",

    label,

    target: {
      name: label,

      country:
        rule.country ?? undefined,

      competition:
        rule.competition ?? undefined,
    },

    rule,
  });
}

