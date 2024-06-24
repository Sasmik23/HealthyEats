import React, { useState } from 'react';
import { Text, TextInput, Button, ScrollView, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { styles } from '../styles/styles';
import RecipeInput from './RecipeInput';

Amplify.configure(outputs);

interface Recipe {
    id: string;
    dishName: string;
    recipe: string;
    rating: number;
    ratingCount: number;
    calories: number;
}

const client = generateClient<Schema>();

const RecipeFinder: React.FC<{ searchByDish: boolean }> = ({ searchByDish }) => {
    const [dishName, setDishName] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [recipe, setRecipe] = useState<string>('');
    const [calories, setCalories] = useState<number | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRecipe = async () => {
        setLoading(true);
        try {
            if (searchByDish) {
                await fetchRecipeByDishName();
            } else {
                await fetchRecipeByIngredients();
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipeByDishName = async () => {
        console.log("Fetching recipe for dish:", dishName);
        try {
            const { errors, data: existingRecipeData } = await client.models.Dish.list({
                filter: { dishName: { eq: dishName } }
            });
            if (errors) {
                console.error('Error fetching recipes:', errors);
                return;
            }

            if (existingRecipeData.length > 0) {
                const existingRecipe = existingRecipeData[0];
                setRecipe(existingRecipe.recipe ?? '');
                setCalories(existingRecipe.calories ?? null);
                setRating(existingRecipe.rating ?? null);
                console.log("Found existing recipe:", existingRecipe);
                return;
            }

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `Provide a healthy recipe for ${dishName} for diabetics.` }],
                    max_tokens: 1000,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                }
            );
            const fetchedRecipe = response.data.choices[0].message.content.trim();
            const estimatedCalories = await getEstimatedCalories(fetchedRecipe);
            setRecipe(fetchedRecipe);
            setCalories(estimatedCalories);
            console.log("Fetched recipe from GPT:", fetchedRecipe);

            await client.models.Dish.create({
                id: uuidv4(),
                dishName: dishName,
                recipe: fetchedRecipe,
                rating: 0,
                ratingCount: 0,
                calories: estimatedCalories,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error fetching recipe:', error.message);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                }
            } else {
                console.error('Unexpected error fetching recipe:', error);
            }
        }
    };

    const fetchRecipeByIngredients = async () => {
        console.log("Fetching recipe for ingredients:", ingredients);
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `Provide a healthy recipe with these ingredients: ${ingredients}, for diabetics` }],
                    max_tokens: 1000,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                }
            );
            const fetchedRecipe = response.data.choices[0].message.content.trim();
            const estimatedCalories = await getEstimatedCalories(fetchedRecipe);

            const suggestedDishName = await getDishNameFromRecipe(fetchedRecipe);

            const { errors, data: existingRecipeData } = await client.models.Dish.list({
                filter: { dishName: { eq: suggestedDishName } }
            });
            if (errors) {
                console.error('Error fetching recipes:', errors);
                return;
            }

            if (existingRecipeData.length > 0) {
                const existingRecipe = existingRecipeData[0];
                if (existingRecipe.calories != null && estimatedCalories < existingRecipe.calories) {
                    setRecipe(fetchedRecipe);
                    setCalories(estimatedCalories);
                    setRating(existingRecipe.rating ?? null);
                    console.log("Fetched new recipe with lower calories from GPT:", fetchedRecipe);

                    await client.models.Dish.update({
                        id: existingRecipe.id,
                        recipe: fetchedRecipe,
                        calories: estimatedCalories,
                    });
                } else {
                    setRecipe(existingRecipe.recipe ?? '');
                    setCalories(existingRecipe.calories ?? null);
                    setRating(existingRecipe.rating ?? null);
                    console.log("Found existing recipe with lower or equal calories:", existingRecipe);
                }
            } else {
                setRecipe(fetchedRecipe);
                setCalories(estimatedCalories);
                console.log("Fetched recipe from GPT:", fetchedRecipe);

                await client.models.Dish.create({
                    id: uuidv4(),
                    dishName: suggestedDishName,
                    recipe: fetchedRecipe,
                    rating: 0,
                    ratingCount: 0,
                    calories: estimatedCalories,
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error fetching recipe:', error.message);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                }
            } else {
                console.error('Unexpected error fetching recipe:', error);
            }
        }
    };

    const getEstimatedCalories = async (recipe: string): Promise<number> => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `Estimate the calories for the following recipe:\n\n${recipe}` }],
                    max_tokens: 50,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                }
            );
            console.log("API response for calorie estimation:", response.data);

            const messageContent = response.data.choices[0].message.content.trim();
            console.log("Message content for calorie estimation:", messageContent);

            // Attempt to extract the first number found in the response content
            const estimatedCalories = parseFloat(messageContent.match(/(\d+(\.\d+)?)/)?.[0] || '0');
            console.log("Estimated calories:", estimatedCalories);
            return estimatedCalories;
        } catch (error) {
            console.error('Error estimating calories:', error);
            return 0;
        }
    };

    const getDishNameFromRecipe = async (recipe: string): Promise<string> => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: `Extract the dish name from the following recipe:\n\n${recipe}` }],
                    max_tokens: 50,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                }
            );
            const dishName = response.data.choices[0].message.content.trim();
            return dishName;
        } catch (error) {
            console.error('Error extracting dish name:', error);
            return '';
        }
    };

    const submitRating = async () => {
        if (!userRating || !dishName) return;
        console.log("Submitting rating for:", dishName);
        try {
            const { errors, data: existingRecipeData } = await client.models.Dish.list({
                filter: { dishName: { eq: dishName } }
            });
            if (errors) {
                console.error('Error fetching recipes:', errors);
                return;
            }

            if (existingRecipeData.length > 0) {
                const existingRecipe = existingRecipeData[0];
                const newRatingCount = (existingRecipe.ratingCount ?? 0) + 1;
                const newRating = ((existingRecipe.rating ?? 0) * (existingRecipe.ratingCount ?? 0) + userRating) / newRatingCount;

                await client.models.Dish.update({
                    id: existingRecipe.id,
                    rating: newRating,
                    ratingCount: newRatingCount,
                });

                setRating(newRating);
                setUserRating(null);
                console.log("Updated rating:", newRating);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    return (
        <View>
            <RecipeInput
                searchByDish={searchByDish}
                dishName={dishName}
                setDishName={setDishName}
                ingredients={ingredients}
                setIngredients={setIngredients}
                fetchRecipe={fetchRecipe}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                recipe ? (
                    <ScrollView contentContainerStyle={styles.recipeScrollContainer}>
                        <View style={styles.recipeContainer}>
                            <Text style={styles.recipeText}>{recipe}</Text>
                            <Text style={styles.caloriesText}>Estimated Calories: {calories ? calories : 'N/A'}</Text>
                            <Text style={styles.ratingText}>Rating: {rating ? rating.toFixed(1) : 'Not rated yet'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Rate this recipe (1-5)"
                                placeholderTextColor="#888"
                                value={userRating ? userRating.toString() : ''}
                                onChangeText={(text) => setUserRating(parseInt(text))}
                                keyboardType="numeric"
                            />
                            <View style={styles.submitButton}>
                                <Button title="Submit Rating" onPress={submitRating} />
                            </View>
                        </View>
                    </ScrollView>
                ) : null
            )}
        </View>
    );
};

export default RecipeFinder;
