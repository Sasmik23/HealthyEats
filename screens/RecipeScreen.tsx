import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { styles } from '../styles/styles';
import DishList from '../components/DishList'; // Import the DishList component

// Assuming these are your nullable types
type Nullable<T> = T | null;

interface Dish {
    id: Nullable<string>;
    dishName: Nullable<string>;
    recipe: Nullable<string>;
    rating: Nullable<number>;
    ratingCount: Nullable<number>;
    calories: Nullable<number>;
    createdAt: string;
    updatedAt: string;
}

const RecipeScreen: React.FC = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDishList, setShowDishList] = useState(true);
    const client = generateClient<Schema>();

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            const { data: dishesData, errors } = await client.models.Dish.list();
            if (errors) {
                console.error('Error fetching dishes:', errors);
                return;
            }
            if (dishesData) {
                setDishes(dishesData);
            }
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const handleRecipeClick = async (dish: Dish) => {
        try {
            const { data: selectedDishData, errors } = await client.models.Dish.get({
                id: dish.id,
            });
            if (errors) {
                console.error('Error fetching dish details:', errors);
                return;
            }
            if (selectedDishData) {
                setSelectedDish(selectedDishData);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching dish details:', error);
        }
    };

    const closeModal = () => {
        setSelectedDish(null);
        setShowModal(false);
        fetchDishes(); // Refresh the list of dishes after closing the modal
    };

    const toggleView = () => {
        setShowDishList((prev) => !prev);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
                    <Text style={styles.toggleButtonText}>
                        {showDishList ? 'Show Existing Recipes' : 'Ask For Recipe'}
                    </Text>
                </TouchableOpacity>
            </View>
            {showDishList ? (
                <DishList />
            ) : (
                <ScrollView contentContainerStyle={styles.recipeScrollContainer}>
                    {dishes.map((dish) => (
                        <TouchableOpacity
                            key={dish.id}
                            onPress={() => handleRecipeClick(dish)}
                            style={styles.recipeItem}
                        >
                            <Text style={styles.recipeItemText}>{dish.dishName}</Text>
                            <Text style={styles.recipeItemRating}>Rating: {dish.rating}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContentContainer}>
                        <ScrollView contentContainerStyle={styles.modalScrollContainer}>
                            <Text style={styles.modalTitle}>{selectedDish?.dishName}</Text>
                            <Text style={styles.modalText}>Recipe: {selectedDish?.recipe}</Text>
                            <Text style={styles.modalText}>Calories: {selectedDish?.calories}</Text>
                            <Text style={styles.modalText}>User Rating: {selectedDish?.rating}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default RecipeScreen;
