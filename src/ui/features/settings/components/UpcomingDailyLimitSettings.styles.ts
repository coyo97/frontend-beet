
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111F2B",
    borderRadius: 18,
    padding: 18,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#253746",
  },

  title: {
    color: "#F1F5F9",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: "#A8B6C5",
    fontSize: 13,
    lineHeight: 20,
  },

  range: {
    color: "#94A3B8",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 18,
  },

  usageBox: {
    backgroundColor: "#192B37",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 14,
  },

  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  usageLabel: {
    color: "#C2CED9",
    fontSize: 13,
  },

  usageValue: {
    color: "#6CE6D9",
    fontSize: 17,
    fontWeight: "700",
  },

  helper: {
    color: "#8B9CAB",
    fontSize: 11,
    lineHeight: 17,
  },

  unsaved: {
    color: "#F4C46A",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },

  saveButton: {
    backgroundColor: "#197B78",
    borderRadius: 12,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  saveButtonDisabled: {
    opacity: 0.45,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  success: {
    color: "#72E8BF",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },

  footer: {
    color: "#8194A4",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },

  errorBox: {
    marginTop: 12,
    gap: 8,
  },

  error: {
    color: "#F4A3A3",
    fontSize: 12,
  },

  retry: {
    color: "#6CE6D9",
    fontSize: 13,
    fontWeight: "600",
  },
});

