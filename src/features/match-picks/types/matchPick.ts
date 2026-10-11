export type MatchPickSide =
  | "home"
  | "away";

export interface MatchPick {
  key:
    string;

  side:
    MatchPickSide;

  teamName:
    string;

  opponentName:
    string;

  homeName:
    string;

  awayName:
    string;

  competitionName:
    string;

  kickoffAt:
    string;

  provider:
    string |
    null;

  externalId:
    string |
    null;

  createdAt:
    string;
}
