import {
  get,
} from "../api";

import {
  radarRoutes,
} from "../routes/radarRoutes";

import type {
  LiveMatchesResponse,
  RecentRadarSignalsResponse,
  RedCardMatchesResponse,
  RedCardPressureResponse,
  UnifiedRedCardsResponse,
  LiveMatch
} from "../../types/radar";

export interface LiveFilters {
  country?: string;
}

export async function getLiveMatches(
  filters:
    LiveFilters = {}
): Promise<
  LiveMatchesResponse
> {

  return get<
    LiveMatchesResponse
  >(
    radarRoutes.live,
    {
      country:
        filters.country,
    }
  );
}

export async function getRedCardMatches(
  filters:
    LiveFilters = {}
): Promise<
  RedCardMatchesResponse
> {

  return get<
    RedCardMatchesResponse
  >(
    radarRoutes.redCards,
    {
      country:
        filters.country,
    }
  );
}

export async function getRedCardMatchesV2(
  filters:
    LiveFilters = {}
): Promise<
  UnifiedRedCardsResponse
> {

  return get<
    UnifiedRedCardsResponse
  >(
    radarRoutes.redCardsV2,
    {
      country:
        filters.country,
    }
  );
}

export async function getRedCardPressure(
  filters:
    LiveFilters = {}
): Promise<
  RedCardPressureResponse
> {

  return get<
    RedCardPressureResponse
  >(
    radarRoutes
      .redCardPressure,

    {
      country:
        filters.country,
    }
  );
}

export async function getRecentRadarSignals(
  limit = 50
): Promise<
  RecentRadarSignalsResponse
> {

  return get<
    RecentRadarSignalsResponse
  >(
    radarRoutes
      .recentSignals,

    {
      limit,
    }
  );
}

/*
 * Partidos próximos al inicio.
 *
 * Independiente del servicio Live
 * y de las notificaciones de rojas.
 */
export async function getStartingSoonMatches(
  filters: LiveFilters = {}
): Promise<LiveMatchesResponse> {

  return get<LiveMatchesResponse>(
    radarRoutes.startingSoon,
    {
      country: filters.country,
    }
  );
}


export interface UpcomingCatalogFilters {
  day?: string;
  q?: string;
  country?: string;
  competition?: string;
  page?: number;
  limit?: number;
}

export interface UpcomingCatalogResponse {
  total: number;
  count: number;
  page: number;
  limit: number;
  pages: number;
  timezone: string;
  availableDays: {
    date: string;
    count: number;
  }[];
  matches: LiveMatch[];
}

export interface OneXBetResolveResponse {
  found: boolean;
  match: {
    id: string;
    home: string;
    away: string;
    kickoffAt: string;
    url: string;
  } | null;
  reason?: string;
  searchedCompetitions: number;
  partial: boolean;
}

export async function getUpcomingCatalog(
  filters: UpcomingCatalogFilters = {}
): Promise<UpcomingCatalogResponse> {
  return get<UpcomingCatalogResponse>(
    radarRoutes.upcomingCatalog,
    {
      day: filters.day,
      q: filters.q,
      country: filters.country,
      competition: filters.competition,
      page: String(filters.page ?? 1),
      limit: String(filters.limit ?? 30),
    }
  );
}

export async function resolveOneXBetMatch(
  match: LiveMatch
): Promise<OneXBetResolveResponse> {
  return get<OneXBetResolveResponse>(
    radarRoutes.oneXBetResolve,
    {
      home: match.home.name,
      away: match.away.name,
      kickoffAt: match.kickoffAt,
    }
  );
}


export interface OneXBetSearchCandidate {
  id: string;
  home: string;
  away: string;
  competition: string;
  kickoffAt: string | null;
  section: "live" | "prematch";
  url: string;

  matchType:
    | "same_match"
    | "same_teams_other_date"
    | "same_teams_unverified"
    | "home_team"
    | "away_team";

  score: number;
}

export interface OneXBetSearchResponse {
  count: number;
  candidates: OneXBetSearchCandidate[];

  coverage: {
    liveAvailable: boolean;
    liveGames: number;
    prematchCompetitionsChecked: number;
    prematchCompetitionsRequested: number;
  };

  limitedCoverage: boolean;
  partial: boolean;
}

export interface OneXBetSearchFilters {
  home?: string;
  away?: string;
  kickoffAt?: string;
  preferredSection?: "live" | "prematch";
}

export async function searchOneXBetCandidates(
  filters: OneXBetSearchFilters
): Promise<OneXBetSearchResponse> {
  return get<OneXBetSearchResponse>(
    radarRoutes.oneXBetSearch,
    {
      home: filters.home,
      away: filters.away,
      kickoffAt: filters.kickoffAt,
      preferredSection:
        filters.preferredSection,
    }
  );
}
