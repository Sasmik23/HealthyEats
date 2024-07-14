import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/styles';
import RecipeInput from './RecipeInput';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { v4 as uuidv4 } from 'uuid';
import { Rating } from 'react-native-ratings'; // Import Rating component

Amplify.configure(outputs);

const client = generateClient<Schema>();

const RecipeFinder: React.FC = () => {
    const [dishName, setDishName] = useState<string>('');
    const [ingredients, setIngredients] = useState<string>('');
    const [cuisine, setCuisine] = useState<string>('None');
    const [recipe, setRecipe] = useState<string>('');
    const [calories, setCalories] = useState<number | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userId = 'currentUserId'; // Replace with actual user ID
            const { errors, data } = await client.models.Profile.get({ id: userId });
            if (errors) {
                console.error('Error fetching user profile:', errors);
                return;
            }
            setProfile(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchRecipe = async (selectedCuisine: string, dishName: string, ingredients: string, imageUri: string | null) => {
        setLoading(true);
        setRecipe('');
        setCalories(null);
        setRating(null);
        setRatingSubmitted(false);

        try {
            if (imageUri) {
                await fetchRecipeByImage(imageUri, selectedCuisine);
            } else if (dishName) {
                await fetchRecipeByDishName(dishName, selectedCuisine);
            } else if (ingredients) {
                await fetchRecipeByIngredients(ingredients, selectedCuisine);
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCustomizedPrompt = (basePrompt: string) => {
        let customPrompt = basePrompt;
        if (profile) {
            if (profile.chronicDisease) {
                customPrompt += ` The user has the following chronic disease(s): ${profile.chronicDisease}.`;
            }
            if (profile.healthGoal) {
                customPrompt += ` The user's health goal is: ${profile.healthGoal}.`;
            }
            if (profile.targetWeight) {
                customPrompt += ` The user's target weight is: ${profile.targetWeight}kg.`;
            }
        }
        return customPrompt;
    };

    const fetchRecipeByDishName = async (dishName: string, cuisine: string) => {
        console.log('Dish Name:', dishName, 'Cuisine:', cuisine);
        try {
            const { errors, data: existingRecipeData } = await client.models.Dish.list({
                filter: { dishName: { eq: dishName } }
            });
            if (errors) {
                console.error('Error fetching recipes:', errors);
                setRecipe('');
                setCalories(null);
                setRating(null);
                setRatingSubmitted(false);
                return;
            }

            if (existingRecipeData && existingRecipeData.length > 0) {
                const existingRecipe = existingRecipeData[0];
                setRecipe(existingRecipe.recipe ?? '');
                setCalories(existingRecipe.calories ?? null);
                setRating(existingRecipe.rating ?? null);
            } else {
                const basePrompt = `Provide a healthy recipe for ${dishName} with ${cuisine} cuisine.`;
                const customPrompt = getCustomizedPrompt(basePrompt);

                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-4',
                    messages: [
                        { role: 'user', content: customPrompt }
                    ],
                    max_tokens: 1000,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    },
                });
                const fetchedRecipe = response.data.choices[0].message.content.trim();
                const estimatedCalories = await getEstimatedCalories(fetchedRecipe);
                setRecipe(fetchedRecipe);
                setCalories(estimatedCalories);
                setRating(0);
                await client.models.Dish.create({
                    id: uuidv4(),
                    dishName: dishName,
                    recipe: fetchedRecipe,
                    rating: 0,
                    ratingCount: 0,
                    calories: estimatedCalories,
                });
            }
            setRatingSubmitted(false);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    };

    const fetchRecipeByIngredients = async (ingredients: string, cuisine: string) => {
        console.log('Ingredients:', ingredients, 'Cuisine:', cuisine);
        try {
            const basePrompt = `Provide a healthy recipe with these ingredients: ${ingredients}, with ${cuisine} cuisine.`;
            const customPrompt = getCustomizedPrompt(basePrompt);

            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
                    messages: [{ role: 'user', content: customPrompt }],
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

            if (existingRecipeData && existingRecipeData.length > 0) {
                const existingRecipe = existingRecipeData[0];
                if (existingRecipe.calories != null && estimatedCalories < existingRecipe.calories) {
                    setRecipe(fetchedRecipe);
                    setCalories(estimatedCalories);
                    setRating(existingRecipe.rating ?? null);
                    await client.models.Dish.update({
                        id: existingRecipe.id,
                        recipe: fetchedRecipe,
                        calories: estimatedCalories,
                    });
                } else {
                    setRecipe(existingRecipe.recipe ?? '');
                    setCalories(existingRecipe.calories ?? null);
                    setRating(existingRecipe.rating ?? null);
                }
            } else {
                setRecipe(fetchedRecipe);
                setCalories(estimatedCalories);
                await client.models.Dish.create({
                    id: uuidv4(),
                    dishName: suggestedDishName,
                    recipe: fetchedRecipe,
                    rating: 0,
                    ratingCount: 0,
                    calories: estimatedCalories,
                });
            }
            setRatingSubmitted(false);
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

    const fetchRecipeByImage = async (imageUri: string, cuisine: string) => {
        try {
            const basePrompt = `Provide a healthy recipe with the ingredients shown in this image, with ${cuisine} cuisine.`;
            const customPrompt = getCustomizedPrompt(basePrompt);

            const base64Image = await convertImageToBase64(imageUri);
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: customPrompt,
                        additional_images: [`data:image/jpeg;base64,${base64Image}`],
                    }
                ],
                max_tokens: 1000,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
            });
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

            if (existingRecipeData && existingRecipeData.length > 0) {
                const existingRecipe = existingRecipeData[0];
                if (existingRecipe.calories != null && estimatedCalories < existingRecipe.calories) {
                    setRecipe(fetchedRecipe);
                    setCalories(estimatedCalories);
                    setRating(existingRecipe.rating ?? null);
                    await client.models.Dish.update({
                        id: existingRecipe.id,
                        recipe: fetchedRecipe,
                        calories: estimatedCalories,
                    });
                } else {
                    setRecipe(existingRecipe.recipe ?? '');
                    setCalories(existingRecipe.calories ?? null);
                    setRating(existingRecipe.rating ?? null);
                }
            } else {
                setRecipe(fetchedRecipe);
                setCalories(estimatedCalories);
                await client.models.Dish.create({
                    id: uuidv4(),
                    dishName: suggestedDishName,
                    recipe: fetchedRecipe,
                    rating: 0,
                    ratingCount: 0,
                    calories: estimatedCalories,
                });
            }
            setRatingSubmitted(false);
        } catch (error) {
            console.error('Error fetching recipe by image:', error);
        }
    };

    const getEstimatedCalories = async (recipe: string): Promise<number> => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
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
            const messageContent = response.data.choices[0].message.content.trim();
            const estimatedCalories = parseFloat(messageContent.match(/(\d+(\.\d+)?)/)?.[0] || '0');
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
                    model: 'gpt-4',
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

    const handleRatingCompleted = (rating: number) => {
        setUserRating(rating);
    };

    const submitRating = async () => {
        if (!userRating || !dishName) return;
        try {
            const { errors, data: existingRecipeData } = await client.models.Dish.list({
                filter: { dishName: { eq: dishName } }
            });
            if (errors) {
                console.error('Error fetching recipes:', errors);
                return;
            }

            if (existingRecipeData && existingRecipeData.length > 0) {
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
                setRatingSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleBuyIngredients = () => {
        console.log("Redirecting to buy ingredients");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <RecipeInput
                    fetchRecipe={fetchRecipe}
                    setDishName={setDishName}
                    setIngredients={setIngredients}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    recipe ? (
                        <View style={styles.recipeContainer}>
                            <View style={styles.recipeHeader}>
                                <Text style={styles.title}>{dishName || 'Generated Recipe'}</Text>
                                <TouchableOpacity
                                    style={styles.expandButton}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Ionicons name="expand" size={24} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.caloriesText}>Estimated Calories: {calories ? calories : 'N/A'}</Text>
                                <Text style={styles.ratingText}>Average User Rating: {rating ? rating.toFixed(1) : 'Not rated yet'}</Text>
                                <Text style={styles.disclaimer}>Disclaimer: This recipe was generated by GPT-4 and has yet to be vetted by nutritionists.</Text>
                            </View>
                            <Modal visible={modalVisible} transparent animationType="slide">
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContentContainer}>
                                        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
                                            <Text style={styles.modalTitle}>{dishName || 'Generated Recipe'}</Text>
                                            <Text style={styles.modalText}>{recipe}</Text>
                                            <Text style={styles.caloriesText}>Estimated Calories: {calories ? calories : 'N/A'}</Text>
                                            <Text style={styles.ratingText}>Average User Rating: {rating ? rating.toFixed(1) : 'Not rated yet'}</Text>
                                            <Rating
                                                type='star'
                                                ratingCount={5}
                                                imageSize={40}
                                                showRating
                                                onFinishRating={handleRatingCompleted}
                                                style={styles.rating}
                                            />
                                            <View style={styles.buttonContainer}>
                                                {!ratingSubmitted && (
                                                    <TouchableOpacity style={styles.submitButton} onPress={() => {
                                                        submitRating();
                                                        setRatingSubmitted(true);
                                                    }}>
                                                        <Text style={styles.submitButtonText}>Rate the recipe!</Text>
                                                    </TouchableOpacity>
                                                )}
                                                <TouchableOpacity style={styles.submitButton} onPress={handleBuyIngredients}>
                                                    <Text style={styles.submitButtonText}>Buy Ingredients</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.closeButton}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Ionicons name="close" size={30} color="#000" />
                                            </TouchableOpacity>
                                        </ScrollView>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    ) : null
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RecipeFinder;

async function convertImageToBase64(imageUri: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function () {
            reject(new Error('Failed to convert image to base64'));
        };
        xhr.open('GET', imageUri);
        xhr.responseType = 'blob';
        xhr.send();
    });
}
