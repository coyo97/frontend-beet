
import {
  StyleSheet,
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,

    padding: 14,

    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B94A50",

    backgroundColor: "#24191E",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  heading: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 24,
    marginRight: 10,
  },

  headingText: {
    flex: 1,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 3,
    color: "#C7A8AD",
    fontSize: 12,
  },

  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  closeText: {
    color: "#E5C4C9",
    fontSize: 16,
  },

  match: {
    marginTop: 14,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  detailText: {
    color: "#FFC5C5",
    fontSize: 13,
    fontWeight: "600",
  },

  minute: {
    color: "#F3D1D1",
    fontSize: 12,
  },

  description: {
    color: "#C4B8BB",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 10,
  },
});

