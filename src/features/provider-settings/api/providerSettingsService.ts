import {
  get,
  patch,
  type ApiRequestOptions,
} from "@/async/api";

import {
  getAuthToken,
} from "@/features/auth/storage/authToken";

import type {
  FootballProviderKey,
  FootballProviderSetting,
} from "../types/providerSettings";

const BASE =
  "/provider-settings";

async function authOptions():
  Promise<
    ApiRequestOptions
  > {

  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "NO_SESSION"
    );
  }

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
}

export async function fetchProviderSettings():
  Promise<
    FootballProviderSetting[]
  > {

  const response =
    await get<{
      items:
        FootballProviderSetting[];
    }>(
      BASE,
      {},
      await authOptions()
    );

  return response.items;
}

export async function setProviderEnabled(
  key:
    FootballProviderKey,

  enabled:
    boolean
): Promise<
  FootballProviderSetting
> {

  const response =
    await patch<{
      item:
        FootballProviderSetting;
    }>(
      `${BASE}/${encodeURIComponent(
        key
      )}`,
      {
        enabled,
      },
      await authOptions()
    );

  return response.item;
}
