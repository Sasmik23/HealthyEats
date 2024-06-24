import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ScrollView, Image } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { styles } from '../styles/styles';
import SignOutButton from './SignOutButton';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient<Schema>();

const ProfileScreen: React.FC = () => {
    const { user } = useAuthenticator();
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: profileData, errors } = await client.models.Profile.list({
                    filter: { userId: { eq: user?.signInDetails?.loginId } },
                });
                if (errors) {
                    console.error('Error fetching profile:', errors);
                } else if (profileData.length > 0) {
                    setProfile(profileData[0]);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const updatedProfile = {
                ...profile,
                userId: user?.signInDetails?.loginId,
                bmi: profile.weight && profile.height ? profile.weight / ((profile.height / 100) * (profile.height / 100)) : null,
            };

            if (profile.id) {
                await client.models.Profile.update(updatedProfile);
            } else {
                updatedProfile.id = uuidv4();
                await client.models.Profile.create(updatedProfile);
            }

            setProfile(updatedProfile);
            setEditMode(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setProfile((prevProfile: any) => {
            const updatedProfile = { ...prevProfile, [key]: value };
            if (key === 'weight' || key === 'height') {
                const weight = key === 'weight' ? value : prevProfile.weight;
                const height = key === 'height' ? value : prevProfile.height;
                if (weight && height) {
                    updatedProfile.bmi = weight / ((height / 100) * (height / 100)); // Convert height to meters
                }
            }
            return updatedProfile;
        });
    };

    const getValue = (value: any) => {
        return value == null || isNaN(value) ? '' : value.toString();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>{user?.signInDetails?.loginId?.split('@')[0]}</Text>
                <SignOutButton />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={require('../assets/logo.png')} style={styles.profileLogo} />
                <View style={styles.profileContainer}>
                    <Text style={styles.welcomeText}>Welcome, {user?.signInDetails?.loginId?.split('@')[0]}</Text>
                    {editMode ? (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={profile.name ?? ''}
                                onChangeText={(text) => handleInputChange('name', text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Age"
                                keyboardType="numeric"
                                value={getValue(profile.age)}
                                onChangeText={(text) => handleInputChange('age', parseInt(text))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Weight (kg)"
                                keyboardType="numeric"
                                value={getValue(profile.weight)}
                                onChangeText={(text) => handleInputChange('weight', parseFloat(text))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Height (cm)"
                                keyboardType="numeric"
                                value={getValue(profile.height)}
                                onChangeText={(text) => handleInputChange('height', parseFloat(text))}
                            />
                            <Button title="Save" onPress={handleSaveProfile} />
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.profileText}>Name: {profile.name || 'N/A'}</Text>
                            <Text style={styles.profileText}>Age: {profile.age || 'N/A'}</Text>
                            <Text style={styles.profileText}>Weight: {profile.weight || 'N/A'}</Text>
                            <Text style={styles.profileText}>Height: {profile.height || 'N/A'}</Text>
                            <Text style={styles.profileText}>BMI: {profile.bmi ? profile.bmi.toFixed(2) : 'N/A'}</Text>
                            <Button title="Edit Profile" onPress={() => setEditMode(true)} />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
