import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, ListRenderItem, Image } from 'react-native';
import { styles } from '../styles/styles';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import Modal from 'react-native-modal';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from "aws-amplify/data";
import haversine from 'haversine-distance';
import { Picker } from '@react-native-picker/picker';

interface HealthyEateryWithDistance {
    id: string;
    name: string;
    addressBlockHouseNumber: string;
    addressBuildingName: string;
    addressPostalCode: string;
    addressStreetName: string;
    addressType: string;
    description: string;
    addressFloorNumber: string;
    addressUnitNumber: string;
    coordinates: string;
    distance?: number;
}

const client = generateClient<Schema>();

const LocatorScreen: React.FC = () => {
    const { user } = useAuthenticator();
    const [location, setLocation] = useState<GeoPosition['coords'] | null>(null);
    const [restaurants, setRestaurants] = useState<HealthyEateryWithDistance[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<HealthyEateryWithDistance | null>(null);
    const [maxDistance, setMaxDistance] = useState<string>('10000'); // Default to 10km
    const [sortOrder, setSortOrder] = useState<string>('asc');

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log('Current location:', position.coords);
                setLocation(position.coords);
            },
            (error) => {
                console.error('Error getting location:', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    useEffect(() => {
        if (location) {
            fetchRestaurants();
        }
    }, [location, maxDistance, sortOrder]);

    const fetchRestaurants = async () => {
        try {
            const { data: allRestaurants, errors } = await client.models.HealthyEateries.list();
            if (errors) {
                console.error('Errors fetching restaurants:', errors);
                return;
            }

            const validRestaurants = allRestaurants.filter(restaurant =>
                restaurant.id && restaurant.name && restaurant.addressBlockHouseNumber && restaurant.addressBuildingName &&
                restaurant.addressPostalCode && restaurant.addressStreetName && restaurant.addressType &&
                restaurant.description && restaurant.addressFloorNumber && restaurant.addressUnitNumber && restaurant.coordinates
            ) as HealthyEateryWithDistance[];

            const maxDist = parseFloat(maxDistance);

            const restaurantsWithDistance = validRestaurants.map((restaurant) => {
                if (restaurant.coordinates && location) {
                    const coordsStr = restaurant.coordinates.replace(/[\[\]]/g, '');
                    const coordinates = coordsStr.split(',').map((coord) => parseFloat(coord.trim()));

                    if (coordinates.length >= 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                        const distance = haversine(
                            { latitude: location.latitude, longitude: location.longitude },
                            { latitude: coordinates[1], longitude: coordinates[0] }
                        );
                        return { ...restaurant, distance };
                    } else {
                        console.error(`Invalid coordinates for ${restaurant.name}:`, restaurant.coordinates);
                        return { ...restaurant, distance: Infinity };
                    }
                } else {
                    return { ...restaurant, distance: Infinity };
                }
            }).filter(restaurant => restaurant.distance! <= maxDist);

            const sortedRestaurants = restaurantsWithDistance.sort((a, b) => sortOrder === 'asc' ? a.distance! - b.distance! : b.distance! - a.distance!);
            setRestaurants(sortedRestaurants);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const renderItem: ListRenderItem<HealthyEateryWithDistance> = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedRestaurant(item)}>
            <View style={styles.restaurantItem}>
                <Image source={require('../assets/icon.png')} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <Text style={styles.restaurantDistance}>{(item.distance! / 1000).toFixed(2)} km</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.locatorContainer}>
            <View style={styles.filterContainer}>
                <Picker
                    selectedValue={maxDistance}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMaxDistance(itemValue)}
                >
                    <Picker.Item label="Within 1 km" value="1000" />
                    <Picker.Item label="Within 5 km" value="5000" />
                    <Picker.Item label="Within 10 km" value="10000" />
                    <Picker.Item label="Within 20 km" value="20000" />
                    <Picker.Item label="Beyond 20 km" value="100000000000" />

                </Picker>
                <Picker
                    selectedValue={sortOrder}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSortOrder(itemValue)}
                >
                    <Picker.Item label="Sort by Distance: Ascending" value="asc" />
                    <Picker.Item label="Sort by Distance: Descending" value="desc" />
                </Picker>
            </View>
            <FlatList
                data={restaurants}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.restaurantList}
            />
            <Modal isVisible={!!selectedRestaurant} onBackdropPress={() => setSelectedRestaurant(null)}>
                {selectedRestaurant ? (
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
                        <Text style={styles.modalText}>{selectedRestaurant.addressBuildingName}</Text>
                        <Text style={styles.modalText}>{selectedRestaurant.addressStreetName}</Text>
                        <Text style={styles.modalText}>{selectedRestaurant.addressPostalCode}</Text>
                        <Text style={styles.modalText}>{selectedRestaurant.description}</Text>
                        <TouchableOpacity onPress={() => setSelectedRestaurant(null)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View />
                )}
            </Modal>
        </SafeAreaView>
    );
};

export default LocatorScreen;
