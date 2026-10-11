import type {
  LiveMatch,
} from "@/types/radar";

import {
  getPreferredMatchSource,
} from "@/ui/features/radar/utils/matchSource";

import {
  teamMemoryKey,
} from "@/features/team-memory/store/teamMemoryStore";

export function matchPickKey(
  match:
    LiveMatch
): string {

  const source =
    getPreferredMatchSource(
      match
    ) ??
    match.sources[0];

  if (source) {
    return (
      `${source.provider}:` +
      source.externalId
    );
  }

  return [
    teamMemoryKey(
      match.home.name
    ),

    teamMemoryKey(
      match.away.name
    ),

    match.kickoffAt,
  ].join(
    ":"
  );
}
