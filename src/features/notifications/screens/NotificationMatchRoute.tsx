
import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
} from "react-native";

import {
  useLocalSearchParams,
} from "expo-router";

import MatchDetailScreen
  from "@/ui/features/radar/screens/MatchDetailScreen";

import {
  RedCardNotificationEntry,
} from "../components/RedCardNotificationEntry";

import {
  styles,
} from "./NotificationMatchRoute.styles";

export default function NotificationMatchRoute() {

  const params =
    useLocalSearchParams<{
      id?: string;
      focus?: string;
      homeName?: string;
      awayName?: string;
      affectedSide?: string;
      minute?: string;
    }>();

  const [
    showNotification,
    setShowNotification,
  ] = useState(
    params.focus === "red-card"
  );

  /*
   * Si abrimos otro partido desde
   * una notificacion, mostramos
   * nuevamente su aviso.
   */
  useEffect(() => {
    setShowNotification(
      params.focus === "red-card"
    );
  }, [
    params.id,
    params.focus,
  ]);

  return (
    <View style={styles.screen}>

      {showNotification && (
        <RedCardNotificationEntry
          homeName={params.homeName}
          awayName={params.awayName}
          affectedSide={
            params.affectedSide
          }
          minute={params.minute}
          onDismiss={() =>
            setShowNotification(false)
          }
        />
      )}

      <View style={styles.content}>
        <MatchDetailScreen />
      </View>

    </View>
  );
}

