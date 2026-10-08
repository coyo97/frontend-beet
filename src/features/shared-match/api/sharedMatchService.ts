import {
  env,
} from "@/config/env";

import {
  getAuthToken,
} from "@/features/auth/storage/authToken";

import type {
  LiveMatch,
} from "@/types/radar";

import type {
  SharedMatchAction,
  SharedMatchInsight,
  SharedMatchesResponse,
  SharingGroup,
  SharingGroupResponse,
  SharedMatchSide,
} from "../types/sharedMatch";

const BASE =
  `${env.API_BASE_URL}/sharing`;

async function request<T>(
  path:
    string,

  options: {
    method?:
      "GET" |
      "POST";

    body?:
      unknown;
  } = {}
): Promise<T> {
  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "Sesión requerida"
    );
  }

  const response =
    await fetch(
      `${BASE}${path}`,
      {
        method:
          options.method ??
          "GET",

        headers: {
          Accept:
            "application/json",

          Authorization:
            `Bearer ${token}`,

          ...(
            options.body !==
              undefined
              ? {
                  "Content-Type":
                    "application/json",
                }
              : {}
          ),
        },

        body:
          options.body !==
            undefined
            ? JSON.stringify(
                options.body
              )
            : undefined,
      }
    );

  const data =
    await response
      .json()
      .catch(
        () => null
      );

  if (!response.ok) {
    const message =
      data &&
      typeof data.message ===
        "string"
        ? data.message
        : `HTTP ${response.status}`;

    throw new Error(
      message
    );
  }

  return data as T;
}

export async function getSharingGroup():
  Promise<
    SharingGroup | null
  > {

  const response =
    await request<
      SharingGroupResponse
    >(
      "/group"
    );

  return response.group;
}

export async function createSharingGroup(
  name =
    "Hermanos"
): Promise<
  SharingGroup
> {

  const response =
    await request<{
      group:
        SharingGroup;
    }>(
      "/group",
      {
        method:
          "POST",

        body: {
          name,
        },
      }
    );

  return response.group;
}

export async function joinSharingGroup(
  inviteCode:
    string
): Promise<
  SharingGroup
> {

  const response =
    await request<{
      group:
        SharingGroup;
    }>(
      "/group/join",
      {
        method:
          "POST",

        body: {
          inviteCode,
        },
      }
    );

  return response.group;
}

export async function getSharedMatches():
  Promise<
    SharedMatchInsight[]
  > {

  const response =
    await request<
      SharedMatchesResponse
    >(
      "/matches"
    );

  return response.items;
}

export async function shareMatch(
  match:
    LiveMatch,

  action:
    SharedMatchAction,

  selectedSide:
    SharedMatchSide | null,

  note:
    string | null = null
): Promise<
  SharedMatchInsight
> {

  const response =
    await request<{
      insight:
        SharedMatchInsight;
    }>(
      "/matches",
      {
        method:
          "POST",

        body: {
          action,

          selectedSide,

          /*
           * La nota es completamente
           * opcional.
           */
          note:
            note?.trim() ||
            null,

          /*
           * No hacemos ninguna consulta
           * extra.
           *
           * Compartimos el LiveMatch que
           * ya tenemos en memoria.
           */
          match: {
            sources:
              match.sources.map(
                source => ({
                  provider:
                    source.provider,

                  externalId:
                    source.externalId,
                })
              ),

            kickoffAt:
              match.kickoffAt,

            competitionName:
              match.competition
                .name ??
              null,

            country:
              match.competition
                .country ??
              null,

            homeName:
              match.home.name,

            awayName:
              match.away.name,

            homeGoals:
              match.home.goals ??
              null,

            awayGoals:
              match.away.goals ??
              null,

            minute:
              match.status
                .minute ??
              null,
          },
        },
      }
    );

  return response.insight;
}
