import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function CreateParcelScreen() {
    const [parcelSize, setParcelSize] = useState('SMALL');
    const [destination, setDestination] = useState('');
    const [isFragile, setIsFragile] = useState(false);
    const [deliveryBoxId, setDeliveryBoxId] = useState('');
    const [deliveryBoxes, setDeliveryBoxes] = useState([]);
    const [users, setUsers] = useState([]);  // State to store users
    const [selectedUserId, setSelectedUserId] = useState('');  // State to store selected user ID

    useEffect(() => {
        // Fetch available delivery boxes from the API
        axios.get('https://sdb-backend.onrender.com/api/v1/get-delivery-boxes')
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setDeliveryBoxes(response.data.deliveryBoxes);
                    if (response.data.deliveryBoxes.length > 0) {
                        setDeliveryBoxId(response.data.deliveryBoxes[0].boxId); // Set default to first box
                    }
                } else {
                    Alert.alert('Error', 'Failed to load delivery boxes');
                }
            })
            .catch((error) => {
                console.error('Error fetching delivery boxes:', error);
                Alert.alert('Error', 'Failed to load delivery boxes');
            });

        // Fetch users from the API
        axios.get('https://sdb-backend.onrender.com/api/v1/get-users') // Replace with the actual endpoint
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    const filteredUsers = response.data.users.filter(user => user.role === 'Customer');
                    setUsers(filteredUsers);
                    if (filteredUsers.length > 0) {
                        setSelectedUserId(filteredUsers[0].email); // Set default to first user
                    }
                } else {
                    Alert.alert('Error', 'Failed to load users');
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                Alert.alert('Error', 'Failed to load users');
            });
    }, []);

    const handleCreateParcel = () => {
        if (!destination || !deliveryBoxId || !selectedUserId) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }

        const parcelData = {
            userId: selectedUserId,  // Use selected user ID
            size: parcelSize,
            destination: destination,
            isFragile: isFragile,
            deliveryBoxId: deliveryBoxId,
        };

        axios.post('https://sdb-backend.onrender.com/api/v1/create-parcel', parcelData)
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    Alert.alert('Success', 'Parcel created successfully');
                } else {
                    Alert.alert('Error', response.data.message || 'Failed to create parcel');
                }
            })
            .catch((error) => {
                console.error('Error creating parcel:', error);
                Alert.alert('Error', 'Failed to create parcel');
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Parcel</Text>

            <Text style={styles.label}>Parcel Size</Text>
            <Picker
                selectedValue={parcelSize}
                style={styles.picker}
                onValueChange={(itemValue) => setParcelSize(itemValue)}
            >
                <Picker.Item label="Small" value="SMALL" />
                <Picker.Item label="Medium" value="MEDIUM" />
                <Picker.Item label="Large" value="LARGE" />
            </Picker>

            <Text style={styles.label}>Destination</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter destination"
                value={destination}
                onChangeText={setDestination}
            />

            <Text style={styles.label}>Is Fragile?</Text>
            <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsFragile(!isFragile)}
            >
                <Text style={styles.checkboxText}>{isFragile ? '✔️ Yes' : '❌ No'}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Select Delivery Box</Text>
            <Picker
                selectedValue={deliveryBoxId}
                style={styles.picker}
                onValueChange={(itemValue) => setDeliveryBoxId(itemValue)}
            >
                {deliveryBoxes.map((box) => (
                    <Picker.Item key={box.boxId} label={box.address} value={box.boxId} />
                ))}
            </Picker>

            <Text style={styles.label}>Select User</Text>
            <Picker
                selectedValue={selectedUserId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedUserId(itemValue)}
            >
                {users.map((user) => (
                    <Picker.Item key={user.email} label={user.email} value={user.email} />
                ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleCreateParcel}>
                <Text style={styles.buttonText}>Create Parcel</Text>
            </TouchableOpacity>
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
    label: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        color: '#ffffff',
        backgroundColor: '#333',
        marginBottom: 20,
    },
    picker: {
        height: 60,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        color: '#ffffff',
        marginBottom: 20,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxText: {
        fontSize: 16,
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#1976d2',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
