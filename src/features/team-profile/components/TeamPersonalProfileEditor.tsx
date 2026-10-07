import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  teamPersonalProfileKey,
  useTeamPersonalProfileStore,
} from "../store/teamPersonalProfileStore";

import type {
  TeamPersonalLabel,
} from "../types/teamPersonalProfile";

import {
  styles,
} from "./TeamPersonalProfileEditor.styles";

interface Props {
  teamName:
    string;

  enabled?:
    boolean;
}

const LABELS: Array<{
  value:
    TeamPersonalLabel;

  label:
    string;

  symbol:
    string;
}> = [
  {
    value:
      "avoid",

    label:
      "EVITAR",

    symbol:
      "⛔",
  },

  {
    value:
      "watch",

    label:
      "VIGILAR",

    symbol:
      "👁",
  },

  {
    value:
      "trusted",

    label:
      "CONFIABLE",

    symbol:
      "✓",
  },
];

export function TeamPersonalProfileEditor({
  teamName,
  enabled = true,
}: Props) {

  const key =
    teamPersonalProfileKey(
      teamName
    );

  const profile =
    useTeamPersonalProfileStore(
      state =>
        state.profiles[
          key
        ]
    );

  const loaded =
    useTeamPersonalProfileStore(
      state =>
        Boolean(
          state.loadedKeys[
            key
          ]
        )
    );

  const loading =
    useTeamPersonalProfileStore(
      state =>
        Boolean(
          state.loadingKeys[
            key
          ]
        )
    );

  const saving =
    useTeamPersonalProfileStore(
      state =>
        Boolean(
          state.savingKeys[
            key
          ]
        )
    );

  const error =
    useTeamPersonalProfileStore(
      state =>
        state.errors[
          key
        ] ??
        null
    );

  const ensure =
    useTeamPersonalProfileStore(
      state =>
        state.ensure
    );

  const save =
    useTeamPersonalProfileStore(
      state =>
        state.save
    );

  const [
    label,
    setLabel,
  ] =
    useState<
      TeamPersonalLabel |
      null
    >(
      null
    );

  const [
    note,
    setNote,
  ] =
    useState(
      ""
    );

  const [
    saved,
    setSaved,
  ] =
    useState(
      false
    );

  useEffect(
    () => {

      if (
        !enabled
      ) {
        return;
      }

      void ensure(
        teamName
      );
    },
    [
      enabled,
      ensure,
      teamName,
    ]
  );

  useEffect(
    () => {

      if (
        !loaded
      ) {
        return;
      }

      setLabel(
        profile?.label ??
        null
      );

      setNote(
        profile?.note ??
        ""
      );
    },
    [
      loaded,
      profile,
    ]
  );

  const selectLabel =
    (
      next:
        TeamPersonalLabel
    ) => {

      setSaved(
        false
      );

      setLabel(
        current =>
          current ===
          next
            ? null
            : next
      );
    };

  const handleSave =
    async () => {

      setSaved(
        false
      );

      try {
        await save({
          teamName,

          label,

          note:
            note.trim() ||
            null,
        });

        setSaved(
          true
        );
      } catch {
        // Error queda en store.
      }
    };

  if (
    loading &&
    !loaded
  ) {
    return (
      <View
        style={
          styles.loading
        }
      >
        <ActivityIndicator
          size="small"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Cargando nota personal...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={
        styles.container
      }
    >
      <Text
        style={
          styles.title
        }
      >
        MEMORIA PERSONAL
      </Text>

      <Text
        style={
          styles.teamName
        }
      >
        {teamName}
      </Text>

      <Text
        style={
          styles.labelTitle
        }
      >
        ¿Cómo quieres recordar a este equipo?
      </Text>

      <View
        style={
          styles.labels
        }
      >
        {LABELS.map(
          option => {

            const active =
              label ===
              option.value;

            return (
              <TouchableOpacity
                key={
                  option.value
                }
                activeOpacity={
                  0.8
                }
                onPress={
                  () =>
                    selectLabel(
                      option.value
                    )
                }
                style={[
                  styles.labelButton,

                  active &&
                    styles.labelButtonActive,

                  active &&
                  option.value ===
                    "avoid" &&
                    styles.avoidActive,

                  active &&
                  option.value ===
                    "watch" &&
                    styles.watchActive,

                  active &&
                  option.value ===
                    "trusted" &&
                    styles.trustedActive,
                ]}
              >
                <Text
                  style={
                    styles.labelText
                  }
                >
                  {option.symbol}{" "}
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      <Text
        style={
          styles.noteTitle
        }
      >
        Nota personal
      </Text>

      <TextInput
        value={
          note
        }
        onChangeText={
          value => {
            setSaved(
              false
            );

            setNote(
              value
            );
          }
        }
        multiline
        maxLength={
          500
        }
        placeholder="Ej.: No ganó ni teniendo dos jugadores más. Evitar confiarme de este equipo."
        placeholderTextColor="#59616D"
        textAlignVertical="top"
        style={
          styles.input
        }
      />

      <View
        style={
          styles.footer
        }
      >
        <Text
          style={
            styles.counter
          }
        >
          {note.length}/500
        </Text>

        <TouchableOpacity
          disabled={
            saving
          }
          activeOpacity={
            0.8
          }
          onPress={
            handleSave
          }
          style={[
            styles.saveButton,

            saving &&
              styles.saveButtonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
            />
          ) : (
            <Text
              style={
                styles.saveText
              }
            >
              Guardar
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {saved && (
        <Text
          style={
            styles.saved
          }
        >
          ✓ Guardado
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
    </View>
  );
}
