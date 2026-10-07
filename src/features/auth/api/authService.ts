import {
  env,
} from "@/config/env";

import {
  getAuthToken,
} from "../storage/authToken";

const BASE =
  `${env.API_BASE_URL}/auth`;

export interface AuthUser {
  id:
    string;

  username:
    string;
}

export interface LoginResponse {
  token:
    string;

  user:
    AuthUser;
}

async function readResponse<T>(
  response: Response
): Promise<T> {
  const body =
    await response.json();

  if (!response.ok) {
    throw new Error(
      typeof body?.message === "string"
        ? body.message
        : "Error de autenticación"
    );
  }

  return body as T;
}

export async function registerUser(
  username: string,
  password: string
): Promise<AuthUser> {
  const response =
    await fetch(
      `${BASE}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

  const result =
    await readResponse<{
      user: AuthUser;
    }>(response);

  return result.user;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response =
    await fetch(
      `${BASE}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

  return readResponse<LoginResponse>(
    response
  );
}

export async function fetchCurrentUser():
  Promise<AuthUser> {
  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "NO_SESSION"
    );
  }

  const response =
    await fetch(
      `${BASE}/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  if (response.status === 401) {
    throw new Error(
      "INVALID_SESSION"
    );
  }

  const body =
    await readResponse<{
      user: AuthUser;
    }>(response);

  return body.user;
}
