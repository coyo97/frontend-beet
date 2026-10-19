const BASE =
  "/watchlist";

export const watchlistRoutes = {
  list:
    BASE,

  create:
    BASE,

  enabled:
    (
      id:
        string
    ) =>
      `${BASE}/${encodeURIComponent(
        id
      )}/enabled`,

  remove:
    (
      id:
        string
    ) =>
      `${BASE}/${encodeURIComponent(
        id
      )}`,
} as const;
