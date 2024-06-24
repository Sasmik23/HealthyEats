import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { styles } from '../styles/styles';
import RecipeFinder from './RecipeFinder';

const DishList: React.FC = () => {
    const [searchByDish, setSearchByDish] = React.useState<boolean>(true);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Recipe Finder</Text>
            <View style={styles.toggleButtons}>
                <TouchableOpacity
                    style={[styles.toggleButton, searchByDish && styles.activeToggleButton]}
                    onPress={() => setSearchByDish(true)}
                >
                    <Text style={styles.toggleButtonText}>Search by Dish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !searchByDish && styles.activeToggleButton]}
                    onPress={() => setSearchByDish(false)}
                >
                    <Text style={styles.toggleButtonText}>Search by Ingredients</Text>
                </TouchableOpacity>
            </View>
            <RecipeFinder searchByDish={searchByDish} />
        </SafeAreaView>
    );
};

export default DishList;
