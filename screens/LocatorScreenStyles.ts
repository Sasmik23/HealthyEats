import { StyleSheet } from "react-native";
export const locatorStyles = StyleSheet.create({
  locatorContainer: {
    flex: 1,
    backgroundColor: "#E6F5E1", // Light green background
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4CAF50",
    marginVertical: 10,
  },
  filterContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
  },
  restaurantList: {
    paddingBottom: 20,
  },
  restaurantItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold", // Custom font
  },
  restaurantDistance: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins-Regular", // Custom font
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
    color: "#4CAF50",
    alignSelf: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
    fontFamily: "Poppins-Regular",
  },
  closeButton: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },
});
