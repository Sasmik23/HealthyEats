// Styles file
import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Poppins-Bold", // Custom font
    color: "#013220", // Green color
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
    fontFamily: "Poppins-Regular",
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#5EB14A",
    borderRadius: 10,
    margin: 5,
  },
  activeToggleButton: {
    backgroundColor: "#459C36",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginLeft: 5,
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
    width: screenWidth * 0.9, // Fill 90% of the screen width
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 7,
    marginBottom: 20,
    alignSelf: "center", // Center the container
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
    alignSelf: "center",
  },
  /*
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  */
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
    backgroundColor: "#fff",
    marginVertical: 2,
    width: "100%",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#5EB14A",
    borderRadius: 10,
    margin: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginLeft: 5,
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
    padding: 7,
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
    left: "90%",
  },
  signOutButton: {
    fontSize: 18,
    color: "#4CAF50",
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
    paddingBottom: 5,
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
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
    color: "#333",
  },
  progressBarContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imagePickerButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  imagePickerButtonText: {
    color: "#000",
  },
  activeImagePickerButton: {
    backgroundColor: "#4CAF50",
  },
  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f1f1f1",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4CAF50",
    marginVertical: 10,
  },
  ingredientList: {
    paddingBottom: 20,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    backgroundColor: "#fff",
    marginVertical: 2,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "bold",
    width: "70%", // Adjust the width to prevent text from cutting off
  },
  ingredientSize: {
    fontSize: 14,
    color: "#666",
    width: "30%", // Adjust the width to prevent text from cutting off
    textAlign: "right",
  },
  recipeList: {
    paddingBottom: 20,
    width: "100%",
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    width: "70%", // Adjust the width to prevent text from cutting off
  },
  recipeDetails: {
    fontSize: 14,
    color: "#666",
    width: "30%", // Adjust the width to prevent text from cutting off
    textAlign: "right",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  cuisineText: {
    fontSize: 14,
    color: "#666",
  },
  selectedIngredients: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  selectedIngredient: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    margin: 4,
    borderRadius: 4,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#A5D6A7",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  expandButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  expandButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#013220",
    flex: 1,
    textAlign: "center",
  },

  recommendedContainer: {
    backgroundColor: "#E6F5E1", // Light green background for emphasis
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  recommendedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50", // Green color for the title
    textAlign: "center",
  },
  reasonText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
  },
});
