
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B141A",
  },
  content: {
    padding: 18,
    paddingBottom: 60,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },
  subtitle: {
    color: "#A2B9BE",
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#14232B",
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
  },
  sectionTitle: {
    color: "#F2FFFF",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: "#C3D5D9",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    color: "#FFFFFF",
    backgroundColor: "#21343E",
    borderColor: "#38515A",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  choice: {
    backgroundColor: "#21343E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#38515A",
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  choiceText: {
    color: "#FFFFFF",
    flex: 1,
  },
  accent: {
    color: "#62DCCE",
    fontWeight: "700",
  },
  condition: {
    backgroundColor: "#1B303A",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  group: {
    backgroundColor: "#193039",
    borderColor: "#38545A",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  child: {
    marginVertical: 8,
  },
  childTitle: {
    color: "#A8C7C9",
    fontSize: 12,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  buttonPrimary: {
    backgroundColor: "#167F75",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 22,
  },
  buttonSecondary: {
    backgroundColor: "#29505A",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  removeButton: {
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  removeText: {
    color: "#FF9B9B",
    fontSize: 13,
    fontWeight: "600",
  },
  hint: {
    color: "#9CB5BB",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 12,
  },
  switchText: {
    flex: 1,
    paddingRight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000BB",
    justifyContent: "flex-end",
  },
  modalPanel: {
    backgroundColor: "#172B34",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "75%",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#304650",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    color: "#E0F2F3",
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B141A",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  errorText: {
    color: "#FF9B9B",
    textAlign: "center",
  },
});

