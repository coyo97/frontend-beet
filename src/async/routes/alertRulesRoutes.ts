
const BASE = "/alert-rules";

export const alertRulesRoutes = {
  list: BASE,

  create: BASE,

  replace: (id: string) =>
    `${BASE}/${encodeURIComponent(id)}`,

  enabled: (id: string) =>
    `${BASE}/${encodeURIComponent(id)}/enabled`,

  remove: (id: string) =>
    `${BASE}/${encodeURIComponent(id)}`,
} as const;

