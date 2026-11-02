
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111F2B",
    borderColor: "#28404B",
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginVertical: 14,
    gap: 12,
  },

  title: {
    color: "#F1F5F9",
    fontWeight: "700",
    fontSize: 17,
  },

  description: {
    color: "#A8B6C5",
    fontSize: 13,
    lineHeight: 20,
  },

  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334857",
    backgroundColor: "#1B2D3A",
  },

  optionSelected: {
    backgroundColor: "#176B68",
    borderColor: "#56DACA",
  },

  optionText: {
    color: "#B9C7D3",
    fontSize: 12,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  usage: {
    backgroundColor: "#192B37",
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },

  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  usageLabel: {
    color: "#CAD5DE",
    fontSize: 13,
    flexShrink: 1,
  },

  usageValue: {
    color: "#6CE6D9",
    fontWeight: "700",
    fontSize: 17,
  },

  helper: {
    color: "#A4B3C0",
    fontSize: 12,
    lineHeight: 18,
  },

  unsaved: {
    color: "#F0C77D",
    textAlign: "center",
    fontSize: 12,
  },

  saveButton: {
    backgroundColor: "#197B78",
    borderRadius: 12,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.4,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  footer: {
    color: "#8599A8",
    fontSize: 11,
    lineHeight: 17,
  },

  success: {
    color: "#72E8BF",
    fontSize: 12,
  },

  errorArea: {
    gap: 10,
  },

  error: {
    color: "#F5A7A7",
    fontSize: 12,
  },

  retry: {
    color: "#69E4D5",
    fontWeight: "600",
    fontSize: 13,
  },
});

