import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';

export default function ManageParcelsScreen() {
    const [parcels, setParcels] = useState([]);
    const [courierEmail] = useState('courier@email.com'); // Replace with actual courier email
    const [selectedStatus, setSelectedStatus] = useState('DISPATCHED'); // Default status

    useEffect(() => {
        // Fetch parcels assigned to the courier
        axios.get('https://sdb-backend.onrender.com/api/v1/get-parcels')
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    const filteredParcels = response.data.parcels.filter(parcel => parcel.courierId === courierEmail);
                    setParcels(filteredParcels);
                } else {
                    Alert.alert('Error', 'Failed to fetch parcels');
                }
            })
            .catch((error) => {
                console.error('Error fetching parcels:', error);
                Alert.alert('Error', 'Failed to fetch parcels');
            });
    }, []);

    const handleStatusUpdate = (parcelId) => {
        const requestData = {
            parcelId: parcelId,
            status: selectedStatus,
            location: 'Current Location',  // Placeholder for actual location
            serviceProviderId: courierEmail,
        };

        axios.post('https://sdb-backend.onrender.com/api/v1/delivery/status', requestData)
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    Alert.alert('Success', 'Parcel status updated');
                    // Refresh parcels to reflect the update
                    setParcels(prevState =>
                        prevState.map(parcel =>
                            parcel.parcelId === parcelId
                                ? { ...parcel, status: selectedStatus }
                                : parcel
                        )
                    );
                } else {
                    Alert.alert('Error', response.data.message || 'Failed to update status');
                }
            })
            .catch((error) => {
                console.error('Error updating status:', error);
                Alert.alert('Error', 'Failed to update status');
            });
    };

    const renderParcelItem = ({ item }) => (
        <View style={styles.parcelItem}>
            <Text style={styles.parcelText}>Parcel ID: {item.parcelId}</Text>
            <Text style={styles.parcelText}>Destination: {item.destination}</Text>
            <Text style={styles.parcelText}>Status: {item.status}</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handleStatusUpdate(item.parcelId)}
            >
                <Text style={styles.buttonText}>Update Status to {selectedStatus}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Parcels</Text>

            <FlatList
                data={parcels}
                keyExtractor={(item) => item.parcelId}
                renderItem={renderParcelItem}
                contentContainerStyle={styles.parcelList}
            />

            <View style={styles.statusSelector}>
                <Text style={styles.label}>Select Status:</Text>
                <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => setSelectedStatus('DISPATCHED')}
                >
                    <Text style={styles.statusButtonText}>Dispatched</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => setSelectedStatus('IN_TRANSIT')}
                >
                    <Text style={styles.statusButtonText}>In Transit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => setSelectedStatus('OUT_FOR_DELIVERY')}
                >
                    <Text style={styles.statusButtonText}>Out for Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => setSelectedStatus('DELIVERED')}
                >
                    <Text style={styles.statusButtonText}>Delivered</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
        textAlign: 'center',
    },
    parcelList: {
        flexGrow: 1,
    },
    parcelItem: {
        backgroundColor: '#333',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
    },
    parcelText: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#1976d2',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusSelector: {
        marginTop: 20,
        alignItems: 'center',
    },
    statusButton: {
        backgroundColor: '#1976d2',
        paddingVertical: 10,
        borderRadius: 8,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    statusButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 10,
    },
});
