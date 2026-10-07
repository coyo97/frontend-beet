import {
  env,
} from "../../config/env";

const BASE =
  `${env.API_BASE_URL}/watchlist`;

export const watchlistRoutes = {
  list:
    BASE,

  create:
    BASE,

  enabled:
    (
      id: string
    ) =>
      `${BASE}/${encodeURIComponent(
        id
      )}/enabled`,

  remove:
    (
      id: string
    ) =>
      `${BASE}/${encodeURIComponent(
        id
      )}`,
} as const;
