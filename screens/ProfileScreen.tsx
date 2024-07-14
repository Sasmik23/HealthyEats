import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import ProgressBar from 'react-native-progress/Bar';
import { styles } from '../styles/styles';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient<Schema>();

const ProfileScreen: React.FC = () => {
    const { user } = useAuthenticator();
    const [profile, setProfile] = useState<any>({});
    const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const chronicDiseasesList = [
        { id: 'htn', name: 'Hypertension (HTN)' },
        { id: 'hld', name: 'Hyperlipidemia (HLD)' },
        { id: 'dm', name: 'Diabetes Mellitus (DM)' },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: profileData, errors } = await client.models.Profile.list({
                    filter: { userId: { eq: user?.signInDetails?.loginId } },
                });
                if (errors) {
                    console.error('Error fetching profile:', errors);
                } else if (profileData.length > 0) {
                    const fetchedProfile = profileData[0];
                    setProfile(fetchedProfile);
                    setChronicDiseases(fetchedProfile.chronicDisease ? fetchedProfile.chronicDisease.split(',') : []);
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
                chronicDisease: chronicDiseases.join(','), // Save as a comma-separated string
            };

            console.log('Updated Profile:', updatedProfile);

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
            Alert.alert('Error', 'Error saving profile. Please try again.');
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

    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return { text: "Low", style: styles.bmiLow };
        if (bmi >= 18.5 && bmi < 22.9) return { text: "Normal", style: styles.bmiNormal };
        return { text: "High", style: styles.bmiHigh };
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    const bmiCategory = profile.bmi ? getBmiCategory(profile.bmi) : null;
    let progress = 0;
    let progressDescription = '';

    if (profile.healthGoal && profile.targetWeight) {
        if (profile.healthGoal === 'lose_weight') {
            progress = profile.weight > profile.targetWeight ? profile.targetWeight / profile.weight : 1;
            progressDescription = profile.weight <= profile.targetWeight
                ? "Target achieved!"
                : `Need to lose ${(profile.weight - profile.targetWeight).toFixed(1)} kg`;
        } else if (profile.healthGoal === 'gain_weight') {
            progress = profile.weight < profile.targetWeight ? profile.weight / profile.targetWeight : 1;
            progressDescription = profile.weight >= profile.targetWeight
                ? "Target achieved!"
                : `Need to gain ${(profile.targetWeight - profile.weight).toFixed(1)} kg`;
        }
    }

    const profileData = [
        { key: 'Age', value: profile.age || 'N/A' },
        { key: 'Weight', value: profile.weight || 'N/A' },
        { key: 'Height', value: profile.height || 'N/A' },
        { key: 'Target Weight', value: profile.targetWeight || 'N/A' },
        {
            key: 'BMI',
            value: profile.bmi ? profile.bmi.toFixed(2) : 'N/A',
            category: bmiCategory ? bmiCategory.text : '',
            categoryStyle: bmiCategory ? bmiCategory.style : null
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={profileData}
                keyExtractor={(item) => item.key}
                ListHeaderComponent={() => (
                    <>
                        <Image source={require('../assets/logo.png')} style={styles.profileLogo} />
                        <View style={styles.profileContainer}>
                            <Text style={styles.welcomeText}>Welcome, {user?.signInDetails?.loginId?.split('@')[0]}</Text>
                            {editMode ? (
                                <>
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
                                    <Text style={styles.label}>Chronic Diseases</Text>
                                    <MultiSelect
                                        items={chronicDiseasesList}
                                        uniqueKey="id"
                                        onSelectedItemsChange={(selectedItems) => setChronicDiseases(selectedItems)}
                                        selectedItems={chronicDiseases}
                                        selectText="Select Diseases"
                                        searchInputPlaceholderText="Search Diseases..."
                                        tagRemoveIconColor="#CCC"
                                        tagBorderColor="#CCC"
                                        tagTextColor="#333"
                                        selectedItemTextColor="#4CAF50"
                                        selectedItemIconColor="#4CAF50"
                                        itemTextColor="#000"
                                        displayKey="name"
                                        searchInputStyle={{ color: '#CCC' }}
                                        submitButtonColor="#4CAF50"
                                        submitButtonText="Submit"
                                    />
                                    <Text style={styles.label}>Health Goals</Text>
                                    <Picker
                                        selectedValue={profile.healthGoal}
                                        style={styles.input}
                                        onValueChange={(itemValue) => handleInputChange('healthGoal', itemValue)}
                                    >
                                        <Picker.Item label="None" value="none" />
                                        <Picker.Item label="Lose Weight" value="lose_weight" />
                                        <Picker.Item label="Gain Weight" value="gain_weight" />
                                    </Picker>
                                    {profile.healthGoal && profile.healthGoal !== 'none' && (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Target Weight (kg)"
                                            keyboardType="numeric"
                                            value={getValue(profile.targetWeight)}
                                            onChangeText={(text) => handleInputChange('targetWeight', parseFloat(text))}
                                        />
                                    )}
                                    <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    {profileData.map((item) => (
                                        <View key={item.key}>
                                            <Text style={styles.profileText}>{item.key}: {item.value} {item.category ? <Text style={item.categoryStyle}>({item.category})</Text> : null}</Text>
                                        </View>
                                    ))}
                                    {profile.healthGoal && profile.targetWeight && (
                                        <View style={styles.progressBarContainer}>
                                            <Text style={styles.profileText}>
                                                {progressDescription}
                                            </Text>
                                            <ProgressBar progress={progress} width={200} color="#4CAF50" />
                                        </View>
                                    )}
                                    <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
                                        <Text style={styles.buttonText}>Edit Profile</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </>
                )}
                renderItem={({ item }) => null} // Avoid repeating items
                ListFooterComponent={() => (
                    editMode && profile.healthGoal && profile.targetWeight && (
                        <View style={styles.progressBarContainer}>
                            <Text style={styles.profileText}>
                                {progressDescription}
                            </Text>
                            <ProgressBar progress={progress} width={200} color="#4CAF50" />
                        </View>
                    )
                )}
            />
        </SafeAreaView>
    );
};

export default ProfileScreen;
