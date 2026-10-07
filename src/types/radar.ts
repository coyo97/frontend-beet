export type FootballProviderId =
  | "api-football"
  | "flashscore"
  | "sofascore"
  | "fotmob"
  | "bookmaker"
  | "manual";

export type MatchSide =
  | "home"
  | "away"
  | null;

export interface MatchSource {
  provider:
    FootballProviderId;

  externalId:
    string;
}

export interface RedCardRadarMatch {
  match:
    LiveMatch;

  redCards: {
    home:
      number;

    away:
      number;

    unknown:
      number;

    incidents:
      MatchIncident[];
  };
}

export interface RedCardMatchesResponse {
  count:
    number;

  filters?: {
    country:
      string | null;
  };

  matches:
    RedCardRadarMatch[];
}

export interface SupplementalRedCardEvent {
  provider:
    FootballProviderId;

  side:
    MatchSide;

  minute:
    number | null;

  addedTime:
    number | null;

  playerName:
    string | null;

  type:
    "red"
    | "second-yellow-red"
    | "unknown-red";
}

export interface SupplementalRedCardMatch {
  kickoffAt:
    string;

  status: {
    long:
      string;

    short:
      string;

    minute:
      number | null;
  };

  competition: {
    name:
      string;

    country:
      string;
  };

  home: {
    name:
      string;

    goals:
      number | null;

    redCards:
      number;
  };

  away: {
    name:
      string;

    goals:
      number | null;

    redCards:
      number;
  };

  sources:
    MatchSource[];
}

export interface SupplementalRedCardDto {
  match:
    SupplementalRedCardMatch;

  detection: {
    totalRedCards:
      number;

    confidence:
      "high"
      | "medium"
      | "low";

    providers:
      FootballProviderId[];

    events:
      SupplementalRedCardEvent[];
  };
}

export interface UnifiedRedCardItem {
  key:
    string;

  providers:
    FootballProviderId[];

  /*
   * Si Flashscore ya conocía
   * el partido, aquí viene el
   * objeto antiguo que la UI
   * ya sabe renderizar.
   */
  original:
    RedCardRadarMatch | null;

  /*
   * Datos adicionales de
   * FotMob / 1xBet.
   */
  supplemental:
    SupplementalRedCardDto | null;
}

export interface UnifiedRedCardsResponse {
  originalCount:
    number;

  supplementalCount:
    number;

  mergedCount:
    number;

  items:
    UnifiedRedCardItem[];

  fetchedAt:
    string;

  degraded?:
    boolean;
}

export interface LiveTeam {
  id:
    string | null;

  name:
    string;

  logo:
    string | null;

  goals:
    number | null;

  winner:
    boolean | null;
}

export interface LiveCompetition {
  id:
    string | null;

  name:
    string;

  country:
    string;

  logo:
    string | null;

  flag:
    string | null;

  season:
    string | null;

  round:
    string | null;
}

export interface LiveMatch {
  sources:
    MatchSource[];

  kickoffAt:
    string;

  status: {
    long:
      string;

    short:
      string;

    minute:
      number | null;
  };

  competition:
    LiveCompetition;

  home:
    LiveTeam;

  away:
    LiveTeam;
}

export interface MatchIncident {
  id:
    string | null;

  side:
    MatchSide;

  minute:
    string | null;

  minuteNumber:
    number | null;

  type:
    string | null;

  reason:
    string | null;

  description:
    string | null;

  player: {
    id:
      string | null;

    name:
      string | null;
  } | null;
}

export interface PressureAnalysis {
  homeScore:
    number;

  awayScore:
    number;

  difference:
    number;

  dominantSide:
    MatchSide;

  level:
    | "balanced"
    | "slight"
    | "clear"
    | "strong";

  confidence:
    | "low"
    | "medium"
    | "high";

  availableWeight:
    number;

  components:
    PressureComponent[];
}

export interface RedCardPressureSignal {
  type:
    "RED_CARD_PRESSURE";

  match:
    LiveMatch;

  disadvantagedSide:
    "home" | "away";

  advantagedSide:
    "home" | "away";

  playerAdvantage:
    number;

  redCards: {
    home:
      number;

    away:
      number;

    verifiedPlayerIncidents:
      MatchIncident[];
  };

  pressure:
    PressureAnalysis;

  strength:
    "clear" | "strong";
}

export interface LiveMatchesResponse {
  count:
    number;

  filters?: {
    country:
      string | null;
  };

  matches:
    LiveMatch[];
}

export interface RedCardPressureResponse {
  count:
    number;

  filters?: {
    country:
      string | null;
  };

  signals:
    RedCardPressureSignal[];
}

export interface StoredRadarSignal {
  publishedAt:
    string;

  signal:
    RedCardPressureSignal;
}

export interface RecentRadarSignalsResponse {
  count:
    number;

  signals:
    StoredRadarSignal[];
}

export interface RadarSocketEnvelope {
  emittedAt:
    string;

  signal:
    RedCardPressureSignal;
}

export type RedCardAffectedSide =
  | "home"
  | "away"
  | "both"
  | "unknown";

export interface RedCardDetectedSignal {
  type:
    "red-card-detected";

  id:
    string;

  fingerprint:
    string;

  match:
    LiveMatch;

  redCards: {
    home:
      number;

    away:
      number;

    unknown:
      number;

    total:
      number;
  };

  affectedSide:
    RedCardAffectedSide;

  providers:
    FootballProviderId[];

  detectedAt:
    string;
}

export interface RedCardDetectedSocketEnvelope {
  emittedAt:
    string;

  signal:
    RedCardDetectedSignal;
}

export interface MatchStatisticValue {
  raw:
    | string
    | number
    | null;

  numeric:
    number | null;
}

export interface MatchStatisticMetric {
  key:
    string;

  label:
    string;

  home:
    MatchStatisticValue;

  away:
    MatchStatisticValue;
}

export interface MatchStatistics {
  source:
    MatchSource;

  period:
    | "all"
    | "first-half"
    | "second-half"
    | "unknown";

  metrics:
    MatchStatisticMetric[];
}

export interface MatchStatisticsResponse {
  matchId:
    string;

  provider:
    FootballProviderId;

  statistics:
    MatchStatistics[];
}

export interface PressureComponent {
  metric:
    string;

  label:
    string;

  weight:
    number;

  homeValue:
    number;

  awayValue:
    number;

  homeShare:
    number;

  awayShare:
    number;
}
export interface MatchPressureResponse {
  matchId:
    string;

  provider:
    FootballProviderId;

  available:
    boolean;

  analysis:
    PressureAnalysis | null;
}
