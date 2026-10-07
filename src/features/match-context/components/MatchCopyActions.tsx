import React, {
  useRef,
  useState,
} from "react";

import {
  Text,
  View,
} from "react-native";

import * as Clipboard
  from "expo-clipboard";

import {
  AppActionChip,
} from "@/shared/ui/atoms/AppActionChip";

import {
  styles,
} from "./MatchCopyActions.styles";

interface Props {
  home:
    string;

  away:
    string;
}

type CopiedValue =
  | "local"
  | "visita"
  | "partido"
  | null;

export function MatchCopyActions({
  home,
  away,
}: Props) {

  const [
    copied,
    setCopied,
  ] =
    useState<CopiedValue>(
      null
    );

  const timeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > |
      null
    >(
      null
    );

  const copy =
    async (
      value:
        string,

      type:
        Exclude<
          CopiedValue,
          null
        >
    ) => {

      await Clipboard
        .setStringAsync(
          value
        );

      setCopied(
        type
      );

      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current
        );
      }

      timeoutRef.current =
        setTimeout(
          () => {
            setCopied(
              null
            );
          },
          1200
        );
    };

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.actions
        }
      >
        <AppActionChip
          label="⧉ Local"
          onPress={
            () => {
              void copy(
                home,
                "local"
              );
            }
          }
        />

        <AppActionChip
          label="⧉ Visita"
          onPress={
            () => {
              void copy(
                away,
                "visita"
              );
            }
          }
        />

        <AppActionChip
          label="⧉ Partido"
          onPress={
            () => {
              void copy(
                `${home} vs ${away}`,
                "partido"
              );
            }
          }
        />
      </View>

      {copied && (
        <Text
          style={
            styles.feedback
          }
        >
          ✓{" "}
          {copied ===
          "partido"
            ? "Partido"
            : copied ===
                "local"
              ? "Local"
              : "Visita"}{" "}
          copiado
        </Text>
      )}
    </View>
  );
}
