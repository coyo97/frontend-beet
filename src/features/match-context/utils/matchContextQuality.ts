import type {
  MatchContext,
  TeamMatchContext,
} from "@/types/matchContext";

const TEAM_FIELDS:
  Array<
    keyof TeamMatchContext
  > =
  [
    "position",
    "points",
    "played",
    "wins",
    "draws",
    "losses",
    "goalsFor",
    "goalsAgainst",
    "goalDifference",
    "goalsPerMatch",
    "concededPerMatch",
  ];

/*
 * Resultado empírico de nuestra
 * comparación:
 *
 * Flashscore bueno:
 *   21 - 45
 *
 * SofaScore bueno:
 *   ~20 - 24
 *
 * Flashscore pobre:
 *   Perth = 1
 *
 * Por eso 20 es un umbral conservador.
 */
export const GOOD_MATCH_CONTEXT_SCORE =
  30;

function teamFieldsScore(
  team:
    TeamMatchContext
): number {

  return TEAM_FIELDS.reduce(
    (
      total,
      field
    ) =>
      team[
        field
      ] !==
      null &&
      team[
        field
      ] !==
      undefined
        ? total +
          1
        : total,
    0
  );
}

function formScore(
  team:
    TeamMatchContext
): number {

  return Math.min(
    team.form
      ?.length ??
      0,
    5
  );
}

function recentMatchesScore(
  team:
    TeamMatchContext
): number {

  return Math.min(
    team.recentMatches
      ?.length ??
      0,
    5
  );
}

export function getMatchContextQuality(
  context:
    MatchContext
): number {

  let score =
    0;

  score +=
    teamFieldsScore(
      context.home
    );

  score +=
    teamFieldsScore(
      context.away
    );

  score +=
    formScore(
      context.home
    );

  score +=
    formScore(
      context.away
    );

  score +=
    recentMatchesScore(
      context.home
    );

  score +=
    recentMatchesScore(
      context.away
    );

  if (
    context.lineups
      .status !==
    "unavailable"
  ) {
    score +=
      1;
  }

  if (
    context.lineups
      .homeFormation !==
    null
  ) {
    score +=
      1;
  }

  if (
    context.lineups
      .awayFormation !==
    null
  ) {
    score +=
      1;
  }

  return score;
}
