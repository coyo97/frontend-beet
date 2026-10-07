import {
  env,
} from "../../config/env";

const RADAR_BASE =
  `${env.API_BASE_URL}/radar`;

const FOOTBALL_BASE =
  `${env.API_BASE_URL}/football`;

export const radarRoutes = {
  live:
    `${FOOTBALL_BASE}/live`,

  redCards:
    `${RADAR_BASE}/red-cards`,

  redCardsV2:
  `${RADAR_BASE}/red-cards/v2`,

  redCardPressure:
    `${RADAR_BASE}/red-card-pressure`,

  recentSignals:
    `${RADAR_BASE}/signals/recent`,

  matchStatistics:
    (
      id: string
    ) =>
      `${FOOTBALL_BASE}/matches/${encodeURIComponent(
        id
      )}/statistics`,

  matchPressure:
    (
      id: string
    ) =>
      `${RADAR_BASE}/matches/${encodeURIComponent(
        id
      )}/pressure`,
} as const;
