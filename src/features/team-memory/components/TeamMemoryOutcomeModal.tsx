import React, {
  useEffect,
  useState,
} from "react";

import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  TeamMemoryOutcome,
} from "../types/teamMemory";

import {
  styles,
} from "./TeamMemoryOutcomeModal.styles";

interface Props {
  visible:
    boolean;

  teamName:
    string;

  outcome:
    TeamMemoryOutcome |
    null;

  saving:
    boolean;

  onCancel:
    () => void;

  onSave:
    (
      note:
        string |
        null
    ) => void;
}

export function TeamMemoryOutcomeModal({
  visible,
  teamName,
  outcome,
  saving,
  onCancel,
  onSave,
}: Props) {

  const [
    note,
    setNote,
  ] =
    useState(
      ""
    );

  useEffect(
    () => {

      if (
        visible
      ) {
        setNote(
          ""
        );
      }
    },
    [
      visible,
      teamName,
      outcome,
    ]
  );

  if (
    !outcome
  ) {
    return null;
  }

  const outcomeLabel =
    outcome ===
    "win"
      ? "ME HIZO GANAR"
      : "ME HIZO PERDER";

  const save =
    () => {

      const normalized =
        note.trim();

      onSave(
        normalized ||
        null
      );
    };

  return (
    <Modal
      visible={
        visible
      }
      transparent
      animationType="fade"
      onRequestClose={
        onCancel
      }
    >
      <View
        style={
          styles.backdrop
        }
      >
        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.title
            }
          >
            {teamName}
          </Text>

          <Text
            style={
              outcome ===
              "win"
                ? styles.win
                : styles.loss
            }
          >
            {outcomeLabel}
          </Text>

          <Text
            style={
              styles.label
            }
          >
            Contexto opcional
          </Text>

          <TextInput
            value={
              note
            }
            onChangeText={
              setNote
            }
            multiline
            maxLength={
              300
            }
            placeholder="Ej. Perdió, pero estaba con roja desde el 35'..."
            placeholderTextColor="#737B87"
            style={
              styles.input
            }
          />

          <Text
            style={
              styles.help
            }
          >
            Este contexto quedará asociado a esta experiencia con el equipo.
          </Text>

          <View
            style={
              styles.actions
            }
          >
            <TouchableOpacity
              disabled={
                saving
              }
              onPress={
                onCancel
              }
              style={
                styles.cancelButton
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

            <TouchableOpacity
              disabled={
                saving
              }
              onPress={
                save
              }
              style={
                styles.saveButton
              }
            >
              <Text
                style={
                  styles.saveText
                }
              >
                {saving
                  ? "Guardando..."
                  : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
