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

/*
 * ========================================
 * NORMALIZATION
 * ========================================
 */

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

/*
 * ========================================
 * COUNTRY ALIASES
 * ========================================
 *
 * Distintos proveedores pueden devolver
 * el mismo país con nombres diferentes.
 *
 * Ejemplo:
 *
 * SofaScore:
 * Türkiye
 *
 * Otro proveedor:
 * Turkey
 *
 * Para el filtro deben representar
 * exactamente el mismo país.
 */

const COUNTRY_ALIASES:
  Record<
    string,
    string
  > = {
    turkey:
      "Türkiye",

    turkiye:
      "Türkiye",
  };

/*
 * Devuelve el nombre visual que vamos
 * a utilizar para agrupar el país.
 */
function canonicalCountryName(
  value:
    string
): string {
  const trimmed =
    value.trim();

  const key =
    normalize(
      trimmed
    );

  return (
    COUNTRY_ALIASES[
      key
    ] ??
    trimmed
  );
}

/*
 * ========================================
 * MATCH COUNTRY
 * ========================================
 */

export function getLiveMatchCountry(
  match:
    LiveMatch
): string {
  const country =
    match.competition
      .country
      ?.trim();

  if (!country) {
    return "Sin país";
  }

  return canonicalCountryName(
    country
  );
}

/*
 * ========================================
 * MATCH LEAGUE
 * ========================================
 */

export function getLiveMatchLeague(
  match:
    LiveMatch
): string {
  const league =
    match.competition
      .name
      ?.trim();

  if (!league) {
    return "Sin liga";
  }

  return league;
}

/*
 * ========================================
 * COUNTRY OPTIONS
 * ========================================
 */

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

    /*
     * El value es la clave normalizada.
     *
     * Ejemplo:
     *
     * Türkiye
     *    ↓
     * turkiye
     *
     * Turkey también fue convertido
     * antes a Türkiye, así que termina
     * en la misma clave.
     */
    const value =
      normalize(
        label
      );

    const current =
      groups.get(
        value
      );

    if (current) {
      current.count +=
        1;

      continue;
    }

    groups.set(
      value,
      {
        value,
        label,
        count:
          1,
      }
    );
  }

  /*
   * Ordenamos primero por cantidad
   * de partidos.
   *
   * Así los países con más partidos
   * aparecen primero.
   *
   * Si tienen la misma cantidad,
   * ordenamos alfabéticamente.
   */
  return Array
    .from(
      groups.values()
    )
    .sort(
      (
        a,
        b
      ) =>
        (
          b.count -
          a.count
        ) ||
        a.label.localeCompare(
          b.label
        )
    );
}

/*
 * ========================================
 * LEAGUE OPTIONS
 * ========================================
 */

export function buildLiveLeagueOptions(
  matches:
    LiveMatch[],

  selectedCountry:
    string | null
): LiveFilterOption[] {
  /*
   * Las ligas solamente tienen sentido
   * después de seleccionar un país.
   */
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

    /*
     * Ignoramos partidos de otros países.
     */
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
      current.count +=
        1;

      continue;
    }

    groups.set(
      value,
      {
        value,
        label,
        count:
          1,
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
        (
          b.count -
          a.count
        ) ||
        a.label.localeCompare(
          b.label
        )
    );
}

/*
 * ========================================
 * FILTER MATCHES
 * ========================================
 */

export function filterLiveMatchesByCompetition(
  matches:
    LiveMatch[],

  selectedCountry:
    string | null,

  selectedLeague:
    string | null
): LiveMatch[] {
  /*
   * IMPORTANTE:
   *
   * filter() conserva el orden original.
   *
   * Esto significa que seguimos
   * respetando orderedLiveMatches.
   *
   * Por ejemplo:
   *
   * - partidos recién iniciados arriba
   * - partidos más avanzados abajo
   *
   * No hacemos un sort adicional aquí.
   */
  return matches.filter(
    (
      match
    ) => {
      /*
       * ========================================
       * COUNTRY
       * ========================================
       */

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

      /*
       * ========================================
       * LEAGUE
       * ========================================
       */

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
