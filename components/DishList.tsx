import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import RecipeFinder from './RecipeFinder';

const DishList: React.FC = () => {
    const [searchByDish, setSearchByDish] = React.useState<boolean>(true);

    return (
        <SafeAreaView style={styles.recipeContainer}>
            <Text style={styles.title}>AI Recipe Finder</Text>

            <View style={styles.toggleButtons}>
                <TouchableOpacity
                    style={[styles.toggleButton, searchByDish && styles.activeToggleButton]}
                    onPress={() => setSearchByDish(true)}
                >
                    <Text style={styles.toggleButtonText}>Dish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !searchByDish && styles.activeToggleButton]}
                    onPress={() => setSearchByDish(false)}
                >
                    <Text style={styles.toggleButtonText}>Ingredients</Text>
                </TouchableOpacity>
            </View>

            <RecipeFinder searchByDish={searchByDish} />
        </SafeAreaView>
    );
};

export default DishList;
