import type {
  MatchPick,
} from "../types/matchPick";

function minutesText(
  values:
    number[]
): string {

  return values
    .map(
      value =>
        `${value}'`
    )
    .join(", ");
}

export function buildMatchPickMemoryNote(
  pick:
    MatchPick
): string | null {

  const context =
    pick.context;

  if (!context) {
    return null;
  }

  const parts:
    string[] =
      [];

  /*
   * MOMENTO DE LA APUESTA
   */
  if (
    context
      .pickedAtMinute !==
    null
  ) {

    parts.push(
      `Apostaste al ${context.pickedAtMinute}'.`
    );
  }

  /*
   * MARCADOR CUANDO APOSTÓ
   */
  const homeGoals =
    context
      .pickedAtScore
      .home;

  const awayGoals =
    context
      .pickedAtScore
      .away;

  if (
    homeGoals !==
      null &&
    awayGoals !==
      null
  ) {

    const selectedGoals =
      pick.side ===
        "home"
        ? homeGoals
        : awayGoals;

    const opponentGoals =
      pick.side ===
        "home"
        ? awayGoals
        : homeGoals;

    parts.push(
      `Marcador al apostar: ${selectedGoals}-${opponentGoals}.`
    );
  }

  const red =
    context.redCards;

  if (!red) {

    return parts.length >
      0
      ? parts.join(
          " "
        )
      : null;
  }

  /*
   * VENTAJA NUMÉRICA
   */
  if (
    red.playerAdvantage >
    0
  ) {

    parts.push(
      red.playerAdvantage ===
        1
        ? "Tenía un hombre más."
        : `Tenía ${red.playerAdvantage} hombres más.`
    );

    if (
      red.opponentRedMinutes
        .length ===
      1
    ) {

      parts.push(
        `El rival tenía roja desde el ${red.opponentRedMinutes[0]}'.`
      );

    } else if (
      red.opponentRedMinutes
        .length >
      1
    ) {

      parts.push(
        `Rojas del rival: ${minutesText(
          red.opponentRedMinutes
        )}.`
      );
    }

  } else if (
    red.playerAdvantage <
    0
  ) {

    const disadvantage =
      Math.abs(
        red.playerAdvantage
      );

    parts.push(
      disadvantage ===
        1
        ? "Apostaste con un hombre menos."
        : `Apostaste con ${disadvantage} hombres menos.`
    );

    if (
      red.selectedRedMinutes
        .length ===
      1
    ) {

      parts.push(
        `Su expulsión fue al ${red.selectedRedMinutes[0]}'.`
      );

    } else if (
      red.selectedRedMinutes
        .length >
      1
    ) {

      parts.push(
        `Sus rojas fueron al ${minutesText(
          red.selectedRedMinutes
        )}.`
      );
    }

  } else if (
    red.selected >
      0 ||
    red.opponent >
      0
  ) {

    if (
      red.selected ===
        red.opponent
    ) {

      parts.push(
        red.selected ===
          1
          ? "Ambos equipos tenían una expulsión."
          : `Ambos equipos tenían ${red.selected} expulsiones.`
      );
    }
  }

  return parts.length >
    0
    ? parts.join(
        " "
      )
    : null;
}
