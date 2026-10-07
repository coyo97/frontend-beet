import type {
  LiveMatch,
} from "@/types/radar";

export interface RecentMatch {
  match:
    LiveMatch;

  lastSeenAt:
    string;

  endedAt:
    string;

  resultConfirmed:
    boolean;
}

export interface RecentMatchesResponse {
  count:
    number;

  matches:
    RecentMatch[];
}
