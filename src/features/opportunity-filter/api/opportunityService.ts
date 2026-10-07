import {
  get,
} from "@/async/api";

import {
  env,
} from "@/config/env";

import type {
  OpportunitiesResponse,
  OpportunityFilters,
} from "../types/opportunity";

const ENDPOINT =
  `${env.API_BASE_URL}/opportunities`;

export async function fetchOpportunities(
  filters:
    OpportunityFilters
): Promise<
  OpportunitiesResponse
> {

  return get<
    OpportunitiesResponse
  >(
    ENDPOINT,
    {
      mode:
        filters.mode,

      scanLimit:
        filters.scanLimit,

      limit:
        filters.limit,

      minDataQuality:
        filters.minDataQuality,

      requireTable:
        filters.requireTable,

      excludeFriendly:
        filters.excludeFriendly,

      excludeYouth:
        filters.excludeYouth,

      excludeReserve:
        filters.excludeReserve,

      excludeWomen:
        filters.excludeWomen,
    }
  );
}
