
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 12,
  },

  button: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#174D55",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.35,
  },

  buttonText: {
    color: "#E6FFFF",
    fontSize: 30,
    fontWeight: "500",
  },

  valueContainer: {
    minWidth: 92,
    alignItems: "center",
  },

  value: {
    color: "#F1F5F9",
    fontSize: 38,
    fontWeight: "700",
  },

  valueLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
});

