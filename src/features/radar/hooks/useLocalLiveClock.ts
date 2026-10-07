import {
  useEffect,
  useState,
} from "react";

export function useLocalLiveClock(
  intervalMs =
    15_000
): number {

  const [
    nowMs,
    setNowMs,
  ] =
    useState(
      Date.now()
    );

  useEffect(
    () => {

      const timer =
        setInterval(
          () => {
            setNowMs(
              Date.now()
            );
          },
          intervalMs
        );

      return () => {
        clearInterval(
          timer
        );
      };
    },
    [
      intervalMs,
    ]
  );

  return nowMs;
}
