import {
  post,
} from "@/async/api";

import type {
  InspectMatchLineupResponse,
} from "../types/teamLineup";

const ENDPOINT =
  "/team-lineup/inspect";

export async function inspectMatchLineup(
  provider:
    string,

  externalId:
    string,

  bootstrapHistory =
    false
): Promise<
  InspectMatchLineupResponse
> {

  return post<
    InspectMatchLineupResponse
  >(
    ENDPOINT,
    {
      provider,
      externalId,

      bootstrapHistory,

      historyLimit:
        5,
    }
  );
}
