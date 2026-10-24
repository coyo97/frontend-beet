import {
  post,
} from "@/async/api";

import type {
  LateGoalProfilesResponse,
  TeamLateGoalProfile,
} from "../types/lateGoal";

const ENDPOINT =
  "/football/teams/late-goal-profiles";

export async function fetchLateGoalProfiles(
  teamNames:
    string[],

  limit =
    50
): Promise<
  TeamLateGoalProfile[]
> {

  const response =
    await post<
      LateGoalProfilesResponse
    >(
      ENDPOINT,
      {
        teamNames,
        limit,
      }
    );

  return response.profiles;
}
