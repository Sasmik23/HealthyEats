import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, ScrollView, Button } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/styles';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

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

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const result = await client.models.Recipe.list();
                if (result.errors) {
                    console.error('Errors fetching recipes:', result.errors);
                    return;
                }

                const allRecipes = result.data.map((recipe: any) => ({
                    id: recipe.id,
                    dishName: recipe.dishName,
                    cuisine: recipe.cuisine,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    healthy_cooking_tips: recipe.healthy_cooking_tips,
                    nutrition_information: recipe.nutrition_information,
                }));

                setRecipes(allRecipes as Recipe[]);
                setFilteredRecipes(allRecipes as Recipe[]);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

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
        setFilteredRecipes(recipes);
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
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
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
                    data={filteredRecipes}
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

