export type StoredRadarReviewStatus =
  | "marked"
  | "reviewed"
  | "dismissed";

export type RadarReviewStatus =
  | "new"
  | StoredRadarReviewStatus;

export interface RadarReview {
  id:
    string;

  provider:
    string;

  externalId:
    string;

  status:
    StoredRadarReviewStatus;

  createdAt:
    string;

  updatedAt:
    string;
}
