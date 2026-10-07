import {
  get,
} from "../api";

import {
  radarRoutes,
} from "../routes/radarRoutes";

import type {
  MatchPressureResponse,
  MatchStatisticsResponse,
} from "../../types/radar";

export async function getMatchStatistics(
  externalId: string
): Promise<
  MatchStatisticsResponse
> {

  return get<
    MatchStatisticsResponse
  >(
    radarRoutes
      .matchStatistics(
        externalId
      )
  );
}

export async function getMatchPressure(
  externalId: string
): Promise<
  MatchPressureResponse
> {

  return get<
    MatchPressureResponse
  >(
    radarRoutes
      .matchPressure(
        externalId
      )
  );
}
