import type {
  MatchSource,
  RedCardMatchesResponse,
  RedCardRadarMatch,
  SupplementalRedCardDto,
  UnifiedRedCardItem,
  UnifiedRedCardsResponse,
} from "../../../types/radar";

export function adaptUnifiedRedCards(
  response:
    UnifiedRedCardsResponse,

  country?:
    string
): RedCardMatchesResponse {

  const matches:
    RedCardRadarMatch[] =
      [];

  for (
    const item
    of response.items
  ) {

    const adapted =
      adaptItem(
        item
      );

    if (!adapted) {
      continue;
    }

    matches.push(
      adapted
    );
  }

  /*
   * V2 actualmente puede ignorar
   * el query country.
   *
   * Conservamos el comportamiento
   * esperado por la app filtrando
   * también en cliente.
   */
  const filtered =
    filterCountry(
      matches,
      country
    );

  return {
    count:
      filtered.length,

    filters: {
      country:
        country ??
        null,
    },

    matches:
      filtered,
  };
}

function adaptItem(
  item:
    UnifiedRedCardItem
): RedCardRadarMatch | null {

  /*
   * Caso ideal:
   *
   * Flashscore ya produjo el
   * RedCardRadarMatch antiguo.
   *
   * NO reconstruimos ese objeto.
   */
  if (item.original) {

    if (
      !item.supplemental
    ) {
      return item.original;
    }

    /*
     * Si FotMob/1xBet también
     * conocen el partido:
     *
     * - conservamos el objeto viejo
     * - añadimos sources
     * - tomamos el máximo de rojas
     *
     * Nunca sumamos:
     *
     * Flashscore 1 + FotMob 1
     * NO significa 2.
     */
    return mergeSupplementalIntoOriginal(
      item.original,
      item.supplemental
    );
  }

  /*
   * Partido exclusivamente detectado
   * por FotMob/1xBet.
   */
  if (
    item.supplemental
  ) {
    return createFromSupplemental(
      item.supplemental
    );
  }

  return null;
}

function mergeSupplementalIntoOriginal(
  original:
    RedCardRadarMatch,

  supplemental:
    SupplementalRedCardDto
): RedCardRadarMatch {

  return {
    ...original,

    match: {
      ...original.match,

      sources:
        mergeSources(
          original.match.sources,
          supplemental
            .match
            .sources
        ),
    },

    redCards: {
      ...original.redCards,

      home:
        Math.max(
          original
            .redCards
            .home,

          supplemental
            .match
            .home
            .redCards
        ),

      away:
        Math.max(
          original
            .redCards
            .away,

          supplemental
            .match
            .away
            .redCards
        ),

      /*
       * Los incidents originales
       * ya tienen el formato exacto
       * que espera tu app.
       *
       * Por ahora NO inventamos
       * MatchIncident desde FotMob.
       */
      incidents:
        original
          .redCards
          .incidents,
    },
  };
}

function createFromSupplemental(
  supplemental:
    SupplementalRedCardDto
): RedCardRadarMatch {

  const source =
    supplemental.match;

  return {
    match: {
      sources:
        source.sources,

      kickoffAt:
        source.kickoffAt,

      status: {
        long:
          source.status.long,

        short:
          source.status.short,

        minute:
          source.status.minute,
      },

      competition: {
        id:
          null,

        name:
          source
            .competition
            .name,

        country:
          source
            .competition
            .country,

        logo:
          null,

        flag:
          null,

        season:
          null,

        round:
          null,
      },

      home: {
        id:
          null,

        name:
          source
            .home
            .name,

        logo:
          null,

        goals:
          source
            .home
            .goals,

        winner:
          null,
      },

      away: {
        id:
          null,

        name:
          source
            .away
            .name,

        logo:
          null,

        goals:
          source
            .away
            .goals,

        winner:
          null,
      },
    },

    redCards: {
      home:
        source
          .home
          .redCards,

      away:
        source
          .away
          .redCards,

      unknown:
        0,

      /*
       * Los eventos suplementarios
       * tienen otro DTO.
       *
       * Los incorporaremos cuando
       * adaptemos MatchIncident.
       */
      incidents:
        [],
    },
  };
}

function mergeSources(
  left:
    MatchSource[],

  right:
    MatchSource[]
): MatchSource[] {

  const result =
    new Map<
      string,
      MatchSource
    >();

  for (
    const source
    of [
      ...left,
      ...right,
    ]
  ) {

    const key =
      `${source.provider}:${source.externalId}`;

    result.set(
      key,
      source
    );
  }

  return Array.from(
    result.values()
  );
}

function filterCountry(
  matches:
    RedCardRadarMatch[],

  country?:
    string
): RedCardRadarMatch[] {

  const requested =
    normalize(
      country ??
      ""
    );

  if (
    !requested ||
    requested ===
      "all"
  ) {
    return matches;
  }

  return matches.filter(
    (
      item
    ) =>
      normalize(
        item.match
          .competition
          .country
      ) ===
      requested
  );
}

function normalize(
  value:
    string
): string {

  return value
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();
}
