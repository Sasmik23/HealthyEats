import React from 'react';
import { View, TextInput, Button } from 'react-native';
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
    return (
        <View>
            {searchByDish ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter dish name"
                        placeholderTextColor="#888"
                        value={dishName}
                        onChangeText={setDishName}
                    />
                    <Button title="Get Recipe" onPress={fetchRecipe} />
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter ingredients (comma separated)"
                        placeholderTextColor="#888"
                        value={ingredients}
                        onChangeText={setIngredients}
                    />
                    <Button title="Get Recipe" onPress={fetchRecipe} />
                </>
            )}
        </View>
    );
};

export default RecipeInput;
