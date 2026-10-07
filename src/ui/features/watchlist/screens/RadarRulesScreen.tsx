import React, {
  useState,
} from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  useWatchlistStore,
} from "../../../../store/watchlistStore";

export default function RadarRulesScreen() {

  const [
    label,
    setLabel,
  ] =
    useState("");

  const [
    country,
    setCountry,
  ] =
    useState("");

  const [
    team,
    setTeam,
  ] =
    useState("");

  const [
    minimumMinute,
    setMinimumMinute,
  ] =
    useState("60");

  const [
    minimumPressure,
    setMinimumPressure,
  ] =
    useState("65");

  const [
    strongOnly,
    setStrongOnly,
  ] =
    useState(true);

  const [
    teamMustHaveAdvantage,
    setTeamMustHaveAdvantage,
  ] =
    useState(false);

  const createRadarRule =
    useWatchlistStore(
      (
        state
      ) =>
        state.createRadarRule
    );

  const mutating =
    useWatchlistStore(
      (
        state
      ) =>
        state.mutating
    );

  const save =
    async () => {

      const minute =
        Number(
          minimumMinute
        );

      const pressure =
        Number(
          minimumPressure
        );

      if (
        !label.trim()
      ) {
        Alert.alert(
          "Falta nombre",
          "Pon un nombre a la regla."
        );

        return;
      }

      if (
        !Number.isFinite(
          minute
        ) ||
        minute <
          0
      ) {
        Alert.alert(
          "Minuto inválido"
        );

        return;
      }

      if (
        !Number.isFinite(
          pressure
        ) ||
        pressure <
          0 ||
        pressure >
          100
      ) {
        Alert.alert(
          "Presión inválida",
          "Usa un valor entre 0 y 100."
        );

        return;
      }

      await createRadarRule(
        label.trim(),
        {
          event:
            "RED_CARD_PRESSURE",

          country:
            country.trim() ||
            undefined,

          teamName:
            team.trim() ||
            undefined,

          minimumStrength:
            strongOnly
              ? "strong"
              : "clear",

          minimumMinute:
            minute,

          minimumPressureScore:
            pressure,

          teamMustHaveAdvantage,
        }
      );

      Alert.alert(
        "Regla guardada",
        "Football Radar ya puede usar esta regla."
      );

      router.back();
    };

  return (
    <ScrollView
      style={
        styles.screen
      }
      contentContainerStyle={
        styles.content
      }
    >
      <TouchableOpacity
        onPress={
          () =>
            router.back()
        }
      >
        <Text
          style={
            styles.back
          }
        >
          ‹ Volver
        </Text>
      </TouchableOpacity>

      <Text
        style={
          styles.title
        }
      >
        🔔 Nueva regla
      </Text>

      <Text
        style={
          styles.subtitle
        }
      >
        Combina roja, presión, minuto, país o equipo.
      </Text>

      <TextInput
        value={
          label
        }
        onChangeText={
          setLabel
        }
        placeholder="Nombre: Brasil strong 60+"
        placeholderTextColor="#626B78"
        style={
          styles.input
        }
      />

      <TextInput
        value={
          country
        }
        onChangeText={
          setCountry
        }
        placeholder="País (opcional)"
        placeholderTextColor="#626B78"
        style={
          styles.input
        }
      />

      <TextInput
        value={
          team
        }
        onChangeText={
          setTeam
        }
        placeholder="Equipo (opcional)"
        placeholderTextColor="#626B78"
        style={
          styles.input
        }
      />

      <TextInput
        value={
          minimumMinute
        }
        onChangeText={
          setMinimumMinute
        }
        keyboardType="number-pad"
        placeholder="Minuto mínimo"
        placeholderTextColor="#626B78"
        style={
          styles.input
        }
      />

      <TextInput
        value={
          minimumPressure
        }
        onChangeText={
          setMinimumPressure
        }
        keyboardType="number-pad"
        placeholder="Presión mínima"
        placeholderTextColor="#626B78"
        style={
          styles.input
        }
      />

      <View
        style={
          styles.row
        }
      >
        <Text
          style={
            styles.rowText
          }
        >
          Solo STRONG
        </Text>

        <Switch
          value={
            strongOnly
          }
          onValueChange={
            setStrongOnly
          }
        />
      </View>

      <View
        style={
          styles.row
        }
      >
        <Text
          style={
            styles.rowText
          }
        >
          El equipo debe tener ventaja numérica
        </Text>

        <Switch
          value={
            teamMustHaveAdvantage
          }
          onValueChange={
            setTeamMustHaveAdvantage
          }
        />
      </View>

      <TouchableOpacity
        disabled={
          mutating
        }
        onPress={
          () => {
            void save();
          }
        }
        style={
          styles.save
        }
      >
        <Text
          style={
            styles.saveText
          }
        >
          {mutating
            ? "Guardando..."
            : "Guardar regla"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,

      backgroundColor:
        "#0E1015",
    },

    content: {
      padding:
        18,

      paddingTop:
        50,

      paddingBottom:
        80,
    },

    back: {
      color:
        "#91A9FF",

      fontSize:
        16,
    },

    title: {
      color:
        "#FFFFFF",

      fontSize:
        27,

      fontWeight:
        "800",

      marginTop:
        22,
    },

    subtitle: {
      color:
        "#7A8391",

      marginTop:
        6,

      marginBottom:
        22,
    },

    input: {
      backgroundColor:
        "#171A20",

      borderWidth:
        1,

      borderColor:
        "#303641",

      borderRadius:
        12,

      color:
        "#FFFFFF",

      paddingHorizontal:
        14,

      paddingVertical:
        13,

      marginBottom:
        10,
    },

    row: {
      minHeight:
        60,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      backgroundColor:
        "#171A20",

      borderRadius:
        12,

      paddingHorizontal:
        14,

      marginBottom:
        10,
    },

    rowText: {
      flex:
        1,

      color:
        "#D6DAE0",

      marginRight:
        12,
    },

    save: {
      backgroundColor:
        "#315BEA",

      borderRadius:
        13,

      paddingVertical:
        14,

      alignItems:
        "center",

      marginTop:
        14,
    },

    saveText: {
      color:
        "#FFFFFF",

      fontWeight:
        "800",
    },
  });
