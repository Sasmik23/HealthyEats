import React from 'react';
import { Button, View } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { styles } from '../styles/styles';

const SignOutButton: React.FC = () => {
    const { signOut } = useAuthenticator();

    return (
        <View style={styles.signOutButton}>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    );
};

export default SignOutButton;
