import {
  useEffect,
  useMemo,
} from "react";

import type {
  LiveMatch,
  MatchSource,
} from "@/types/radar";

import type {
  MatchContext,
} from "@/types/matchContext";

import {
  matchContextKey,
  useMatchContextStore,
} from "@/store/matchContextStore";

import {
  getMatchContextSources,
} from "../utils/getMatchContextSource";

import {
  getMatchContextQuality,
  GOOD_MATCH_CONTEXT_SCORE,
} from "../utils/matchContextQuality";

interface MatchContextRequestMetadata {
  competitionId:
    string | null;

  competitionName:
    string;

  country:
    string | null;

  homeName:
    string;

  awayName:
    string;
}

interface Options {
  match:
    LiveMatch;

  enabled?:
    boolean;

  metadata:
    MatchContextRequestMetadata;
}

interface Result {
  source:
    MatchSource | null;

  context:
    MatchContext | null;

  loading:
    boolean;

  error:
    string | null;

  quality:
    number;
}

export function useAdaptiveMatchContext({
  match,
  enabled = true,
  metadata,
}: Options): Result {

  const candidates =
    useMemo(
      () =>
        getMatchContextSources(
          match
        ),
      [
        match.sources,
      ]
    );

  const candidateKey =
    candidates
      .map(
        source =>
          `${source.provider}:${source.externalId}`
      )
      .join(
        "|"
      );

  const entries =
    useMatchContextStore(
      state =>
        state.entries
    );

  const ensure =
    useMatchContextStore(
      state =>
        state.ensure
    );

  useEffect(
    () => {

      if (
        !enabled ||
        candidates.length ===
          0
      ) {
        return;
      }

      let cancelled =
        false;

      const run =
        async () => {

          for (
            const source
            of candidates
          ) {

            if (
              cancelled
            ) {
              return;
            }

            const cacheKey =
              matchContextKey(
                source.provider,
                source.externalId
              );

            let entry =
              useMatchContextStore
                .getState()
                .entries[
                  cacheKey
                ];

            /*
             * Si todavía no tenemos
             * contexto para esta fuente,
             * lo pedimos.
             */
            if (
              !entry
                ?.context
            ) {

              await ensure(
                source.provider,
                source.externalId,
                metadata
              );

              if (
                cancelled
              ) {
                return;
              }

              entry =
                useMatchContextStore
                  .getState()
                  .entries[
                    cacheKey
                  ];
            }

            if (
              !entry
                ?.context
            ) {
              continue;
            }

            const quality =
              getMatchContextQuality(
                entry.context
              );

            /*
             * Si ya tenemos un contexto
             * realmente fuerte no hacemos
             * llamadas adicionales.
             *
             * Ejemplos comprobados:
             *
             * Flashscore 45 -> parar.
             * Flashscore 42 -> parar.
             *
             * Flashscore 23 -> seguir.
             * Flashscore 1  -> seguir.
             */
            if (
              quality >=
                GOOD_MATCH_CONTEXT_SCORE
            ) {
              return;
            }
          }
        };

      void run();

      return () => {
        cancelled =
          true;
      };
    },
    [
      candidateKey,
      enabled,
      ensure,

      metadata
        .competitionId,

      metadata
        .competitionName,

      metadata
        .country,

      metadata
        .homeName,

      metadata
        .awayName,
    ]
  );

  let selectedSource:
    MatchSource | null =
    null;

  let selectedContext:
    MatchContext | null =
    null;

  let selectedQuality =
    -1;

  let anyLoading =
    false;

  let attempted =
    0;

  const errors:
    string[] =
    [];

  for (
    const source
    of candidates
  ) {

    const cacheKey =
      matchContextKey(
        source.provider,
        source.externalId
      );

    const entry =
      entries[
        cacheKey
      ];

    if (
      !entry
    ) {
      continue;
    }

    attempted +=
      1;

    if (
      entry.loading
    ) {
      anyLoading =
        true;
    }

    if (
      entry.error
    ) {
      errors.push(
        entry.error
      );
    }

    if (
      !entry.context
    ) {
      continue;
    }

    const quality =
      getMatchContextQuality(
        entry.context
      );

    /*
     * Solo sustituimos si la nueva fuente
     * es realmente mejor.
     *
     * En empate se conserva la anterior,
     * respetando:
     *
     * Flashscore
     * FotMob
     * SofaScore
     * bookmaker
     */
    if (
      quality >
      selectedQuality
    ) {
      selectedQuality =
        quality;

      selectedSource =
        source;

      selectedContext =
        entry.context;
    }
  }

  const stillPending =
    enabled &&
    candidates.length >
      0 &&
    attempted <
      candidates.length &&
    (
      selectedContext ===
        null ||
      selectedQuality <
        GOOD_MATCH_CONTEXT_SCORE
    );

  return {
    source:
      selectedSource ??
      candidates[
        0
      ] ??
      null,

    context:
      selectedContext,

    loading:
      anyLoading ||
      stillPending,

    error:
      (
        !selectedContext &&
        attempted ===
          candidates.length &&
        errors.length >
          0
      )
        ? errors.join(
            " | "
          )
        : null,

    quality:
      selectedQuality <
        0
        ? 0
        : selectedQuality,
  };
}
