import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { styles } from '../styles/styles';
import { Picker } from '@react-native-picker/picker';

interface RecipeInputProps {
    fetchRecipe: (cuisine: string, dishName: string, ingredients: string, imageUri: string | null) => void;
    setDishName: React.Dispatch<React.SetStateAction<string>>;
    setIngredients: React.Dispatch<React.SetStateAction<string>>;
}

const RecipeInput: React.FC<RecipeInputProps> = ({ fetchRecipe, setDishName, setIngredients }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [queryType, setQueryType] = useState<'dish' | 'ingredients'>('dish');
    const [cuisine, setCuisine] = useState<string>('None');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('');

    const textInputRef = useRef<TextInput>(null);

    const handleFocus = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const handleImagePicker = (launchFunction: (options: any) => Promise<any>) => {
        launchFunction({
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
        }).then((response) => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri ?? null);
            }
        });
    };

    useEffect(() => {
        if (isModalVisible && textInputRef.current) {
            textInputRef.current.focus();
        }
    }, [isModalVisible]);

    const handleSubmit = () => {
        if (queryType === 'dish') {
            setDishName(inputValue);
            setIngredients('');
            fetchRecipe(cuisine, inputValue, '', imageUri);
        } else {
            setIngredients(inputValue);
            setDishName('');
            fetchRecipe(cuisine, '', inputValue, imageUri);
        }
        handleClose();
    };

    return (
        <>
            <TouchableOpacity onPress={handleFocus}>
                <TextInput
                    style={styles.input}
                    placeholder={queryType === 'dish' ? "Enter dish name" : "Enter ingredients (comma separated)"}
                    placeholderTextColor="#888"
                    value={inputValue}
                    editable={false}
                />
            </TouchableOpacity>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
            >
                <KeyboardAvoidingView
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={[styles.modalContainer, { width: '90%', padding: 20 }]}>
                        <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
                            <Ionicons name="close" size={30} color="#000" />
                        </TouchableOpacity>
                        <Picker
                            selectedValue={queryType}
                            style={styles.input}
                            onValueChange={(itemValue) => setQueryType(itemValue as 'dish' | 'ingredients')}
                        >
                            <Picker.Item label="Dish" value="dish" />
                            <Picker.Item label="Ingredients" value="ingredients" />
                        </Picker>
                        <TextInput
                            ref={textInputRef}
                            style={styles.input}
                            placeholder={queryType === 'dish' ? "Enter dish name" : "Enter ingredients (comma separated)"}
                            placeholderTextColor="#888"
                            value={inputValue}
                            onChangeText={setInputValue}
                            autoFocus={true}
                        />
                        {queryType === 'ingredients' && (
                            <>
                                <TouchableOpacity
                                    style={[styles.imagePickerButton, imageUri ? styles.activeImagePickerButton : null]}
                                    onPress={() => handleImagePicker(launchCamera)}
                                >
                                    <Text style={styles.buttonText}>Take a Photo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.imagePickerButton, imageUri ? styles.activeImagePickerButton : null]}
                                    onPress={() => handleImagePicker(launchImageLibrary)}
                                >
                                    <Text style={styles.buttonText}>Choose from Gallery</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <Picker
                            selectedValue={cuisine}
                            style={styles.input}
                            onValueChange={(itemValue) => setCuisine(itemValue)}
                        >
                            <Picker.Item label="None" value="None" />
                            <Picker.Item label="Indian" value="Indian" />
                            <Picker.Item label="Chinese" value="Chinese" />
                            <Picker.Item label="Western" value="Western" />
                        </Picker>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Get Recipe</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
};

export default RecipeInput;
