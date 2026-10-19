import {
  del,
  get,
  post,
  type ApiRequestOptions,
} from "@/async/api";

import {
  getAuthToken,
} from "@/features/auth/storage/authToken";

import type {
  CreateTeamMemoryInput,
  TeamMemoryEvent,
  TeamMemoryOpponentSummary,
  TeamMemorySummary,
} from "../types/teamMemory";

async function requiredAuthOptions():
  Promise<
    ApiRequestOptions
  > {

  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "Debes iniciar sesión"
    );
  }

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
}

export async function fetchAllTeamMemorySummaries():
  Promise<
    TeamMemorySummary[]
  > {

  const response =
    await get<{
      summaries:
        TeamMemorySummary[];
    }>(
      "/team-memory/summaries",
      {},
      await requiredAuthOptions()
    );

  return response.summaries;
}

export async function fetchAllTeamMemoryOpponentSummaries():
  Promise<
    TeamMemoryOpponentSummary[]
  > {

  const response =
    await get<{
      opponents:
        TeamMemoryOpponentSummary[];
    }>(
      "/team-memory/opponents",
      {},
      await requiredAuthOptions()
    );

  return response.opponents;
}

export async function fetchTeamMemorySummaries(
  teams:
    string[]
): Promise<
  TeamMemorySummary[]
> {

  const response =
    await post<{
      summaries:
        TeamMemorySummary[];
    }>(
      "/team-memory/summaries",
      {
        teams,
      },
      await requiredAuthOptions()
    );

  return response.summaries;
}

export async function fetchTeamMemoryHistory(
  teamName:
    string
): Promise<
  TeamMemoryEvent[]
> {

  const response =
    await get<{
      items:
        TeamMemoryEvent[];
    }>(
      "/team-memory/events",
      {
        team:
          teamName,

        limit:
          30,
      },
      await requiredAuthOptions()
    );

  return response.items;
}

export async function addTeamMemoryEvent(
  input:
    CreateTeamMemoryInput
): Promise<{
  event:
    TeamMemoryEvent;

  summary:
    TeamMemorySummary;
}> {

  return post<{
    event:
      TeamMemoryEvent;

    summary:
      TeamMemorySummary;
  }>(
    "/team-memory/events",
    input,
    await requiredAuthOptions()
  );
}

export async function deleteTeamMemoryEvent(
  id:
    string
): Promise<{
  deleted:
    TeamMemoryEvent;

  summary:
    TeamMemorySummary;
}> {

  return del<{
    deleted:
      TeamMemoryEvent;

    summary:
      TeamMemorySummary;
  }>(
    `/team-memory/events/${encodeURIComponent(
      id
    )}`,
    await requiredAuthOptions()
  );
}
