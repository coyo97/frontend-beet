import {
  env,
} from "@/config/env";

import type {
  ServerConnection,
} from "../../domain/entities/ServerConnection";

import type {
  ServerConfigRepository,
} from "../../domain/repositories/ServerConfigRepository";

import {
  buildServerConnection,
  normalizeServerOrigin,
} from "../../domain/services/normalizeServerOrigin";

type Listener =
  (
    config:
      ServerConnection
  ) => void;

export class ServerConfigService {

  private cachedOverride:
    string |
    null |
    undefined;

  private readonly listeners =
    new Set<
      Listener
    >();

  constructor(
    private readonly repository:
      ServerConfigRepository
  ) {}

  public getDefault():
    ServerConnection {

    return buildServerConnection(
      env.API_BASE_URL,
      "default"
    );
  }

  private async ensureLoaded():
    Promise<void> {

    if (
      this.cachedOverride !==
      undefined
    ) {
      return;
    }

    const stored =
      await this.repository
        .getOverride();

    if (!stored) {
      this.cachedOverride =
        null;

      return;
    }

    try {
      this.cachedOverride =
        normalizeServerOrigin(
          stored
        );
    } catch {

      /*
       * Si alguna versión anterior dejó
       * una URL inválida, no bloqueamos
       * toda la aplicación.
       */
      await this.repository
        .clearOverride();

      this.cachedOverride =
        null;
    }
  }

  public async getActive():
    Promise<
      ServerConnection
    > {

    await this.ensureLoaded();

    if (
      this.cachedOverride
    ) {
      return buildServerConnection(
        this.cachedOverride,
        "override"
      );
    }

    return this.getDefault();
  }

  /*
   * Permite que el API client reciba
   * tanto rutas nuevas relativas:
   *
   * /football/live
   *
   * como URLs antiguas construidas
   * usando EXPO_PUBLIC_API_URL.
   *
   * Esto nos permite migrar el proyecto
   * progresivamente sin romperlo.
   */
  public async resolveApiEndpoint(
    endpoint:
      string
  ): Promise<string> {

    const active =
      await this.getActive();

    const defaultConfig =
      this.getDefault();

    const trimmed =
      endpoint
        .trim();

    if (
      /^https?:\/\//i.test(
        trimmed
      )
    ) {

      /*
       * URL perteneciente al backend
       * configurado durante el build.
       *
       * Cambiamos solamente su base.
       */
      if (
        trimmed ===
          defaultConfig
            .apiBaseUrl ||
        trimmed.startsWith(
          `${defaultConfig.apiBaseUrl}/`
        )
      ) {

        const suffix =
          trimmed.slice(
            defaultConfig
              .apiBaseUrl
              .length
          );

        return (
          active.apiBaseUrl +
          suffix
        );
      }

      /*
       * URL externa real.
       * No la modificamos.
       */
      return trimmed;
    }

    const path =
      trimmed.startsWith(
        "/"
      )
        ? trimmed
        : `/${trimmed}`;

    return (
      active.apiBaseUrl +
      path
    );
  }

  public async getSocketUrl():
    Promise<string> {

    return (
      await this.getActive()
    ).socketUrl;
  }

  public async validate(
    value:
      string
  ): Promise<
    ServerConnection
  > {

    const candidate =
      buildServerConnection(
        value,
        "override"
      );

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () =>
          controller.abort(),
        8000
      );

    try {
      const response =
        await fetch(
          `${candidate.apiBaseUrl}/health`,
          {
            method:
              "GET",

            headers: {
              Accept:
                "application/json",
            },

            signal:
              controller.signal,
          }
        );

      if (
        !response.ok
      ) {
        throw new Error(
          `El backend respondió HTTP ${response.status}`
        );
      }

      return candidate;

    } catch (
      error
    ) {

      if (
        error instanceof
          Error &&
        error.name ===
          "AbortError"
      ) {
        throw new Error(
          "El servidor tardó demasiado en responder"
        );
      }

      throw error;

    } finally {
      clearTimeout(
        timeout
      );
    }
  }

  public async saveOverride(
    value:
      string
  ): Promise<
    ServerConnection
  > {

    /*
     * Nunca guardamos una URL sin
     * comprobar antes que responda.
     */
    const candidate =
      await this.validate(
        value
      );

    await this.repository
      .saveOverride(
        candidate.origin
      );

    this.cachedOverride =
      candidate.origin;

    this.emit(
      candidate
    );

    return candidate;
  }

  public async clearOverride():
    Promise<
      ServerConnection
    > {

    await this.repository
      .clearOverride();

    this.cachedOverride =
      null;

    const config =
      this.getDefault();

    this.emit(
      config
    );

    return config;
  }

  public subscribe(
    listener:
      Listener
  ):
    () => void {

    this.listeners.add(
      listener
    );

    return () => {
      this.listeners.delete(
        listener
      );
    };
  }

  private emit(
    config:
      ServerConnection
  ): void {

    for (
      const listener
      of this.listeners
    ) {
      listener(
        config
      );
    }
  }
}
