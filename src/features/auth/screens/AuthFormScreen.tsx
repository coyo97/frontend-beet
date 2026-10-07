import React, {
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
  router,
} from "expo-router";

import {
  registerUser,
} from "../api/authService";

import {
  useAuthStore,
} from "../store/authStore";

import {
  styles,
} from "./AuthFormScreen.styles";

interface Props {
  mode:
    "login" | "register";
}

export function AuthFormScreen({
  mode,
}: Props) {
  const isRegister =
    mode === "register";

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirm,
    setConfirm,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const login =
    useAuthStore(
      state => state.login
    );

  const submit =
    async () => {
      if (loading) {
        return;
      }

      if (
        !username.trim() ||
        !password
      ) {
        setError(
          "Completa los campos."
        );

        return;
      }

      if (
        isRegister &&
        password !== confirm
      ) {
        setError(
          "Las contraseñas no coinciden."
        );

        return;
      }

      setError(null);
      setLoading(true);

      try {
        if (isRegister) {
          await registerUser(
            username.trim(),
            password
          );

          router.replace(
            "/login"
          );
        } else {
          await login(
            username.trim(),
            password
          );

          router.replace(
            "/"
          );
        }
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Ocurrió un error."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <View
      style={
        styles.screen
      }
    >
      <View
        style={
          styles.card
        }
      >
        <Text
          style={
            styles.brand
          }
        >
          FOOTBALL RADAR
        </Text>

        <Text
          style={
            styles.title
          }
        >
          {isRegister
            ? "Crear cuenta"
            : "Iniciar sesión"}
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          {isRegister
            ? "Conserva tu historial y memoria de equipos."
            : "Accede a tus registros personales."}
        </Text>

        <TextInput
          value={
            username
          }
          onChangeText={
            setUsername
          }
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          placeholder="Nombre de usuario"
          placeholderTextColor="#778292"
          style={
            styles.input
          }
          editable={
            !loading
          }
        />

        <TextInput
          value={
            password
          }
          onChangeText={
            setPassword
          }
          secureTextEntry
          autoCapitalize="none"
          autoComplete={
            isRegister
              ? "new-password"
              : "current-password"
          }
          placeholder="Contraseña"
          placeholderTextColor="#778292"
          style={
            styles.input
          }
          editable={
            !loading
          }
        />

        {isRegister && (
          <TextInput
            value={
              confirm
            }
            onChangeText={
              setConfirm
            }
            secureTextEntry
            autoCapitalize="none"
            placeholder="Confirmar contraseña"
            placeholderTextColor="#778292"
            style={
              styles.input
            }
            editable={
              !loading
            }
          />
        )}

        {isRegister && (
          <Text
            style={
              styles.hint
            }
          >
            Contraseña de al menos 12 caracteres.
            No necesitas correo ni teléfono.
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
            loading
          }
          style={
            styles.submit
          }
          onPress={
            () => {
              void submit();
            }
          }
        >
          {loading ? (
            <ActivityIndicator
              color="#101419"
            />
          ) : (
            <Text
              style={
                styles.submitText
              }
            >
              {isRegister
                ? "Registrarme"
                : "Entrar"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            () =>
              router.replace(
                isRegister
                  ? "/login"
                  : "/register"
              )
          }
        >
          <Text
            style={
              styles.link
            }
          >
            {isRegister
              ? "Ya tengo cuenta"
              : "Crear una cuenta"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
