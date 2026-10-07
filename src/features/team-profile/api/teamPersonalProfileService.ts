import {
  env,
} from "@/config/env";

import {
  getTeamMemoryOwnerId,
} from "@/features/team-memory/storage/teamMemoryOwner";

import type {
  SaveTeamPersonalProfileInput,
  TeamPersonalProfile,
} from "../types/teamPersonalProfile";

const BASE =
  `${env.API_BASE_URL}/team-profiles`;

async function getHeaders(
  json =
    false
): Promise<
  Record<
    string,
    string
  >
> {

  const ownerId =
    await getTeamMemoryOwnerId();

  return {
    Accept:
      "application/json",

    "x-football-radar-owner-id":
      ownerId,

    ...(json
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),
  };
}

async function getError(
  response:
    Response,

  fallback:
    string
): Promise<string> {

  try {
    const body =
      await response
        .clone()
        .json() as {
          message?:
            unknown;
        };

    if (
      typeof body.message ===
        "string" &&
      body.message.trim()
    ) {
      return body
        .message
        .trim();
    }
  } catch {
    // Sin JSON.
  }

  return `${fallback}: ${response.status}`;
}

export async function fetchTeamPersonalProfile(
  teamName:
    string
): Promise<
  TeamPersonalProfile |
  null
> {

  const headers =
    await getHeaders();

  const response =
    await fetch(
      `${BASE}/by-team?team=${encodeURIComponent(
        teamName
      )}`,
      {
        method:
          "GET",

        headers,
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      await getError(
        response,
        "Could not load team profile"
      )
    );
  }

  const body =
    await response
      .json() as {
        profile:
          TeamPersonalProfile |
          null;
      };

  return body.profile;
}

export async function fetchTeamPersonalProfiles():
  Promise<
    TeamPersonalProfile[]
  > {

  const headers =
    await getHeaders();

  const response =
    await fetch(
      BASE,
      {
        method:
          "GET",

        headers,
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      await getError(
        response,
        "Could not load team profiles"
      )
    );
  }

  const body =
    await response
      .json() as {
        items:
          TeamPersonalProfile[];
      };

  return body.items;
}

export async function saveTeamPersonalProfile(
  input:
    SaveTeamPersonalProfileInput
): Promise<
  TeamPersonalProfile |
  null
> {

  const headers =
    await getHeaders(
      true
    );

  const response =
    await fetch(
      BASE,
      {
        method:
          "PUT",

        headers,

        body:
          JSON.stringify(
            input
          ),
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      await getError(
        response,
        "Could not save team profile"
      )
    );
  }

  const body =
    await response
      .json() as {
        profile:
          TeamPersonalProfile |
          null;
      };

  return body.profile;
}
