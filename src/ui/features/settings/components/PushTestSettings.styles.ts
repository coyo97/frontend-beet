
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#122330",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#31505B",
    padding: 18,
    gap: 12,
    marginVertical: 12,
  },

  title: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "700",
  },

  description: {
    color: "#A9BAC7",
    fontSize: 13,
    lineHeight: 19,
  },

  button: {
    backgroundColor: "#167C78",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  result: {
    color: "#C5E9E4",
    fontSize: 13,
    lineHeight: 21,
  },
});

