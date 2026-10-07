import {
  env,
} from "../../config/env";

import type {
  MatchContextRequestMetadata,
} from "../../types/matchContext";

const BASE =
  `${env.API_BASE_URL}/football`;

function queryValue(
  value:
    string
): string {

  return encodeURIComponent(
    value
  );
}

export const matchContextRoutes = {
  context:
    (
      provider:
        string,

      id:
        string,

      metadata?:
        MatchContextRequestMetadata
    ) => {

      const base =
        `${BASE}/matches/${encodeURIComponent(
          provider
        )}/${encodeURIComponent(
          id
        )}/context`;

      if (!metadata) {
        return base;
      }

      const params = [

metadata.competitionId
  ? `competitionId=${queryValue(
      metadata.competitionId
    )}`
  : null,
        `competitionName=${queryValue(
          metadata.competitionName
        )}`,

        metadata.country
          ? `country=${queryValue(
              metadata.country
            )}`
          : null,

        `homeName=${queryValue(
          metadata.homeName
        )}`,

        `awayName=${queryValue(
          metadata.awayName
        )}`,
      ]
        .filter(
          (
            value
          ): value is string =>
            Boolean(
              value
            )
        )
        .join(
          "&"
        );

      return `${base}?${params}`;
    },
} as const;
