import * as SecureStore
  from "expo-secure-store";

import type {
  ServerConfigRepository,
} from "../../domain/repositories/ServerConfigRepository";

const STORAGE_KEY =
  "football-radar-server-origin-v1";

export class SecureStoreServerConfigRepository
  implements ServerConfigRepository {

  public async getOverride():
    Promise<
      string |
      null
    > {

    return SecureStore
      .getItemAsync(
        STORAGE_KEY
      );
  }

  public async saveOverride(
    origin:
      string
  ): Promise<void> {

    await SecureStore
      .setItemAsync(
        STORAGE_KEY,
        origin
      );
  }

  public async clearOverride():
    Promise<void> {

    await SecureStore
      .deleteItemAsync(
        STORAGE_KEY
      );
  }
}
