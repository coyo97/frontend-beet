import {
  get,
} from "@/async/api";

import {
  env,
} from "@/config/env";

import type {
  RecentMatch,
  RecentMatchesResponse,
} from "../types/recentMatch";

const ENDPOINT =
  `${env.API_BASE_URL}/football/recent`;

interface Options {
  hours?:
    number;

  limit?:
    number;
}

function getSourceKeys(
  item:
    RecentMatch
): string[] {

  const sources =
    Array.isArray(
      item?.match?.sources
    )
      ? item.match.sources
      : [];

  return sources
    .filter(
      source =>
        Boolean(
          source?.provider
        ) &&
        Boolean(
          source?.externalId
        )
    )
    .map(
      source =>
        `${source.provider}:${source.externalId}`
    );
}

function getFallbackKey(
  item:
    RecentMatch
): string {

  const home =
    item?.match?.home?.name ??
    "unknown-home";

  const away =
    item?.match?.away?.name ??
    "unknown-away";

  const kickoff =
    item?.match?.kickoffAt ??
    "unknown-kickoff";

  return [
    home
      .trim()
      .toLowerCase(),

    away
      .trim()
      .toLowerCase(),

    kickoff,
  ].join(
    ":"
  );
}

function dedupeRecentMatches(
  items:
    RecentMatch[]
): RecentMatch[] {

  const result:
    RecentMatch[] = [];

  const seenSources =
    new Set<string>();

  const seenFallbacks =
    new Set<string>();

  for (
    const item
    of items
  ) {

    const match =
      item?.match;

    if (
      !match ||
      !match.home ||
      !match.away ||
      !match.competition
    ) {
      console.warn(
        "[RecentMatches] Invalid match ignored:",
        item
      );

      continue;
    }

    const sourceKeys =
      getSourceKeys(
        item
      );

    const fallbackKey =
      getFallbackKey(
        item
      );

    const duplicatedBySource =
      sourceKeys.some(
        key =>
          seenSources.has(
            key
          )
      );

    const duplicatedByFallback =
      seenFallbacks.has(
        fallbackKey
      );

    if (
      duplicatedBySource ||
      duplicatedByFallback
    ) {
      console.warn(
        "[RecentMatches] Duplicate ignored:",
        {
          sourceKeys,
          fallbackKey,
          home:
            match.home.name,
          away:
            match.away.name,
        }
      );

      continue;
    }

    for (
      const key
      of sourceKeys
    ) {
      seenSources.add(
        key
      );
    }

    seenFallbacks.add(
      fallbackKey
    );

    result.push(
      item
    );
  }

  return result;
}

export async function fetchRecentMatches(
  options:
    Options = {}
): Promise<
  RecentMatch[]
> {

  const response =
    await get<
      RecentMatchesResponse
    >(
      ENDPOINT,
      {
        hours:
          options.hours ??
          48,

        limit:
          options.limit ??
          1000,
      }
    );

  const matches =
    Array.isArray(
      response?.matches
    )
      ? response.matches
      : [];

  const deduped =
    dedupeRecentMatches(
      matches
    );

  console.log(
    "[RecentMatches]",
    {
      received:
        matches.length,

      deduped:
        deduped.length,

      removed:
        matches.length -
        deduped.length,
    }
  );

  return deduped;
}
