import {
  serverConfigService,
} from "@/features/server-config/serverConfigModule";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type QueryParams =
  Record<
    string,
    QueryValue
  >;

  export interface ApiRequestOptions {
  headers?:
    Record<
      string,
      string
    >;

  signal?:
    AbortSignal;
}


export class ApiError
  extends Error
{
  constructor(
    message: string,

    public readonly status?:
      number
  ) {
    super(message);

    this.name =
      "ApiError";
  }
}

function buildQuery(
  params:
    QueryParams = {}
): string {

  const entries =
    Object.entries(
      params
    ).filter(
      (
        [, value]
      ) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    );

  if (
    entries.length ===
    0
  ) {
    return "";
  }

  const query =
    entries
      .map(
        ([key, value]) =>
          `${encodeURIComponent(
            key
          )}=${encodeURIComponent(
            String(value)
          )}`
      )
      .join("&");

  return `?${query}`;
}

async function request<T>(
  endpoint:
    string,

  method:
    HttpMethod,

  payload?:
    unknown,

  requestOptions:
    ApiRequestOptions = {}
): Promise<T> {

	const resolvedEndpoint =
  await serverConfigService
    .resolveApiEndpoint(
      endpoint
    );

const options:
  RequestInit = {
    method,

    headers: {
      Accept:
        "application/json",

      "Content-Type":
        "application/json",

      ...requestOptions
        .headers,
    },

    signal:
      requestOptions
        .signal,
  };

  if (
    payload !== undefined &&
    method !== "GET"
  ) {
    options.body =
      JSON.stringify(
        payload
      );
  }

  try {
    const response =
   await fetch(
  resolvedEndpoint,
  options
);

    const text =
      await response.text();

    let data:
      unknown = null;

    if (text) {
      try {
        data =
          JSON.parse(
            text
          );
      } catch {
        data =
          text;
      }
    }

    if (!response.ok) {
      const message =
        typeof data ===
          "object" &&
        data !== null &&
        "message" in data &&
        typeof (
          data as {
            message?: unknown;
          }
        ).message ===
          "string"
          ? (
              data as {
                message: string;
              }
            ).message
          : `HTTP ${response.status}`;

      throw new ApiError(
        message,
        response.status
      );
    }

    return data as T;
  } catch (error) {
    if (
      error instanceof
      ApiError
    ) {
      throw error;
    }

    const message =
      error instanceof
      Error
        ? error.message
        : "Network error";

    console.warn(
      "[API]",
	  resolvedEndpoint,
      message
    );

    throw new ApiError(
      message
    );
  }
}

export function get<T>(
  endpoint:
    string,

  params:
    QueryParams = {},

  options:
    ApiRequestOptions = {}
): Promise<T> {

  return request<T>(
    `${endpoint}${buildQuery(
      params
    )}`,
    "GET",
    undefined,
    options
  );
}

export function post<T>(
  endpoint:
    string,

  payload?:
    unknown,

  options:
    ApiRequestOptions = {}
): Promise<T> {

  return request<T>(
    endpoint,
    "POST",
    payload,
    options
  );
}
export function patch<T>(
  endpoint:
    string,

  payload:
    unknown,

  options:
    ApiRequestOptions = {}
): Promise<T> {

  return request<T>(
    endpoint,
    "PATCH",
    payload,
    options
  );
}

export function del<T>(
  endpoint:
    string,

  options:
    ApiRequestOptions = {}
): Promise<T> {

  return request<T>(
    endpoint,
    "DELETE",
    undefined,
    options
  );
}

export function put<T>(
  endpoint:
    string,

  payload:
    unknown,

  options:
    ApiRequestOptions = {}
): Promise<T> {

  return request<T>(
    endpoint,
    "PUT",
    payload,
    options
  );
}
