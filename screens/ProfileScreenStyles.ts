import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F5E1",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  profileLogo: {
    width: 100,
    height: 150,
    alignSelf: "center",
    marginVertical: 20,
  },
  profileContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4CAF50",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  redeemButton: {
    backgroundColor: "#A5D6A7",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  referralContainer: {
    marginVertical: 20,
  },
  profileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  profileLabel: {
    fontWeight: "bold",
    color: "#4CAF50",
    fontSize: 20,
  },
  profileValue: {
    color: "#333",
    fontSize: 20,
  },
  profileText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
  },
  progressBarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  bmiLow: {
    color: "#FF5722",
  },
  bmiNormal: {
    color: "#4CAF50",
  },
  bmiHigh: {
    color: "#FF0000",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
});
