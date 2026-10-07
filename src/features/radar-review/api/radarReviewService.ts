import {
  env,
} from "@/config/env";

import type {
  RadarReview,
  StoredRadarReviewStatus,
} from "../types/radarReview";

const BASE =
  `${env.API_BASE_URL}/radar/reviews`;

export async function fetchRadarReviews():
  Promise<
    RadarReview[]
  > {

  const response =
    await fetch(
      BASE
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Could not load radar reviews: ${response.status}`
    );
  }

  const body =
    await response.json() as {
      items:
        RadarReview[];
    };

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
    `${BASE}/${encodeURIComponent(provider)}/${encodeURIComponent(externalId)}`;

  const response =
    await fetch(
      url,
      {
        method:
          "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            status,
          }),
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Could not save radar review: ${response.status}`
    );
  }

  const body =
    await response.json() as {
      item:
        RadarReview;
    };

  return body.item;
}

export async function resetRadarReview(
  provider:
    string,

  externalId:
    string
): Promise<void> {

  const url =
    `${BASE}/${encodeURIComponent(provider)}/${encodeURIComponent(externalId)}`;

  const response =
    await fetch(
      url,
      {
        method:
          "DELETE",
      }
    );

  if (
    !response.ok &&
    response.status !==
      204
  ) {
    throw new Error(
      `Could not reset radar review: ${response.status}`
    );
  }
}
