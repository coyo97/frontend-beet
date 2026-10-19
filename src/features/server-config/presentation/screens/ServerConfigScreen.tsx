import React, {
  useEffect,
} from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useServerConfigStore,
} from "../store/serverConfigStore";

import {
  ProviderSettingsSection,
} from "@/features/provider-settings/components/ProviderSettingsSection";

import {
  styles,
} from "./ServerConfigScreen.styles";

export function ServerConfigScreen() {

  const active =
    useServerConfigStore(
      state =>
        state.active
    );

  const draft =
    useServerConfigStore(
      state =>
        state.draft
    );

  const loading =
    useServerConfigStore(
      state =>
        state.loading
    );

  const testing =
    useServerConfigStore(
      state =>
        state.testing
    );

  const saving =
    useServerConfigStore(
      state =>
        state.saving
    );

  const tested =
    useServerConfigStore(
      state =>
        state.tested
    );

  const message =
    useServerConfigStore(
      state =>
        state.message
    );

  const error =
    useServerConfigStore(
      state =>
        state.error
    );

  const load =
    useServerConfigStore(
      state =>
        state.load
    );

  const setDraft =
    useServerConfigStore(
      state =>
        state.setDraft
    );

  const testConnection =
    useServerConfigStore(
      state =>
        state.testConnection
    );

  const save =
    useServerConfigStore(
      state =>
        state.save
    );

  const reset =
    useServerConfigStore(
      state =>
        state.reset
    );

  useEffect(
    () => {

      void load();

    },
    [
      load,
    ]
  );

  if (
    loading &&
    !active
  ) {
    return (
      <View
        style={
          styles.center
        }
      >
        <ActivityIndicator />

        <Text
          style={
            styles.loading
          }
        >
          Cargando configuración...
        </Text>
      </View>
    );
  }

  const busy =
    testing ||
    saving;

  return (
    <ScrollView
      style={
        styles.screen
      }
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={
          styles.title
        }
      >
        Servidor
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Cambia la conexión del backend sin generar una APK nueva.
      </Text>

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          CONEXIÓN ACTUAL
        </Text>

        <View
          style={
            styles.statusRow
          }
        >
          <View
            style={
              styles.statusDot
            }
          />

          <Text
            style={
              styles.statusText
            }
          >
            {active
              ? "Configurado"
              : "Sin configuración"}
          </Text>
        </View>

        {active && (
          <>
            <Text
              selectable
              style={
                styles.currentUrl
              }
            >
              {active.origin}
            </Text>

            <Text
              style={
                styles.source
              }
            >
              {active.source ===
              "override"
                ? "URL personalizada"
                : "Servidor predeterminado"}
            </Text>

            <View
              style={
                styles.detail
              }
            >
              <Text
                style={
                  styles.detailLabel
                }
              >
                API
              </Text>

              <Text
                selectable
                style={
                  styles.detailValue
                }
              >
                {active.apiBaseUrl}
              </Text>
            </View>

            <View
              style={
                styles.detail
              }
            >
              <Text
                style={
                  styles.detailLabel
                }
              >
                Socket
              </Text>

              <Text
                selectable
                style={
                  styles.detailValue
                }
              >
                {active.socketUrl}
              </Text>
            </View>
          </>
        )}
      </View>

		<ProviderSettingsSection />

      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.sectionTitle
          }
        >
          CAMBIAR BACKEND
        </Text>

        <Text
          style={
            styles.help
          }
        >
          Puedes pegar solo el dominio de Cloudflare. También se acepta una URL terminada en /api/v1.
        </Text>

        <TextInput
          value={
            draft
          }
          onChangeText={
            setDraft
          }
          editable={
            !busy
          }
          autoCapitalize="none"
          autoCorrect={
            false
          }
          keyboardType="url"
          placeholder="https://xxxx.trycloudflare.com"
          placeholderTextColor="#596270"
          style={
            styles.input
          }
        />

        {tested && (
          <Text
            style={
              styles.tested
            }
          >
            ✓ URL verificada
          </Text>
        )}

        {message && (
          <Text
            style={
              styles.success
            }
          >
            {message}
          </Text>
        )}

        {error && (
          <Text
            style={
              styles.error
            }
          >
            {error}
          </Text>
        )}

        <TouchableOpacity
          activeOpacity={
            0.8
          }
          disabled={
            busy ||
            !draft.trim()
          }
          onPress={
            () => {
              void testConnection();
            }
          }
          style={[
            styles.button,
            styles.testButton,

            busy &&
              styles.disabled,
          ]}
        >
          {testing ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={
                styles.buttonText
              }
            >
              Probar conexión
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={
            0.8
          }
          disabled={
            busy ||
            !draft.trim()
          }
          onPress={
            () => {
              void save();
            }
          }
          style={[
            styles.button,
            styles.saveButton,

            busy &&
              styles.disabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={
                styles.saveButtonText
              }
            >
              Guardar servidor
            </Text>
          )}
        </TouchableOpacity>

        {active?.source ===
          "override" && (
          <TouchableOpacity
            activeOpacity={
              0.8
            }
            disabled={
              busy
            }
            onPress={
              () => {
                void reset();
              }
            }
            style={[
              styles.button,
              styles.resetButton,

              busy &&
                styles.disabled,
            ]}
          >
            <Text
              style={
                styles.resetButtonText
              }
            >
              Restaurar predeterminado
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={
          styles.infoCard
        }
      >
        <Text
          style={
            styles.infoTitle
          }
        >
          ¿Qué ocurre al guardar?
        </Text>

        <Text
          style={
            styles.infoText
          }
        >
          Las nuevas peticiones HTTP utilizarán inmediatamente esta dirección y el Socket se desconectará del servidor anterior para conectarse al nuevo.
        </Text>
      </View>
    </ScrollView>
  );
}
