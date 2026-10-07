import type {
  LiveMatch,
} from "@/types/radar";

function normalizeStage(
  match:
    LiveMatch
): string {

  return [
    match.status.short ??
      "",
    match.status.long ??
      "",
  ]
    .join(" ")
    .toLowerCase();
}

function getKickoffElapsedMinutes(
  match:
    LiveMatch,

  nowMs:
    number
): number | null {

  const kickoffMs =
    new Date(
      match.kickoffAt
    ).getTime();

  if (
    !Number.isFinite(
      kickoffMs
    )
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(
      (
        nowMs -
        kickoffMs
      ) /
      60_000
    )
  );
}

export function estimateLiveMinute(
  match:
    LiveMatch,

  nowMs:
    number
): number | null {

  const stage =
    normalizeStage(
      match
    );

  const elapsed =
    getKickoffElapsedMinutes(
      match,
      nowMs
    );

  const providerMinute =
    typeof match.status.minute ===
      "number" &&
    Number.isFinite(
      match.status.minute
    )
      ? match.status.minute
      : null;

  /*
   * ============================
   * DESCANSO
   * ============================
   */

  if (
    stage.includes(
      "half time"
    ) ||
    stage.includes(
      "halftime"
    ) ||
    stage.includes(
      "break"
    ) ||
    stage.includes(
      "interval"
    ) ||
    stage.includes(
      " ht"
    ) ||
    stage ===
      "ht"
  ) {
    return 45;
  }

  /*
   * ============================
   * PRIMER TIEMPO
   * ============================
   */

  const firstHalf =
    stage.includes(
      "1st half"
    ) ||
    stage.includes(
      "first half"
    ) ||
    stage.includes(
      "1h"
    );

  if (
    firstHalf &&
    elapsed !==
      null
  ) {

    return Math.max(
      1,
      Math.min(
        45,
        elapsed
      )
    );
  }

  /*
   * ============================
   * SEGUNDO TIEMPO
   * ============================
   *
   * kickoffAt incluye:
   *
   * 45 min primer tiempo
   * ~15 min descanso
   *
   * Por eso restamos 15 minutos
   * del tiempo real transcurrido.
   */

  const secondHalf =
    stage.includes(
      "2nd half"
    ) ||
    stage.includes(
      "second half"
    ) ||
    stage.includes(
      "2h"
    );

  if (
    secondHalf &&
    elapsed !==
      null
  ) {

    const estimated =
      elapsed -
      15;

    /*
     * Al estar explícitamente en
     * segundo tiempo nunca mostramos
     * menos de 46.
     */
    return Math.max(
      46,
      Math.min(
        90,
        estimated
      )
    );
  }

  /*
   * ============================
   * LIVE GENÉRICO
   * ============================
   *
   * Algunos proveedores solamente
   * escriben "live".
   */

  if (
    elapsed !==
      null
  ) {

    let estimated:
      number;

    if (
      elapsed <=
      45
    ) {
      estimated =
        elapsed;
    } else if (
      elapsed <=
      60
    ) {
      estimated =
        45;
    } else {
      estimated =
        elapsed -
        15;
    }

    estimated =
      Math.max(
        1,
        Math.min(
          90,
          estimated
        )
      );

    /*
     * Si el proveedor trae un minuto
     * razonable, no retrocedemos.
     *
     * Pero si manda 1 o 2 en pleno
     * segundo tiempo, kickoffAt gana.
     */
    if (
      providerMinute !==
        null &&
      providerMinute >
        2 &&
      Math.abs(
        providerMinute -
        estimated
      ) <=
        10
    ) {
      return Math.max(
        providerMinute,
        estimated
      );
    }

    return estimated;
  }

  /*
   * Último fallback.
   */
  return providerMinute;
}

export function withEstimatedLiveMinute(
  match:
    LiveMatch,

  nowMs:
    number
): LiveMatch {

  const minute =
    estimateLiveMinute(
      match,
      nowMs
    );

  if (
    minute ===
    null
  ) {
    return match;
  }

  return {
    ...match,

    status: {
      ...match.status,

      minute,
    },
  };
}

export function compareLiveMatchesByProgress(
  left:
    LiveMatch,

  right:
    LiveMatch,

  nowMs:
    number
): number {

  const leftMinute =
    estimateLiveMinute(
      left,
      nowMs
    );

  const rightMinute =
    estimateLiveMinute(
      right,
      nowMs
    );

  /*
   * Menor minuto primero:
   *
   * 2'
   * 8'
   * 23'
   * 47'
   * 70'
   * 88'
   */
  if (
    leftMinute !==
      null &&
    rightMinute !==
      null &&
    leftMinute !==
      rightMinute
  ) {
    return (
      leftMinute -
      rightMinute
    );
  }

  /*
   * Desempate:
   * el kickoff más reciente primero.
   */
  const leftKickoff =
    new Date(
      left.kickoffAt
    ).getTime();

  const rightKickoff =
    new Date(
      right.kickoffAt
    ).getTime();

  if (
    Number.isFinite(
      leftKickoff
    ) &&
    Number.isFinite(
      rightKickoff
    )
  ) {
    return (
      rightKickoff -
      leftKickoff
    );
  }

  return 0;
}
