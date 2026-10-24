import type {
  MatchIncident,
} from "@/types/radar";

export type MatchPickSide =
  | "home"
  | "away";

export interface MatchPickRedCardSnapshot {
  home:
    number;

  away:
    number;

  unknown:
    number;

  incidents:
    MatchIncident[];
}

export interface MatchPickRedCardContext {
  home:
    number;

  away:
    number;

  unknown:
    number;

  selected:
    number;

  opponent:
    number;

  /*
   * Positivo:
   * apostamos con más jugadores.
   *
   * Negativo:
   * apostamos con menos jugadores.
   */
  playerAdvantage:
    number;

  selectedRedMinutes:
    number[];

  opponentRedMinutes:
    number[];
}

export interface MatchPickContext {
  pickedAtMinute:
    number | null;

  pickedAtScore: {
    home:
      number | null;

    away:
      number | null;
  };

  redCards:
    MatchPickRedCardContext |
    null;
}

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
    string | null;

  externalId:
    string | null;

  /*
   * Opcional para mantener compatibilidad
   * con apuestas antiguas guardadas en
   * AsyncStorage.
   */
  context?:
    MatchPickContext |
    null;

  createdAt:
    string;
}
