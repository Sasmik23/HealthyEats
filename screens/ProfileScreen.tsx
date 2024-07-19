import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, Alert, FlatList, StyleSheet } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import ProgressBar from 'react-native-progress/Bar';
import { v4 as uuidv4 } from 'uuid';

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
                    if (!fetchedProfile.referralCode) {
                        const updatedProfile = { ...fetchedProfile, referralCode: generateReferralCode() };
                        await client.models.Profile.update(updatedProfile);
                        setProfile(updatedProfile);
                    }
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
        } catch (error) {
            console.error('Error redeeming referral code:', error);
            Alert.alert('Error', 'Error redeeming referral code. Please try again.');
        }
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
        },
        { key: 'Points', value: profile.points || 0 },
        { key: 'Referral Code', value: profile.referralCode || 'N/A' },
        { key: 'Redeemed', value: profile.redeemed ? 'Yes' : 'No' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={profileData}
                keyExtractor={(item) => item.key}
                ListHeaderComponent={() => (
                    <>
                        <Image source={require('../assets/mascot2.png')} style={styles.profileLogo} />
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
                                        <View style={styles.referralContainer}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter referral code"
                                                value={referralCodeInput}
                                                onChangeText={setReferralCodeInput}
                                            />
                                            <TouchableOpacity style={styles.redeemButton} onPress={handleRedeemReferral}>
                                                <Text style={styles.buttonText}>Redeem Referral Points</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F5E1',
    },
    profileLogo: {
        width: 100,
        height: 150,
        alignSelf: 'center',
    },
    profileContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4CAF50',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#4CAF50',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    redeemButton: {
        backgroundColor: '#A5D6A7',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    referralContainer: {
        marginVertical: 20,
    },
    profileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    profileLabel: {
        fontWeight: 'bold',
        color: '#4CAF50',
        fontSize: 20,

    },
    profileValue: {
        color: '#333',
        fontSize: 20,

    },
    profileText: {
        fontSize: 18,
        color: '#333',
        marginVertical: 5,
    },
    progressBarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    bmiLow: {
        color: '#FFA726',
    },
    bmiNormal: {
        color: '#66BB6A',
    },
    bmiHigh: {
        color: '#EF5350',
    },
});
