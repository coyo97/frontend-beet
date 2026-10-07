import type {
  FootballProviderId,
  LiveMatch,
  RedCardPressureSignal,
} from "./radar";

export type WatchlistItemType =
  | "match"
  | "team"
  | "competition"
  | "country"
  | "radar-rule";

export interface WatchlistTarget {
  provider?:
    FootballProviderId;

  externalId?:
    string;

  name?:
    string;

  country?:
    string;

  competition?:
    string;

  homeName?:
    string;

  awayName?:
    string;

  kickoffAt?:
    string;
}

export interface WatchlistRadarRule {
  event:
    "RED_CARD_PRESSURE";

  country?:
    string;

  competition?:
    string;

  teamName?:
    string;

  minimumStrength?:
    "clear" |
    "strong";

  minimumMinute?:
    number;

  maximumMinute?:
    number;

  minimumPressureScore?:
    number;

  teamMustHaveAdvantage?:
    boolean;
}

export interface WatchlistItem {
  id:
    string;

  type:
    WatchlistItemType;

  label:
    string;

  dedupKey:
    string;

  enabled:
    boolean;

  target:
    WatchlistTarget;

  rule:
    WatchlistRadarRule | null;

  createdAt:
    string;

  updatedAt:
    string;
}

export interface WatchlistResponse {
  count:
    number;

  items:
    WatchlistItem[];
}

export interface WatchlistItemResponse {
  item:
    WatchlistItem;
}

export interface DeleteWatchlistResponse {
  deleted:
    boolean;
}

export interface CreateMatchWatchlistInput {
  match:
    LiveMatch;
}

export interface WatchlistAlertEnvelope {
  emittedAt:
    string;

  matchedBy:
    WatchlistItemType;

  watchlistItem:
    WatchlistItem;

  signal:
    RedCardPressureSignal;
}
export interface WatchlistAlertEntry {
  id: string;

  receivedAt: string;

  payload:
    WatchlistAlertEnvelope;
}
export interface CreateMatchWatchlistInput {
  match:
    LiveMatch;
}

export interface CreateWatchlistItemInput {
  type:
    WatchlistItemType;

  label:
    string;

  target:
    WatchlistTarget;

  rule?:
    WatchlistRadarRule;
}

export interface WatchlistAlertEnvelope {
  emittedAt:
    string;

  matchedBy:
    WatchlistItemType;

  watchlistItem:
    WatchlistItem;

  signal:
    RedCardPressureSignal;
}

export interface WatchlistAlertEntry {
  id:
    string;

  receivedAt:
    string;

  payload:
    WatchlistAlertEnvelope;
}
