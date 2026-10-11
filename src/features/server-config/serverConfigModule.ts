import {
  ServerConfigService,
} from "./application/services/ServerConfigService";

import {
  SecureStoreServerConfigRepository,
} from "./infrastructure/repositories/SecureStoreServerConfigRepository";

const repository =
  new SecureStoreServerConfigRepository();

export const serverConfigService =
  new ServerConfigService(
    repository
  );
