import type {
  LiveMatch,
} from "@/types/radar";

export type BettorFilterMode =
  | "all"
  | "clear-favorite"
  | "moderate-favorite"
  | "balanced"
  | "form-mismatch"
  | "danger-watch"
  | "home-strong"
  | "away-strong";

export type MatchOpportunityProfile =
  | "clear-favorite"
  | "moderate-favorite"
  | "slight-edge"
  | "balanced"
  | "insufficient-data";

export type OpportunitySide =
  | "home"
  | "away"
  | null;

export type TeamDangerLevel =
  | "low"
  | "medium"
  | "high";

export type RecentResult =
  | "W"
  | "D"
  | "L";

export interface NotableRecentWin {
  opponentName:
    string;

  opponentPosition:
    number;

  reason:
    | "top-3"
    | "top-5"
    | "higher-ranked";
}

export interface TeamOpportunitySnapshot {
  name:
    string;

  strength:
    number;

  matchStrength:
    number;

  dataQuality:
    number;

  position:
    number | null;

  points:
    number | null;

  played:
    number | null;

  pointsPerGame:
    number | null;

  wins:
    number | null;

  draws:
    number | null;

  losses:
    number | null;

  winRate:
    number | null;

  goalDifferencePerGame:
    number | null;

  form:
    RecentResult[];

  formPoints:
    number;

  formMaxPoints:
    number;

  recentMatchesCount:
    number;

  dangerScore:
    number;

  dangerLevel:
    TeamDangerLevel;

  notableWins:
    NotableRecentWin[];
}

export interface MatchOpportunity {
  match:
    LiveMatch;

  contextSource: {
    provider:
      string;

    externalId:
      string;
  };

  profile:
    MatchOpportunityProfile;

  favoredSide:
    OpportunitySide;

  hasTable:
    boolean;

  dataQuality:
    number;

  rawGap:
    number;

  adjustedGap:
    number;

  home:
    TeamOpportunitySnapshot;

  away:
    TeamOpportunitySnapshot;

  signals:
    string[];

  reasons:
    string[];

  warnings:
    string[];
}

export interface OpportunityFilters {
  mode:
    BettorFilterMode;

  scanLimit:
    number;

  limit:
    number;

  minDataQuality:
    number;

  requireTable:
    boolean;

  excludeFriendly:
    boolean;

  excludeYouth:
    boolean;

  excludeReserve:
    boolean;

  excludeWomen:
    boolean;
}

export interface OpportunitiesResponse {
  mode:
    BettorFilterMode;

  totalLive:
    number;

  candidates:
    number;

  analyzed:
    number;

  unavailable:
    number;
      pending:
    number;

  refreshed:
    number;

  opportunities:
    MatchOpportunity[];
}
