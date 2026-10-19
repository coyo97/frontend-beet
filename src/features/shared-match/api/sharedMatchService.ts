import {
  env,
} from "@/config/env";

import {
  get,
  post,
  type ApiRequestOptions,
} from "@/async/api";

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
  "/sharing";

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

  const requestOptions:
    ApiRequestOptions = {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };

  const endpoint =
    `${BASE}${path}`;

  if (
    options.method ===
      "POST"
  ) {
    return post<T>(
      endpoint,
      options.body,
      requestOptions
    );
  }

  return get<T>(
    endpoint,
    {},
    requestOptions
  );
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
