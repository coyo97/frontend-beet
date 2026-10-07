import {
  env,
} from "@/config/env";

import {
  getTeamMemoryOwnerId,
} from "../storage/teamMemoryOwner";

import type {
  CreateTeamMemoryInput,
  TeamMemoryEvent,
  TeamMemorySummary,
} from "../types/teamMemory";

import {
  getAuthToken,
} from "@/features/auth/storage/authToken";

const BASE =
  `${env.API_BASE_URL}/team-memory`;

async function getHeaders(
  json = false
): Promise<
  Record<string, string>
> {
  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "Debes iniciar sesión"
    );
  }

  return {
    Accept:
      "application/json",

    Authorization:
      `Bearer ${token}`,

    ...(json
      ? {
          "Content-Type":
            "application/json",
        }
      : {}),
  };
}

export async function fetchAllTeamMemorySummaries():
  Promise<
    TeamMemorySummary[]
  > {

  const headers =
    await getHeaders();

  const response =
    await fetch(
      `${BASE}/summaries`,
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
      await getErrorMessage(
        response,
        "Could not list team memory"
      )
    );
  }

  const body =
    await response
      .json() as {
        summaries:
          TeamMemorySummary[];
      };

  return body.summaries;
}

async function getErrorMessage(
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
    // Respuesta sin JSON.
  }

  return `${fallback}: ${response.status}`;
}

export async function fetchTeamMemorySummaries(
  teams:
    string[]
): Promise<
  TeamMemorySummary[]
> {

  const headers =
    await getHeaders(
      true
    );

  const response =
    await fetch(
      `${BASE}/summaries`,
      {
        method:
          "POST",

        headers,

        body:
          JSON.stringify({
            teams,
          }),
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      await getErrorMessage(
        response,
        "Could not load team memory"
      )
    );
  }

  const body =
    await response
      .json() as {
        summaries:
          TeamMemorySummary[];
      };

  return body.summaries;
}

export async function fetchTeamMemoryHistory(
  teamName:
    string
): Promise<
  TeamMemoryEvent[]
> {

  const headers =
    await getHeaders();

  const response =
    await fetch(
      `${BASE}/events?team=${encodeURIComponent(
        teamName
      )}&limit=30`,
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
      await getErrorMessage(
        response,
        "Could not load team memory history"
      )
    );
  }

  const body =
    await response
      .json() as {
        items:
          TeamMemoryEvent[];
      };

  return body.items;
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

  const headers =
    await getHeaders(
      true
    );

  const response =
    await fetch(
      `${BASE}/events`,
      {
        method:
          "POST",

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
      await getErrorMessage(
        response,
        "Could not save team memory"
      )
    );
  }

  return await response
    .json() as {
      event:
        TeamMemoryEvent;

      summary:
        TeamMemorySummary;
    };
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

  const headers =
    await getHeaders();

  const response =
    await fetch(
      `${BASE}/events/${encodeURIComponent(
        id
      )}`,
      {
        method:
          "DELETE",

        headers,
      }
    );

  if (
    !response.ok
  ) {
    throw new Error(
      await getErrorMessage(
        response,
        "Could not delete team memory event"
      )
    );
  }

  return await response
    .json() as {
      deleted:
        TeamMemoryEvent;

      summary:
        TeamMemorySummary;
    };
}
