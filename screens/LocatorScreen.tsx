import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { styles } from '../styles/styles';
import SignOutButton from './SignOutButton';
import { useAuthenticator } from '@aws-amplify/ui-react-native';


const LocatorScreen: React.FC = () => {
    const { user } = useAuthenticator();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{user?.signInDetails?.loginId?.split('@')[0]}</Text>
                <SignOutButton />
            </View>
            <View style={styles.centerContent}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
        </SafeAreaView>
    );
};

export default LocatorScreen;
