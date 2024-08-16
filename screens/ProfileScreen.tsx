import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, Alert, Modal, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import ProgressBar from 'react-native-progress/Bar';
import { v4 as uuidv4 } from 'uuid';
import { styles } from './ProfileScreenStyles';

const client = generateClient<Schema>();

const generateReferralCode = () => {
    return uuidv4().slice(0, 8); // Generate an 8-character referral code
};

const ProfileScreen: React.FC = () => {
    const { user } = useAuthenticator();
    const [profile, setProfile] = useState<any>({});
    const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [referralCodeInput, setReferralCodeInput] = useState<string>('');
    const [isReferralModalVisible, setReferralModalVisible] = useState<boolean>(false);
    const [tempProfile, setTempProfile] = useState<any>({}); // Temporary profile state for edits

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
                    setTempProfile(fetchedProfile);

                    // Check for an existing referral code
                    if (!fetchedProfile.referralCode) {
                        const updatedProfile = { ...fetchedProfile, referralCode: generateReferralCode() };
                        await client.models.Profile.update(updatedProfile);
                        setProfile(updatedProfile);
                        setTempProfile(updatedProfile);
                    }
                } else {
                    // If no profile is found, create a new one with a referral code
                    const newProfile = {
                        id: uuidv4(),
                        userId: user?.signInDetails?.loginId,
                        referralCode: generateReferralCode(),
                        points: 0,
                        redeemed: false,
                    };
                    await client.models.Profile.create(newProfile);
                    setProfile(newProfile);
                    setTempProfile(newProfile);
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
        const { age, weight, height, targetWeight } = tempProfile;
        if (!age || !weight || !height || (tempProfile.healthGoal && !targetWeight)) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            const updatedProfile = {
                ...tempProfile,
                userId: user?.signInDetails?.loginId,
                bmi: weight && height ? weight / ((height / 100) * (height / 100)) : null,
                chronicDisease: chronicDiseases.join(','), // Save as a comma-separated string
            };

            if (profile.id) {
                await client.models.Profile.update(updatedProfile);
            } else {
                updatedProfile.id = uuidv4();
                updatedProfile.points = 0;
                updatedProfile.referralCode = generateReferralCode();
                updatedProfile.redeemed = false;
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

    const handleInputChange = useCallback((key: string, value: any) => {
        setTempProfile((prevProfile: any) => ({ ...prevProfile, [key]: value }));
    }, []);

    const getValue = (value: any) => {
        return value == null || isNaN(value) ? '' : value.toString();
    };

    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return { text: "Low", style: styles.bmiLow };
        if (bmi >= 18.5 && bmi < 22.9) return { text: "Normal", style: styles.bmiNormal };
        return { text: "High", style: styles.bmiHigh };
    };

    const handleRedeemReferral = async () => {
        if (!referralCodeInput) {
            Alert.alert('Error', 'Please enter a referral code.');
            return;
        }

        if (profile.redeemed) {
            Alert.alert('Error', 'You have already redeemed a referral code.');
            return;
        }

        if (referralCodeInput === profile.referralCode) {
            Alert.alert('Error', 'You cannot redeem your own referral code.');
            return;
        }

        try {
            const { data: refereeProfileData, errors } = await client.models.Profile.list({
                filter: { referralCode: { eq: referralCodeInput } },
            });

            if (errors || refereeProfileData.length === 0) {
                Alert.alert('Error', 'Invalid referral code.');
                return;
            }

            const refereeProfile = refereeProfileData[0];
            refereeProfile.points = (refereeProfile.points || 0) + 10;
            const updatedProfile = { ...profile, points: (profile.points || 0) + 10, redeemed: true };

            await client.models.Profile.update(refereeProfile);
            await client.models.Profile.update(updatedProfile);

            setProfile(updatedProfile);
            Alert.alert('Success', 'Referral code redeemed successfully.');
            setReferralModalVisible(false); // Close the modal
        } catch (error) {
            console.error('Error redeeming referral code:', error);
            Alert.alert('Error', 'Error redeeming referral code. Please try again.');
        }
    };

    const openReferralModal = () => {
        setReferralModalVisible(true);
    };

    const closeReferralModal = () => {
        setReferralModalVisible(false);
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
                : `Almost there! ${(profile.weight - profile.targetWeight).toFixed(1)} kg to target `;
        } else if (profile.healthGoal === 'gain_weight') {
            progress = profile.weight < profile.targetWeight ? profile.weight / profile.targetWeight : 1;
            progressDescription = profile.weight >= profile.targetWeight
                ? "Target achieved!"
                : `Need to gain ${(profile.targetWeight - profile.weight).toFixed(1)} kg`;
        }
    }

    const profileData = [
        { key: 'Age', value: profile.age || 'N/A' },
        { key: 'Weight (kg)', value: profile.weight || 'N/A' },
        { key: 'Height (cm)', value: profile.height || 'N/A' },
        { key: 'Target Weight', value: profile.targetWeight || 'N/A' },
        {
            key: 'BMI',
            value: profile.bmi ? profile.bmi.toFixed(2) : 'N/A',
            category: bmiCategory ? bmiCategory.text : '',
            categoryStyle: bmiCategory ? bmiCategory.style : null
        },
        { key: 'Points', value: profile.points || 0 },
        { key: 'Your Referral Code', value: profile.referralCode || 'N/A' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Image source={require('../assets/mascot2.png')} style={styles.profileLogo} />
                    <View style={styles.profileContainer}>
                        <Text style={styles.welcomeText}>Welcome, {user?.signInDetails?.loginId?.split('@')[0]}</Text>
                        {editMode ? (
                            <>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Age</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Age"
                                        keyboardType="numeric"
                                        value={getValue(tempProfile.age)}
                                        onChangeText={(text) => handleInputChange('age', parseInt(text))}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Weight (kg)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Weight (kg)"
                                        keyboardType="numeric"
                                        value={getValue(tempProfile.weight)}
                                        onChangeText={(text) => handleInputChange('weight', parseFloat(text))}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Height (cm)</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Height (cm)"
                                        keyboardType="numeric"
                                        value={getValue(tempProfile.height)}
                                        onChangeText={(text) => handleInputChange('height', parseFloat(text))}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Health Goals</Text>
                                    <Picker
                                        selectedValue={tempProfile.healthGoal}
                                        style={styles.input}
                                        onValueChange={(itemValue) => handleInputChange('healthGoal', itemValue)}
                                    >
                                        <Picker.Item label="None" value="none" />
                                        <Picker.Item label="Lose Weight" value="lose_weight" />
                                        <Picker.Item label="Gain Weight" value="gain_weight" />
                                    </Picker>
                                </View>
                                {tempProfile.healthGoal && tempProfile.healthGoal !== 'none' && (
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Target Weight (kg)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Target Weight (kg)"
                                            keyboardType="numeric"
                                            value={getValue(tempProfile.targetWeight)}
                                            onChangeText={(text) => handleInputChange('targetWeight', parseFloat(text))}
                                        />
                                    </View>
                                )}
                                <View style={styles.separator} />
                                <View style={styles.inputContainer}>
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
                                </View>
                                <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {profileData.map((item) => (
                                    <View key={item.key} style={styles.profileItem}>
                                        <Text style={styles.profileLabel}>{item.key}:</Text>
                                        <Text style={styles.profileValue}>{item.value} {item.category ? <Text style={item.categoryStyle}>({item.category})</Text> : null}</Text>
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
                                <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                                    <Text style={styles.buttonText}>Edit Profile</Text>
                                </TouchableOpacity>
                                {!profile.redeemed && (
                                    <TouchableOpacity style={styles.editButton} onPress={openReferralModal}>
                                        <Text style={styles.buttonText}>Redeem Referral Code Points</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Referral Code Modal */}
            <Modal
                visible={isReferralModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeReferralModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter the referral code of the user who recommended you this app!</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Referral Code"
                            value={referralCodeInput}
                            onChangeText={setReferralCodeInput}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.button} onPress={handleRedeemReferral}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closeReferralModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfileScreen;
