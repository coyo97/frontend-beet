
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#17232B",
    borderWidth: 1,
    borderColor: "#30434B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  subtitle: {
    color: "#A5BAC2",
    fontSize: 12,
    marginTop: 5,
  },

  conditions: {
    color: "#D2E6E8",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  detail: {
    flex: 1,
    color: "#9DB4BA",
    fontSize: 11,
  },

  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  deleteText: {
    color: "#FF9696",
    fontWeight: "600",
    fontSize: 12,
  },
});

