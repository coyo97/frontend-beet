import {
  del,
  get,
  put,
} from "@/async/api";

import type {
  RadarReview,
  StoredRadarReviewStatus,
} from "../types/radarReview";

const BASE =
  "/radar/reviews";

export async function fetchRadarReviews():
  Promise<
    RadarReview[]
  > {

  const body =
    await get<{
      items:
        RadarReview[];
    }>(
      BASE
    );

  return body.items;
}

export async function saveRadarReview(
  provider:
    string,

  externalId:
    string,

  status:
    StoredRadarReviewStatus
): Promise<
  RadarReview
> {

  const url =
    `${BASE}/${encodeURIComponent(
      provider
    )}/${encodeURIComponent(
      externalId
    )}`;

  const body =
    await put<{
      item:
        RadarReview;
    }>(
      url,
      {
        status,
      }
    );

  return body.item;
}

export async function resetRadarReview(
  provider:
    string,

  externalId:
    string
): Promise<void> {

  const url =
    `${BASE}/${encodeURIComponent(
      provider
    )}/${encodeURIComponent(
      externalId
    )}`;

  await del<
    unknown
  >(
    url
  );
}
