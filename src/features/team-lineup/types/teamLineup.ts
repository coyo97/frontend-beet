export type LineupStatus =
  | "confirmed"
  | "partial"
  | "unavailable";

export type StarterFrequency =
  | "habitual"
  | "rotation"
  | "occasional"
  | "unseen";

export type RotationLevel =
  | "unknown"
  | "low"
  | "medium"
  | "high";

export type HistoryConfidence =
  | "none"
  | "low"
  | "medium"
  | "high";

export interface LineupPlayer {
  playerId:
    string | null;

  name:
    string;

  position:
    string | null;

  isGoalkeeper:
    boolean;
}

export interface LineupTeam {
  teamId:
    string | null;

  teamName:
    string;

  starters:
    LineupPlayer[];

  substitutes:
    LineupPlayer[];
}

export interface MatchLineupSnapshot {
  provider:
    string;

  externalId:
    string;

  sourceKey:
    string;

  kickoffAt:
    string | null;

  status:
    LineupStatus;

  home:
    LineupTeam;

  away:
    LineupTeam;

  fetchedAt:
    string;
}

export interface StarterHistoryStat {
  playerId:
    string | null;

  name:
    string;

  position:
    string | null;

  starts:
    number;

  matchesObserved:
    number;

  startRate:
    number;

  frequency:
    "habitual" |
    "rotation" |
    "occasional";
}

export interface CurrentStarterAssessment
  extends LineupPlayer
{
  historyStarts:
    number;

  historyMatches:
    number;

  startRate:
    number | null;

  frequency:
    StarterFrequency;
}

export interface TeamLineupAnalysis {
  teamId:
    string | null;

  teamName:
    string;

  historicalMatches:
    number;

  confidence:
    HistoryConfidence;

  rotationLevel:
    RotationLevel;

  habitualPool:
    StarterHistoryStat[];

  habitualPresent:
    number;

  habitualMissing:
    StarterHistoryStat[];

  habitualCoverage:
    number | null;

  unseenCurrentStarters:
    number;

  currentStarters:
    CurrentStarterAssessment[];
}

export interface MatchLineupAnalysis {
  sourceKey:
    string;

  historicalLimit:
    number;

  home:
    TeamLineupAnalysis;

  away:
    TeamLineupAnalysis;
}

export interface HistoryBootstrapResult {
  teamId:
    string;

  requested:
    number;

  discovered:
    number;

  saved:
    number;

  reused:
    number;

  skipped:
    number;

  failed:
    number;

  sourceKeys:
    string[];
}

export interface InspectMatchLineupResponse {
  lineupSource:
    "cache" |
    "provider";

  lineup:
    MatchLineupSnapshot;

  analysis:
    MatchLineupAnalysis;

  history: {
    bootstrapRequested:
      boolean;

    minimumMatches:
      number;

    historyLimit:
      number;

    homeBootstrap:
      HistoryBootstrapResult |
      null;

    awayBootstrap:
      HistoryBootstrapResult |
      null;
  };
}
