import type {
  FootballProviderId,
} from "./radar";

export type CompetitionFormat =
  | "table"
  | "cup"
  | "playoff"
  | "qualifier"
  | "friendly"
  | "unknown";

export type RecentResult =
  | "W"
  | "D"
  | "L";

export interface RecentTeamMatch {
  id:
    string | null;

  result:
    RecentResult;

  opponentName:
    string;

  opponentPosition:
    number | null;

  homeAway:
    "home" | "away";

  goalsFor:
    number;

  goalsAgainst:
    number;

  playedAt:
    string | null;
}

export interface TeamMatchContext {
  id:
    string | null;

  name:
    string;

  position:
    number | null;

  points:
    number | null;

  played:
    number | null;

  wins:
    number | null;

  draws:
    number | null;

  losses:
    number | null;

  goalsFor:
    number | null;

  goalsAgainst:
    number | null;

  goalDifference:
    number | null;

  goalsPerMatch:
    number | null;

  concededPerMatch:
    number | null;

  form:
    RecentResult[];

  recentMatches:
    RecentTeamMatch[];
}

export interface MatchContext {
  source: {
    provider:
      FootballProviderId;

    externalId:
      string;
  };

  competition: {
    name:
      string;

    country:
      string;

    format:
      CompetitionFormat;

    tableAvailable:
      boolean;

    tableScope:
      "competition" |
      "none";

    annualDomesticTableAvailable:
      boolean;

    note:
      string | null;
  };

  home:
    TeamMatchContext;

  away:
    TeamMatchContext;

  lineups: {
    status:
      | "confirmed"
      | "partial"
      | "unavailable";

    homeFormation:
      string | null;

    awayFormation:
      string | null;

    homeStarters:
      number | null;

    awayStarters:
      number | null;
  };

  availability: {
    details:
      boolean;

    standings:
      boolean;

    recentForm:
      boolean;

    lineups:
      boolean;
  };

  fetchedAt:
    string;
}

export interface MatchContextResponse {
  context:
    MatchContext;
}

export interface MatchContextRequestMetadata {
	competitionId:
  string | null;

  competitionName:
    string;

  country:
    string | null;

  homeName:
    string;

  awayName:
    string;
}
