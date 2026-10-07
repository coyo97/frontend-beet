import * as SecureStore
  from "expo-secure-store";

const STORAGE_KEY =
  "football-radar-team-memory-owner-id";

let cachedOwnerId:
  string | null =
  null;

function createOwnerId():
  string {

  const timestamp =
    Date.now()
      .toString(
        36
      );

  const randomA =
    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        12
      );

  const randomB =
    Math.random()
      .toString(
        36
      )
      .slice(
        2,
        12
      );

  return [
    "radar",
    timestamp,
    randomA,
    randomB,
  ].join(
    "-"
  );
}

export async function getTeamMemoryOwnerId():
  Promise<string> {

  if (
    cachedOwnerId
  ) {
    return cachedOwnerId;
  }

  const stored =
    await SecureStore
      .getItemAsync(
        STORAGE_KEY
      );

  if (
    stored &&
    stored.trim().length >=
      8
  ) {
    cachedOwnerId =
      stored.trim();

    if (
      __DEV__
    ) {
      console.log(
        "[TeamMemory] ownerId:",
        cachedOwnerId
      );
    }

    return cachedOwnerId;
  }

  const created =
    createOwnerId();

  await SecureStore
    .setItemAsync(
      STORAGE_KEY,
      created
    );

  cachedOwnerId =
    created;

  if (
    __DEV__
  ) {
    console.log(
      "[TeamMemory] NEW ownerId:",
      created
    );
  }

  return created;
}
