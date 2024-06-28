import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/styles';

interface RecipeInputProps {
    searchByDish: boolean;
    dishName: string;
    setDishName: React.Dispatch<React.SetStateAction<string>>;
    ingredients: string;
    setIngredients: React.Dispatch<React.SetStateAction<string>>;
    fetchRecipe: () => void;
}

const RecipeInput: React.FC<RecipeInputProps> = ({
    searchByDish,
    dishName,
    setDishName,
    ingredients,
    setIngredients,
    fetchRecipe,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleFocus = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity onPress={handleFocus}>
                <TextInput
                    style={styles.input}
                    placeholder={searchByDish ? "Enter dish name" : "Enter ingredients (comma separated)"}
                    placeholderTextColor="#888"
                    value={searchByDish ? dishName : ingredients}
                    editable={false}
                />
            </TouchableOpacity>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
            >
                <KeyboardAvoidingView
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={[styles.modalContainer, { width: '90%', padding: 20 }]}>
                        <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
                            <Ionicons name="close" size={30} color="#000" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder={searchByDish ? "Enter dish name" : "Enter ingredients (comma separated)"}
                            placeholderTextColor="#888"
                            value={searchByDish ? dishName : ingredients}
                            onChangeText={searchByDish ? setDishName : setIngredients}
                            autoFocus={true}
                        />
                        <TouchableOpacity style={styles.button} onPress={() => { fetchRecipe(); handleClose(); }}>
                            <Text style={styles.buttonText}>Get Recipe</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

export default RecipeInput;
