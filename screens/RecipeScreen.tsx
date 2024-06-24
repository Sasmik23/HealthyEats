import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { styles } from '../styles/styles';
import SignOutButton from './SignOutButton';
import DishList from '../components/DishList';
import { useAuthenticator } from '@aws-amplify/ui-react-native';


const RecipeScreen: React.FC = () => {
    const { user } = useAuthenticator();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{user?.signInDetails?.loginId?.split('@')[0]}</Text>
                <SignOutButton />
            </View>
            <DishList />
        </SafeAreaView>
    );
};

export default RecipeScreen;
