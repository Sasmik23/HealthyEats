import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './RecipeScreenStyles';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { useFocusEffect } from '@react-navigation/native';

interface Recipe {
    id: string;
    dishName: string;
    cuisine: string;
    ingredients: string[];
    steps: string[];
    healthy_cooking_tips: string[];
    nutrition_information: {
        servings_per_dish: number;
        energy: string;
        carbohydrate: string;
        protein: string;
        total_fat: string;
        saturated_fat: string;
        cholesterol: string;
        dietary_fibre: string;
        sodium: string;
    };
}

interface Profile {
    id: string | null;
    userId: string | null;
    profilePicture: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    bmi: number | null;
    chronicDisease: string | null;
    healthGoal: string | null;
    targetWeight: number | null;
}

const client = generateClient<Schema>();

const RecipesScreen: React.FC = () => {
    const { user } = useAuthenticator();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchIngredient, setSearchIngredient] = useState<string>('');
    const [selectedCuisine, setSelectedCuisine] = useState<string>('');
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);

    // Fetch user profile and recipes
    const fetchProfileAndRecipes = async () => {
        setLoading(true);
        try {
            // Fetch User Profile
            const profileResult = await client.models.Profile.list({
                filter: { userId: { eq: user?.signInDetails?.loginId } },
            });
            const profileData = profileResult.data[0];

            if (profileData) {
                const userProfile: Profile = {
                    id: profileData.id ?? '',
                    userId: profileData.userId ?? '',
                    profilePicture: profileData.profilePicture ?? '',
                    age: profileData.age ?? 0,
                    weight: profileData.weight ?? 0,
                    height: profileData.height ?? 0,
                    bmi: profileData.bmi ?? 0,
                    chronicDisease: profileData.chronicDisease ?? '',
                    healthGoal: profileData.healthGoal ?? '',
                    targetWeight: profileData.targetWeight ?? 0,
                };
                setUserProfile(userProfile);
            }

            // Fetch Recipes
            const recipeResult = await client.models.Recipe.list();
            if (recipeResult.errors) {
                console.error('Errors fetching recipes:', recipeResult.errors);
                return;
            }

            const allRecipes = recipeResult.data.map((recipe: any) => ({
                id: recipe.id,
                dishName: recipe.dishName,
                cuisine: recipe.cuisine,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                healthy_cooking_tips: recipe.healthy_cooking_tips,
                nutrition_information: recipe.nutrition_information,
            }));

            setRecipes(allRecipes as Recipe[]);
        } catch (error) {
            console.error('Error fetching profile or recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Reset state when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            // Reset state
            handleReset();

            // Fetch profile and recipes
            fetchProfileAndRecipes();

            return () => {
                // Clean up if needed
            };
        }, [])
    );

    const handleSearch = () => {
        setLoading(true);
        try {
            let filtered = recipes;

            if (searchQuery) {
                filtered = filtered.filter(recipe =>
                    recipe.dishName.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (ingredients.length > 0) {
                filtered = filtered.filter(recipe =>
                    ingredients.every(ingredient =>
                        recipe.ingredients.some(recipeIngredient =>
                            recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
                        )
                    )
                );
            }

            if (selectedCuisine) {
                filtered = filtered.filter(recipe =>
                    recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
                );
            }

            setFilteredRecipes(filtered);
            setIsFilterExpanded(false); // Collapse filter section after search

            // Determine the recommended recipe
            if (userProfile) {
                const bestRecipe = getBestRecipeForUser(filtered, userProfile);
                setRecommendedRecipe(bestRecipe);
            } else {
                setRecommendedRecipe(null);
            }
        } catch (error) {
            console.error('Error filtering recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchQuery('');
        setSearchIngredient('');
        setSelectedCuisine('');
        setIngredients([]);
        setFilteredRecipes([]);
        setRecommendedRecipe(null); // Reset the recommended recipe as well
        setIsFilterExpanded(true);  // Expand the filter section after reset
    };

    const getBestRecipeForUser = (recipes: Recipe[], profile: Profile): Recipe | null => {
        let bestRecipe: Recipe | null = null;
        let bestScore = Infinity;

        recipes.forEach(recipe => {
            let score = 0;

            if (profile.healthGoal === 'gain_weight') {
                score = -parseFloat(recipe.nutrition_information.protein);
            } else if (profile.healthGoal === 'lose_weight') {
                score = parseFloat(recipe.nutrition_information.energy);
            }

            const chronicDisease = profile.chronicDisease ?? ''; // Default to empty string if null

            if (chronicDisease.includes('htn')) {
                score += parseFloat(recipe.nutrition_information.sodium);
            }

            if (chronicDisease.includes('hld')) {
                score += parseFloat(recipe.nutrition_information.cholesterol);
            }

            if (chronicDisease.includes('dm')) {
                score += parseFloat(recipe.nutrition_information.carbohydrate);
            }

            if (score < bestScore) {
                bestScore = score;
                bestRecipe = recipe;
            }
        });

        return bestRecipe;
    };

    const renderItem = ({ item }: { item: Recipe }) => (
        <TouchableOpacity style={styles.recipeItem} onPress={() => {
            setSelectedRecipe(item);
            setIsModalVisible(true);
        }}>
            <Text style={styles.recipeName}>{item.dishName}</Text>
            <Text style={styles.cuisineText}>{item.cuisine}</Text>
        </TouchableOpacity>
    );

    const renderModalContent = () => (
        selectedRecipe ? (
            <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.modalTitle}>{selectedRecipe.dishName}</Text>
                    <Text style={styles.sectionTitle}>Cuisine:</Text>
                    <Text style={styles.modalText}>{selectedRecipe.cuisine}</Text>
                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                        <Text key={index} style={styles.modalText}>{`\u2022 ${ingredient}`}</Text>
                    ))}
                    <Text style={styles.sectionTitle}>Steps:</Text>
                    {selectedRecipe.steps.map((step, index) => (
                        <Text key={index} style={styles.modalText}>{step}</Text>
                    ))}
                    <Text style={styles.sectionTitle}>Healthy Cooking Tips:</Text>
                    {selectedRecipe.healthy_cooking_tips.map((tip, index) => (
                        <Text key={index} style={styles.modalText}>{tip}</Text>
                    ))}
                    <Text style={styles.sectionTitle}>Nutrition Information:</Text>
                    <Text style={styles.modalText}>Servings per Dish: {selectedRecipe.nutrition_information.servings_per_dish}</Text>
                    <Text style={styles.modalText}>Energy: {selectedRecipe.nutrition_information.energy}</Text>
                    <Text style={styles.modalText}>Carbohydrate: {selectedRecipe.nutrition_information.carbohydrate}</Text>
                    <Text style={styles.modalText}>Protein: {selectedRecipe.nutrition_information.protein}</Text>
                    <Text style={styles.modalText}>Total Fat: {selectedRecipe.nutrition_information.total_fat}</Text>
                    <Text style={styles.modalText}>Saturated Fat: {selectedRecipe.nutrition_information.saturated_fat}</Text>
                    <Text style={styles.modalText}>Cholesterol: {selectedRecipe.nutrition_information.cholesterol}</Text>
                    <Text style={styles.modalText}>Dietary Fibre: {selectedRecipe.nutrition_information.dietary_fibre}</Text>
                    <Text style={styles.modalText}>Sodium: {selectedRecipe.nutrition_information.sodium}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        ) : (
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Loading...</Text>
            </View>
        )
    );

    const handleAddIngredient = () => {
        if (searchIngredient && !ingredients.includes(searchIngredient)) {
            setIngredients([...ingredients, searchIngredient]);
            setSearchIngredient('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {isFilterExpanded && (
                <View style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>Search by Name:</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="e.g., Spaghetti"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Text style={styles.filterLabel}>Add Ingredient:</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="e.g., Tomato"
                        value={searchIngredient}
                        onChangeText={setSearchIngredient}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                    <View style={styles.selectedIngredients}>
                        {ingredients.map((ingredient, index) => (
                            <Text key={index} style={styles.selectedIngredient}>{ingredient}</Text>
                        ))}
                    </View>
                    <Text style={styles.filterLabel}>Select Cuisine:</Text>
                    <Picker
                        selectedValue={selectedCuisine}
                        onValueChange={(itemValue) => setSelectedCuisine(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="All Cuisines" value="" />
                        <Picker.Item label="Asian" value="asian" />
                        <Picker.Item label="Indian" value="indian" />
                        <Picker.Item label="International" value="international" />
                        <Picker.Item label="Western" value="western" />
                    </Picker>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Ionicons name="search" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.searchButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {!isFilterExpanded && (
                <TouchableOpacity style={styles.expandButton} onPress={() => setIsFilterExpanded(true)}>
                    <Text style={styles.expandButtonText}>Expand Filters</Text>
                </TouchableOpacity>
            )}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    ListHeaderComponent={recommendedRecipe && (
                        <TouchableOpacity
                            style={styles.recommendedContainer}
                            onPress={() => {
                                setSelectedRecipe(recommendedRecipe);
                                setIsModalVisible(true);
                            }}
                        >
                            <Text style={styles.recommendedTitle}>Recommended Recipe</Text>
                            <Text style={styles.recipeName}>{recommendedRecipe.dishName}</Text>
                            <Text style={styles.cuisineText}>{recommendedRecipe.cuisine}</Text>
                            <Text style={styles.reasonText}>
                                {userProfile?.healthGoal === 'gain_weight' && 'High protein to help you gain weight\n'}
                                {userProfile?.healthGoal === 'lose_weight' && 'Low energy to help you lose weight\n'}
                                {userProfile?.chronicDisease?.includes('htn') && 'Low sodium for your hypertension\n'}
                                {userProfile?.chronicDisease?.includes('hld') && 'Low cholesterol for your hyperlipidemia\n'}
                                {userProfile?.chronicDisease?.includes('dm') && 'Low carbohydrates for your diabetes\n'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    data={filteredRecipes.filter(recipe => recipe.id !== recommendedRecipe?.id)}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.recipeList}
                />
            )}
            <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
                {renderModalContent()}
            </Modal>
        </SafeAreaView>
    );
};

export default RecipesScreen;
