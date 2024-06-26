import { StyleSheet } from "react-native";
const maxWidth = 414; // This is a common width for mobile devices
import { Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Aligns content to the top
    alignItems: "center", // Centers content horizontally
    width: "100%", // Takes full width of the parent
    maxHeight: screenHeight, // Use the actual screen height
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%", // Adjust the width to be 90% of the parent container
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    color: "black",
    alignSelf: "center", // Ensure it is centered within its parent container
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddd",
    borderRadius: 5,
    margin: 5,
  },
  activeToggleButton: {
    backgroundColor: "#007bff",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recipeScrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center", // Make sure content is centered
    width: "100%", // Ensure it takes the full width
  },
  recipeContainer: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "100%", // Make sure the width is set to 100% of its parent
    marginBottom: 120, // You might adjust or remove this if it causes layout issues
    maxWidth: 600, // Optionally set a max width for better web layout
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 10,
  },
  caloriesText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  ratingText: {
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
  },
  signOutButton: {
    marginLeft: 10, // Adjusted to give space for the logo
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: "bold",
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 480, // Common mobile screen width
    alignSelf: "center", // Center horizontally in the parent
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  profileText: {
    fontSize: 22, // Increased font size
    marginBottom: 15,
    color: "#333",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
});
