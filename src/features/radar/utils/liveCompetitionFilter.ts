import type {
  LiveMatch,
} from "@/types/radar";

export interface LiveFilterOption {
  value:
    string;

  label:
    string;

  count:
    number;
}

function normalize(
  value:
    string
): string {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase();
}

export function getLiveMatchCountry(
  match:
    LiveMatch
): string {
  const country =
    match.competition
      .country
      ?.trim();

  return country ||
    "Sin país";
}

export function getLiveMatchLeague(
  match:
    LiveMatch
): string {
  const league =
    match.competition
      .name
      ?.trim();

  return league ||
    "Sin liga";
}

export function buildLiveCountryOptions(
  matches:
    LiveMatch[]
): LiveFilterOption[] {
  const groups =
    new Map<
      string,
      LiveFilterOption
    >();

  for (
    const match
    of matches
  ) {
    const label =
      getLiveMatchCountry(
        match
      );

    const value =
      normalize(
        label
      );

    const current =
      groups.get(
        value
      );

    if (current) {
      current.count += 1;

      continue;
    }

    groups.set(
      value,
      {
        value,
        label,
        count: 1,
      }
    );
  }

  return Array
    .from(
      groups.values()
    )
    .sort(
      (
        a,
        b
      ) =>
        b.count -
          a.count ||
        a.label
          .localeCompare(
            b.label
          )
    );
}

export function buildLiveLeagueOptions(
  matches:
    LiveMatch[],

  selectedCountry:
    string | null
): LiveFilterOption[] {
  if (
    !selectedCountry
  ) {
    return [];
  }

  const groups =
    new Map<
      string,
      LiveFilterOption
    >();

  for (
    const match
    of matches
  ) {
    const country =
      normalize(
        getLiveMatchCountry(
          match
        )
      );

    if (
      country !==
      selectedCountry
    ) {
      continue;
    }

    const label =
      getLiveMatchLeague(
        match
      );

    const value =
      normalize(
        label
      );

    const current =
      groups.get(
        value
      );

    if (current) {
      current.count += 1;

      continue;
    }

    groups.set(
      value,
      {
        value,
        label,
        count: 1,
      }
    );
  }

  return Array
    .from(
      groups.values()
    )
    .sort(
      (
        a,
        b
      ) =>
        b.count -
          a.count ||
        a.label
          .localeCompare(
            b.label
          )
    );
}

export function filterLiveMatchesByCompetition(
  matches:
    LiveMatch[],

  selectedCountry:
    string | null,

  selectedLeague:
    string | null
): LiveMatch[] {
  /*
   * Muy importante:
   *
   * filter() conserva el orden.
   *
   * Por tanto seguimos respetando
   * orderedLiveMatches:
   *
   * recién iniciados arriba,
   * partidos avanzados abajo.
   */

  return matches.filter(
    (
      match
    ) => {
      if (
        selectedCountry
      ) {
        const country =
          normalize(
            getLiveMatchCountry(
              match
            )
          );

        if (
          country !==
          selectedCountry
        ) {
          return false;
        }
      }

      if (
        selectedLeague
      ) {
        const league =
          normalize(
            getLiveMatchLeague(
              match
            )
          );

        if (
          league !==
          selectedLeague
        ) {
          return false;
        }
      }

      return true;
    }
  );
}
