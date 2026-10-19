import {
  get,
  put,
  type ApiRequestOptions,
} from "@/async/api";

import {
  getTeamMemoryOwnerId,
} from "@/features/team-memory/storage/teamMemoryOwner";

import type {
  SaveTeamPersonalProfileInput,
  TeamPersonalProfile,
} from "../types/teamPersonalProfile";

const BASE =
  "/team-profiles";

async function ownerOptions():
  Promise<
    ApiRequestOptions
  > {

  const ownerId =
    await getTeamMemoryOwnerId();

  return {
    headers: {
      "x-football-radar-owner-id":
        ownerId,
    },
  };
}

export async function fetchTeamPersonalProfile(
  teamName:
    string
): Promise<
  TeamPersonalProfile |
  null
> {

  const body =
    await get<{
      profile:
        TeamPersonalProfile |
        null;
    }>(
      `${BASE}/by-team`,
      {
        team:
          teamName,
      },
      await ownerOptions()
    );

  return body.profile;
}

export async function fetchTeamPersonalProfiles():
  Promise<
    TeamPersonalProfile[]
  > {

  const body =
    await get<{
      items:
        TeamPersonalProfile[];
    }>(
      BASE,
      {},
      await ownerOptions()
    );

  return body.items;
}

export async function saveTeamPersonalProfile(
  input:
    SaveTeamPersonalProfileInput
): Promise<
  TeamPersonalProfile |
  null
> {

  const body =
    await put<{
      profile:
        TeamPersonalProfile |
        null;
    }>(
      BASE,
      input,
      await ownerOptions()
    );

  return body.profile;
}
