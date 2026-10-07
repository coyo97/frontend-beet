import type {
  LiveMatch,
  MatchSource,
} from "@/types/radar";

const PROVIDER_ORDER = [
  "flashscore",
  "fotmob",
  "sofascore",
  "bookmaker",
] as const;

export function getMatchContextSources(
  match:
    LiveMatch
): MatchSource[] {

  const result:
    MatchSource[] =
    [];

  for (
    const provider
    of PROVIDER_ORDER
  ) {

    const source =
      match.sources.find(
        item =>
          item.provider ===
          provider
      );

    if (
      source
    ) {
      result.push(
        source
      );
    }
  }

  return result;
}

/*
 * Compatibilidad con componentes
 * existentes.
 *
 * Sigue devolviendo la primera fuente
 * preferida.
 */
export function getMatchContextSource(
  match:
    LiveMatch
): MatchSource | null {

  return (
    getMatchContextSources(
      match
    )[0] ??
    null
  );
}
