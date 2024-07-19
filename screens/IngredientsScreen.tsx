import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View, Text, FlatList, TextInput } from 'react-native';
import { styles } from '../styles/styles';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

interface Ingredient {
    brandAndProductName: string;
    packageSize: string;
}

const client = generateClient<Schema>();

const IngredientsScreen: React.FC = () => {
    const { user } = useAuthenticator();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            setLoading(true);
            try {
                const { data: allIngredients, errors } = await client.models.Ingredients.list();
                if (errors) {
                    console.error('Errors fetching ingredients:', errors);
                    return;
                }

                setIngredients(allIngredients as Ingredient[]);
                setFilteredIngredients(allIngredients as Ingredient[]);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = ingredients.filter(ingredient =>
                ingredient.brandAndProductName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredIngredients(filtered);
        } else {
            setFilteredIngredients(ingredients);
        }
    }, [searchQuery, ingredients]);

    const renderItem = ({ item }: { item: Ingredient }) => (
        <View style={styles.ingredientItem}>
            <Text style={styles.ingredientName}>{item.brandAndProductName}</Text>
            <Text style={styles.ingredientSize}>{item.packageSize}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search ingredients..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <View style={styles.listHeader}>
                <Text style={styles.headerText}>Ingredients</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredIngredients}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.ingredientList}
                />
            )}
        </SafeAreaView>
    );
};

export default IngredientsScreen;
