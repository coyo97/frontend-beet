import {
  ApiError,
  get,
  post,
} from "@/async/api";

import {
  getAuthToken,
} from "../storage/authToken";

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

export async function registerUser(
  username:
    string,

  password:
    string
): Promise<
  AuthUser
> {

  const response =
    await post<{
      user:
        AuthUser;
    }>(
      "/auth/register",
      {
        username,
        password,
      }
    );

  return response.user;
}

export async function loginUser(
  username:
    string,

  password:
    string
): Promise<
  LoginResponse
> {

  return post<
    LoginResponse
  >(
    "/auth/login",
    {
      username,
      password,
    }
  );
}

export async function fetchCurrentUser():
  Promise<
    AuthUser
  > {

  const token =
    await getAuthToken();

  if (!token) {
    throw new Error(
      "NO_SESSION"
    );
  }

  try {
    const response =
      await get<{
        user:
          AuthUser;
      }>(
        "/auth/me",
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.user;

  } catch (
    error
  ) {

    if (
      error instanceof
        ApiError &&
      error.status ===
        401
    ) {
      throw new Error(
        "INVALID_SESSION"
      );
    }

    throw error;
  }
}
