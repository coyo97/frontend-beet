import React, {
  useState,
} from "react";

import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import type {
  LiveMatch,
} from "@/types/radar";

import {
  useSharedMatchStore,
} from "../store/sharedMatchStore";

import type {
  SharedMatchAction,
  SharedMatchSide,
} from "../types/sharedMatch";

import {
  styles,
} from "./ShareMatchQuickActions.styles";

interface Props {
  match:
    LiveMatch;
}

export function ShareMatchQuickActions({
  match,
}: Props) {
  const group =
    useSharedMatchStore(
      state =>
        state.group
    );

  const share =
    useSharedMatchStore(
      state =>
        state.share
    );

  const sharing =
    useSharedMatchStore(
      state =>
        state.sharing
    );

  const [
    visible,
    setVisible,
  ] =
    useState(
      false
    );

  const [
    noteVisible,
    setNoteVisible,
  ] =
    useState(
      false
    );

  const [
    note,
    setNote,
  ] =
    useState(
      ""
    );

  const [
    message,
    setMessage,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const open =
    () => {
      /*
       * Si todavía no pertenece
       * a un grupo, lo mandamos
       * directamente a Compartidos.
       */
      if (!group) {
        router.push(
          "/shared"
        );

        return;
      }

      setMessage(
        null
      );

      setError(
        null
      );

      setVisible(
        true
      );
    };

  const close =
    () => {
      if (sharing) {
        return;
      }

      setVisible(
        false
      );

      setNoteVisible(
        false
      );

      setNote(
        ""
      );

      setMessage(
        null
      );

      setError(
        null
      );
    };

  const send =
    async (
      action:
        SharedMatchAction,

      selectedSide:
        SharedMatchSide |
        null
    ) => {
      if (sharing) {
        return;
      }

      setError(
        null
      );

      setMessage(
        null
      );

      try {
        await share(
          match,
          action,
          selectedSide,
          note
        );

        /*
         * Confirmación mínima.
         *
         * No dejamos el modal abierto
         * mucho tiempo porque esto debe
         * ser rápido.
         */
        setMessage(
          "Compartido"
        );

        setTimeout(
          () => {
            setVisible(
              false
            );

            setMessage(
              null
            );

            setNote(
              ""
            );

            setNoteVisible(
              false
            );
          },
          450
        );
      } catch (
        caught
      ) {
        setError(
          caught instanceof
            Error
            ? caught.message
            : "No se pudo compartir"
        );
      }
    };

  return (
    <>
      <TouchableOpacity
        activeOpacity={
          0.8
        }
        style={
          styles.trigger
        }
        onPress={
          open
        }
      >
        <Text
          style={
            styles.triggerText
          }
        >
          ↗ Compartir
        </Text>
      </TouchableOpacity>

      <Modal
        visible={
          visible
        }
        transparent
        animationType="slide"
        onRequestClose={
          close
        }
      >
        <View
          style={
            styles.backdrop
          }
        >
          <View
            style={
              styles.sheet
            }
          >
            <Text
              style={
                styles.sheetTitle
              }
            >
              Compartir rápido
            </Text>

            <Text
              style={
                styles.matchLabel
              }
              numberOfLines={
                1
              }
            >
              {match.home.name}
              {" vs "}
              {match.away.name}
            </Text>

            {/*
             * ========================================
             * 1 TOQUE DESPUÉS DE ABRIR
             * ========================================
             */}

            <TouchableOpacity
              activeOpacity={
                0.8
              }
              disabled={
                sharing
              }
              style={
                styles.quickShare
              }
              onPress={
                () => {
                  void send(
                    "share",
                    null
                  );
                }
              }
            >
              <Text
                style={
                  styles.quickShareText
                }
              >
                👀 Solo compartir partido
              </Text>
            </TouchableOpacity>

            {/*
             * ========================================
             * ME INCLINO POR...
             * ========================================
             */}

            <Text
              style={
                styles.sectionLabel
              }
            >
              CREO QUE IRÉ POR
            </Text>

            <View
              style={
                styles.row
              }
            >
              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  sharing
                }
                style={
                  styles.actionButton
                }
                onPress={
                  () => {
                    void send(
                      "leaning",
                      "home"
                    );
                  }
                }
              >
                <Text
                  style={
                    styles.actionText
                  }
                  numberOfLines={
                    2
                  }
                >
                  🎯 {match.home.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  sharing
                }
                style={
                  styles.actionButton
                }
                onPress={
                  () => {
                    void send(
                      "leaning",
                      "away"
                    );
                  }
                }
              >
                <Text
                  style={
                    styles.actionText
                  }
                  numberOfLines={
                    2
                  }
                >
                  🎯 {match.away.name}
                </Text>
              </TouchableOpacity>
            </View>

            {/*
             * ========================================
             * YA APOSTÉ
             * ========================================
             */}

            <Text
              style={
                styles.sectionLabel
              }
            >
              YA APOSTÉ POR
            </Text>

            <View
              style={
                styles.row
              }
            >
              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  sharing
                }
                style={[
                  styles.actionButton,
                  styles.betButton,
                ]}
                onPress={
                  () => {
                    void send(
                      "bet",
                      "home"
                    );
                  }
                }
              >
                <Text
                  style={
                    styles.actionText
                  }
                  numberOfLines={
                    2
                  }
                >
                  ✅ {match.home.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={
                  0.8
                }
                disabled={
                  sharing
                }
                style={[
                  styles.actionButton,
                  styles.betButton,
                ]}
                onPress={
                  () => {
                    void send(
                      "bet",
                      "away"
                    );
                  }
                }
              >
                <Text
                  style={
                    styles.actionText
                  }
                  numberOfLines={
                    2
                  }
                >
                  ✅ {match.away.name}
                </Text>
              </TouchableOpacity>
            </View>

            {/*
             * ========================================
             * NOTA OPCIONAL
             * ========================================
             */}

            <TouchableOpacity
              style={
                styles.noteToggle
              }
              onPress={
                () =>
                  setNoteVisible(
                    current =>
                      !current
                  )
              }
            >
              <Text
                style={
                  styles.noteToggleText
                }
              >
                {noteVisible
                  ? "− Ocultar nota"
                  : "+ Añadir nota (opcional)"}
              </Text>
            </TouchableOpacity>

            {noteVisible && (
              <TextInput
                value={
                  note
                }
                onChangeText={
                  setNote
                }
                placeholder="Ej. está obligado a ganar"
                placeholderTextColor="#596472"
                maxLength={
                  160
                }
                multiline
                style={
                  styles.input
                }
              />
            )}

            {sharing && (
              <ActivityIndicator
                size="small"
              />
            )}

            {!!message && (
              <Text
                style={
                  styles.status
                }
              >
                ✓ {message}
              </Text>
            )}

            {!!error && (
              <Text
                style={
                  styles.error
                }
              >
                {error}
              </Text>
            )}

            <TouchableOpacity
              disabled={
                sharing
              }
              style={
                styles.cancel
              }
              onPress={
                close
              }
            >
              <Text
                style={
                  styles.cancelText
                }
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
