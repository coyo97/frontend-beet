import type {
  LiveMatch,
} from "@/types/radar";

import type {
  SharedMatchInsight,
} from "../types/sharedMatch";

export function sharedMatchToLiveMatch(
  item:
    SharedMatchInsight
): LiveMatch {

  return {
    sources:
      item.match.sources as
        LiveMatch["sources"],

    kickoffAt:
      item.match.kickoffAt,

    status: {
      long:
        "Shared",

      short:
        item.match.minute !==
        null
          ? "LIVE"
          : "SHARED",

      minute:
        item.match.minute,
    },

    competition: {
      id:
        null,

      name:
        item.match
          .competitionName ??
        "Sin liga",

      country:
        item.match
          .country ??
        "Sin país",

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
        item.match
          .homeName,

      logo:
        null,

      goals:
        item.match
          .homeGoals,

      winner:
        null,
    },

    away: {
      id:
        null,

      name:
        item.match
          .awayName,

      logo:
        null,

      goals:
        item.match
          .awayGoals,

      winner:
        null,
    },
  };
}
