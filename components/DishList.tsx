import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { styles } from '../styles/styles';
import RecipeFinder from './RecipeFinder';

const DishList: React.FC = () => {
    return (
        <SafeAreaView style={styles.recipeContainer}>
            <Text style={styles.title}>AI Recipe Finder</Text>
            <RecipeFinder />
        </SafeAreaView>
    );
};

export default DishList;
