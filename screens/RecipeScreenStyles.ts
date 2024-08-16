import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#E6F5E1", // Light green background
    alignItems: "center",
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
  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
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
  picker: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  recipeList: {
    paddingBottom: 20,
    width: "100%", // Ensure the list takes the full width of the container
    alignSelf: "center", // Center the list within the parent container
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
    width: screenWidth * 0.9, // Constrain each recipe item to 90% of the screen width
    alignSelf: "center", // Center the item within the list
    borderRadius: 8, // Optional: to give it a more card-like appearance
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1, // Allow the text to shrink if needed
    color: "#333",
  },
  cuisineText: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
  recommendedContainer: {
    backgroundColor: "#FFF9E6", // Light yellow background for emphasis
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: screenWidth * 0.9, // 90% of the screen width
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#FFD700", // Gold color for border
  },
  recommendedTitle: {
    fontSize: 22,
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
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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
  },
  recommendedDishName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  recommendedCuisineText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  reasonTextContainer: {
    marginTop: 10,
  },
});
