import {
  get,
} from "../api";

import {
  matchContextRoutes,
} from "../routes/matchContextRoutes";

import type {
  MatchContext,
  MatchContextRequestMetadata,
  MatchContextResponse,
} from "../../types/matchContext";

export async function getMatchContext(
  provider:
    string,

  id:
    string,

  metadata?:
    MatchContextRequestMetadata
): Promise<
  MatchContext
> {

  const response =
    await get<
      MatchContextResponse
    >(
      matchContextRoutes
        .context(
          provider,
          id,
          metadata
        )
    );

  return response.context;
}
