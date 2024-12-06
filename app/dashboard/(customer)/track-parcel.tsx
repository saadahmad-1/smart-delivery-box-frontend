import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function TrackParcel() {
    const [parcelId, setParcelId] = useState('');
    const [parcelDetails, setParcelDetails] = useState(null);
    const [deliveryBoxLocation, setDeliveryBoxLocation] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState(null);  // New state for delivery status
    const [isLoading, setIsLoading] = useState(false);

    const fetchParcelDetails = async () => {
        if (!parcelId.trim()) {
            Alert.alert("Invalid Input", "Please enter a valid parcel ID.");
            return;
        }

        try {
            setIsLoading(true);

            // Fetch parcels
            const parcelResponse = await fetch('https://sdb-backend.onrender.com/api/v1/get-parcels');
            const parcelData = await parcelResponse.json();

            if (parcelData.status !== 'SUCCESS') {
                throw new Error('Failed to fetch parcels.');
            }

            // Find the specific parcel
            const parcel = parcelData.parcels.find(p => p.parcelId === parcelId.trim());
            if (!parcel) {
                throw new Error('Parcel not found.');
            }

            // Fetch delivery boxes
            const boxResponse = await fetch('https://sdb-backend.onrender.com/api/v1/get-delivery-boxes');
            const boxData = await boxResponse.json();

            if (boxData.status !== 'SUCCESS') {
                throw new Error('Failed to fetch delivery boxes.');
            }

            // Find the delivery box for the parcel
            const deliveryBox = boxData.deliveryBoxes.find(box => box.boxId === parcel.deliveryBoxId);
            if (!deliveryBox || !deliveryBox.location) {
                throw new Error('Delivery box location not found.');
            }

            // Fetch delivery status
            const statusResponse = await fetch(`https://sdb-backend.onrender.com/api/v1/delivery/status/${parcelId}`);
            const statusData = await statusResponse.json();

            // Set parcel details, delivery box location, and delivery status
            setParcelDetails(parcel);
            setDeliveryBoxLocation(deliveryBox.location);
            setDeliveryStatus(statusData); // Set the delivery status data
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Track Your Parcel</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Parcel ID"
                placeholderTextColor="#aaa"
                value={parcelId}
                onChangeText={setParcelId}
            />
            <TouchableOpacity style={styles.button} onPress={fetchParcelDetails} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Track Parcel'}</Text>
            </TouchableOpacity>

            <ScrollView style={styles.detailsContainer}>
                {parcelDetails && (
                    <View style={styles.parcelDetails}>
                        <Text style={styles.detailTitle}>Parcel Details:</Text>
                        <Text style={styles.detailText}>ID: {parcelDetails.parcelId}</Text>
                        <Text style={styles.detailText}>Fragile: {parcelDetails.isFragile ? 'Yes' : 'No'}</Text>
                        <Text style={styles.detailText}>Created At: {new Date(parcelDetails.createdAt).toLocaleString()}</Text>
                    </View>
                )}

                {deliveryStatus && (
                    <View style={styles.parcelDetails}>
                        <Text style={styles.detailTitle}>Delivery Status:</Text>
                        <Text style={styles.detailText}>Status: {deliveryStatus.status}</Text>
                    </View>
                )}

                {deliveryBoxLocation && (
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: deliveryBoxLocation.latitude,
                            longitude: deliveryBoxLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: deliveryBoxLocation.latitude,
                                longitude: deliveryBoxLocation.longitude,
                            }}
                            title="Delivery Box Location"
                        />
                    </MapView>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#1e1e1e',
        color: '#fff',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#1e88e5',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    detailsContainer: {
        flex: 1,
        marginTop: 20,
    },
    parcelDetails: {
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#ddd',
        marginBottom: 5,
    },
    map: {
        height: 300,
        borderRadius: 8,
    },
});
