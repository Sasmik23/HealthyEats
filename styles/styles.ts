import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Poppins-Bold", // Custom font
    color: "#013220", // Green color
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    //paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "black",
    alignSelf: "center",
    fontFamily: "Poppins-Regular", // Custom font
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    //marginBottom: 20,
    alignSelf: "center",
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5EB14A", // Light green background
    borderRadius: 10,
    margin: 5,
  },
  activeToggleButton: {
    backgroundColor: "#459C36", // Darker green for active button
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold", // Custom font
    fontSize: 18,
  },
  recipeScrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    width: "100%",
  },
  recipeContainer: {
    flex: 1,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 7,
    alignSelf: "center",
  },
  recipeText: {
    fontSize: 18,
    lineHeight: 26,
    color: "#333",
    marginBottom: 10,
    fontFamily: "Poppins-Regular", // Custom font
  },
  caloriesText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold", // Custom font
    color: "#4CAF50", // Green color
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Poppins-Regular", // Custom font
  },
  submitButton: {
    marginHorizontal: 10,
    backgroundColor: "#5EB14A", // Light green background
    padding: 5,
    borderRadius: 10,
  },
  expandButton: {
    backgroundColor: "#4CAF50", // Light green background
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold", // Custom font
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold", // Custom font
  },
  profileContainer: {
    width: "100%",
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 7,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontFamily: "Poppins-Bold", // Custom font
  },
  profileText: {
    fontSize: 22,
    marginBottom: 15,
    color: "#333",
    fontFamily: "Poppins-Regular", // Custom font
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  profileLogo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContentContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  recipeItemText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold", // Custom font
  },
  recipeItemRating: {
    fontSize: 16,
    color: "#888888",
    fontFamily: "Poppins-Regular", // Custom font
  },
  button: {
    backgroundColor: "#5EB14A", // Light green background
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold", // Custom font
  },
  rating: {
    marginVertical: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    padding: 5,
    backgroundColor: "#E6F5E1",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    fontFamily: "Poppins-Bold", // Custom font
  },
  logo: {
    width: 40, // Adjust the size of the logo as needed
    height: 40,
    resizeMode: "contain",
    position: "absolute",
    left: "80%",
    marginLeft: -30, // Half the width of the logo to center it
  },
  signOutButton: {
    fontSize: 18,
    color: "#4CAF50",
    flex: 1,
    textAlign: "right",
    fontFamily: "Poppins-Bold", // Custom font
  },
  tabBar: {
    backgroundColor: "#fff",
    maxWidth: 480, // Limit width to mobile-friendly dimensions
    alignSelf: "center", // Center the tab bar
    width: "100%", // Take the full width of the container
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    height: 60, // Adjust height if needed
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#E6F5E1", // Light green background
    alignItems: "center",
  },
  locatorContainer: {
    flex: 1,
    backgroundColor: "#E6F5E1", // Light green background
    padding: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: screenWidth / 2.2,
    backgroundColor: "#fff",
    borderRadius: 5,
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
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins-Bold", // Custom font
    color: "#4CAF50", // Green color
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins-Regular", // Custom font
  },
  closeButton: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold", // Custom font
  },
  bmiCategory: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    fontFamily: "Poppins-Regular", // Custom font
  },
  bmiLow: {
    color: "#FF5722", // Orange color for low BMI
  },
  bmiNormal: {
    color: "#4CAF50", // Green color for normal BMI
  },
  bmiHigh: {
    color: "#FF0000", // Red color for high BMI
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Poppins-Regular", // Custom font
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
