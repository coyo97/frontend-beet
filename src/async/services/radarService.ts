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
  UnifiedRedCardsResponse
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
