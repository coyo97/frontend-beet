import React, {
  useEffect,
} from "react";

import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useProviderSettingsStore,
} from "../store/providerSettingsStore";

import type {
  FootballProviderKey,
} from "../types/providerSettings";

import {
  ProviderSettingRow,
} from "./ProviderSettingRow";

import {
  styles,
} from "./ProviderSettingsSection.styles";

const ORDER:
  FootballProviderKey[] =
  [
    "sofascore",
    "flashscore",
    "fotmob",
    "api-football",
    "1xbet",
  ];

export function ProviderSettingsSection() {

  const items =
    useProviderSettingsStore(
      state =>
        state.items
    );

  const loading =
    useProviderSettingsStore(
      state =>
        state.loading
    );

  const updatingKey =
    useProviderSettingsStore(
      state =>
        state.updatingKey
    );

  const noSession =
    useProviderSettingsStore(
      state =>
        state.noSession
    );

  const error =
    useProviderSettingsStore(
      state =>
        state.error
    );

  const message =
    useProviderSettingsStore(
      state =>
        state.message
    );

  const load =
    useProviderSettingsStore(
      state =>
        state.load
    );

  const toggle =
    useProviderSettingsStore(
      state =>
        state.toggle
    );

  useEffect(
    () => {

      void load();

    },
    [
      load,
    ]
  );

  return (
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
        PROVEEDORES DE FÚTBOL
      </Text>

      <Text
        style={
          styles.help
        }
      >
        Desactiva proveedores que no quieras consultar. Al apagar uno, el backend deja de pedirle datos y elimina su caché activa.
      </Text>

      {noSession && (
        <View
          style={
            styles.notice
          }
        >
          <Text
            style={
              styles.noticeTitle
            }
          >
            Sesión requerida
          </Text>

          <Text
            style={
              styles.noticeText
            }
          >
            Puedes cambiar el servidor antes del login, pero para activar o desactivar proveedores debes iniciar sesión.
          </Text>
        </View>
      )}

      {loading &&
        !items && (
        <View
          style={
            styles.loading
          }
        >
          <ActivityIndicator />

          <Text
            style={
              styles.loadingText
            }
          >
            Cargando proveedores...
          </Text>
        </View>
      )}

      {items &&
        ORDER.map(
          key => {

            const item =
              items[
                key
              ];

            if (!item) {
              return null;
            }

            return (
              <ProviderSettingRow
                key={
                  key
                }
                item={
                  item
                }
                updating={
                  updatingKey ===
                  key
                }
                onChange={
                  (
                    providerKey,
                    enabled
                  ) => {
                    void toggle(
                      providerKey,
                      enabled
                    );
                  }
                }
              />
            );
          }
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
        <>
          <Text
            style={
              styles.error
            }
          >
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            onPress={
              () => {
                void load(
                  true
                );
              }
            }
            style={
              styles.retry
            }
          >
            <Text
              style={
                styles.retryText
              }
            >
              Reintentar
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
