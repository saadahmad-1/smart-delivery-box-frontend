import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const ShowParcelsScreen = () => {
    const [parcels, setParcels] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [couriers, setCouriers] = useState([]);

    // Fetch parcels and users on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch parcels
                const parcelsResponse = await axios.get('https://sdb-backend.onrender.com/api/v1/get-parcels');
                if (parcelsResponse.data.status === 'SUCCESS') {
                    setParcels(parcelsResponse.data.parcels);
                } else {
                    setError('Failed to fetch parcels.');
                }

                // Fetch users
                const usersResponse = await axios.get('https://sdb-backend.onrender.com/api/v1/get-users');  // Replace with your API URL for fetching users
                if (usersResponse.data.status === 'SUCCESS') {
                    const courierUsers = usersResponse.data.users.filter(user => user.role === 'Courier');
                    setCouriers(courierUsers);
                } else {
                    setError('Failed to fetch users.');
                }
            } catch (err: any) {
                setError('Error fetching data: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to handle assigning a courier to a parcel
    const assignCourier = async (parcelId: string) => {
        if (couriers.length === 0) {
            Alert.alert('No available couriers', 'All couriers are currently assigned to other parcels.');
            return;
        }

        const courierId = couriers[0].email;  // Assign the first available courier
        console.log('Assigning courier', courierId, 'to parcel', parcelId);
        try {
            const response = await axios.post('https://sdb-backend.onrender.com/api/v1/assign-courier', {
                parcelId,
                courierId,
            });

            if (response.data.status === 'SUCCESS') {
                Alert.alert('Courier Assigned', 'Parcel successfully assigned to courier.');
                // Update the parcel list with the new courierId
                setParcels(parcels.map(parcel =>
                    parcel.parcelId === parcelId ? { ...parcel, courierId } : parcel
                ));
            } else {
                Alert.alert('Error', 'Failed to assign courier.');
            }
        } catch (err: any) {
            Alert.alert('Error', 'Error assigning courier: ' + err.message);
        }
    };

    // Render item for each parcel
    const renderParcelItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Parcel ID: {item.parcelId}</Text>
                <Text style={styles.cardText}>Size: {item.size}</Text>
                <Text style={styles.cardText}>Destination: {item.destination}</Text>
                <Text style={styles.cardText}>Fragile: {item.isFragile ? 'Yes' : 'No'}</Text>
                <Text style={styles.cardText}>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
                <Text style={styles.cardText}>Status: {item.status}</Text>
                <Text style={styles.cardText}>User ID: {item.userId}</Text>
                <Text style={styles.cardText}>Delivery Box ID: {item.deliveryBoxId}</Text>
                <Text style={styles.cardText}>Courier ID: {item.courierId || 'Not Assigned'}</Text>

                {!item.courierId && (
                    <TouchableOpacity onPress={() => assignCourier(item.parcelId)} style={styles.assignButton}>
                        <Text style={styles.assignText}>Assign Courier</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    // Display loading, error, or data
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading parcels...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity onPress={() => setLoading(true)} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Parcels</Text>
            <FlatList
                data={parcels}
                renderItem={renderParcelItem}
                keyExtractor={(item) => item.parcelId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212', // Dark background color
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff', // White text for header
    },
    card: {
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#1E1E1E', // Dark card background
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // White text for parcel title
    },
    cardText: {
        color: '#ccc', // Lighter color for text
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff', // White text for error
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginTop: 10,
    },
    retryText: {
        color: '#fff',
        textAlign: 'center',
    },
    assignButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        marginTop: 10,
    },
    assignText: {
        color: '#fff',
        textAlign: 'center',
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default ShowParcelsScreen;
