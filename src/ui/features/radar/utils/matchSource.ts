import type {
  LiveMatch,
  MatchSource,
} from "@/types/radar";

/*
 * Fuente estable para:
 *
 * - reviews
 * - memoria personal
 * - identificar el partido
 * - acciones generales
 *
 * NO significa necesariamente que
 * exista MatchContext para esa fuente.
 */
const SOURCE_PRIORITY = [
  "flashscore",
  "fotmob",
  "api-football",
  "bookmaker",
  "sofascore",
  "manual",
] as const;

export function getPreferredMatchSource(
  match:
    LiveMatch
): MatchSource | null {

  for (
    const provider
    of SOURCE_PRIORITY
  ) {

    const source =
      match.sources.find(
        (
          item
        ) =>
          item.provider ===
          provider
      );

    if (source) {
      return source;
    }
  }

  return match.sources[0] ??
    null;
}

export function getMatchSourceLabel(
  source:
    MatchSource | null
): string {

  if (!source) {
    return "Sin fuente";
  }

  switch (
    source.provider
  ) {

    case "flashscore":
      return "Flashscore";

    case "fotmob":
      return "FotMob";

    case "api-football":
      return "API-Football";

    case "bookmaker":
      return "1xBet";

    case "sofascore":
      return "SofaScore";

    case "manual":
      return "Manual";

    default:
      return source.provider;
  }
}
