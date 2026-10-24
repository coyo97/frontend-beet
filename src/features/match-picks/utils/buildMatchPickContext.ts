import type {
  LiveMatch,
  MatchSide,
} from "@/types/radar";

import type {
  MatchPickContext,
  MatchPickRedCardSnapshot,
  MatchPickSide,
} from "../types/matchPick";

interface Input {
  match:
    LiveMatch;

  side:
    MatchPickSide;

  redCards?:
    MatchPickRedCardSnapshot |
    null;
}

function incidentMinutes(
  redCards:
    MatchPickRedCardSnapshot,

  side:
    MatchSide
): number[] {

  return redCards
    .incidents
    .filter(
      incident =>
        incident.side ===
        side &&
        typeof incident
          .minuteNumber ===
          "number"
    )
    .map(
      incident =>
        incident.minuteNumber as
          number
    )
    .sort(
      (
        a,
        b
      ) =>
        a - b
    );
}

export function buildMatchPickContext({
  match,
  side,
  redCards =
    null,
}: Input): MatchPickContext {

  if (!redCards) {

    return {
      pickedAtMinute:
        match.status
          .minute,

      pickedAtScore: {
        home:
          match.home.goals,

        away:
          match.away.goals,
      },

      redCards:
        null,
    };
  }

  const selected =
    side ===
      "home"
      ? redCards.home
      : redCards.away;

  const opponent =
    side ===
      "home"
      ? redCards.away
      : redCards.home;

  const selectedSide:
    MatchSide =
      side;

  const opponentSide:
    MatchSide =
      side ===
        "home"
        ? "away"
        : "home";

  /*
   * Si el rival tiene una roja y
   * nuestro equipo ninguna:
   *
   * opponent = 1
   * selected = 0
   *
   * playerAdvantage = +1
   */
  const playerAdvantage =
    opponent -
    selected;

  return {
    pickedAtMinute:
      match.status
        .minute,

    pickedAtScore: {
      home:
        match.home.goals,

      away:
        match.away.goals,
    },

    redCards: {
      home:
        redCards.home,

      away:
        redCards.away,

      unknown:
        redCards.unknown,

      selected,

      opponent,

      playerAdvantage,

      selectedRedMinutes:
        incidentMinutes(
          redCards,
          selectedSide
        ),

      opponentRedMinutes:
        incidentMinutes(
          redCards,
          opponentSide
        ),
    },
  };
}
