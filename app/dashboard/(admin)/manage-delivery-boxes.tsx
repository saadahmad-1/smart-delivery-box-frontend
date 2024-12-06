import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window'); // Get screen width for responsiveness

const DeliveryBoxScreen = () => {
    // State to store the list of existing delivery boxes and form inputs
    const [deliveryBoxes, setDeliveryBoxes] = useState([]);
    const [boxType, setBoxType] = useState('SMALL');
    const [address, setAddress] = useState('');
    const [isSecured, setIsSecured] = useState(false);
    const [status, setStatus] = useState('AVAILABLE'); // New state for status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch existing delivery boxes on component mount
    useEffect(() => {
        fetchDeliveryBoxes();
    }, []);

    // Fetch delivery boxes from the API
    const fetchDeliveryBoxes = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sdb-backend.onrender.com/api/v1/get-delivery-boxes'); // Replace with actual API URL
            const data = await response.json();
            if (data.status === 'SUCCESS') {
                setDeliveryBoxes(data.deliveryBoxes);
            } else {
                setError(data.message || 'Failed to fetch delivery boxes');
            }
        } catch (error) {
            setError('Error fetching delivery boxes');
        } finally {
            setLoading(false);
        }
    };

    // Create a new delivery box
    const handleCreateBox = async () => {
        if (!address) {
            Alert.alert('Validation Error', 'Please provide an address');
            return;
        }

        setLoading(true);
        setError('');

        const requestData = {
            type: boxType,
            address: address,
            isSecured: isSecured,
            status: status, // Add status to requestData
        };

        try {
            const response = await fetch('https://sdb-backend.onrender.com/api/v1/create-delivery-box', { // Replace with actual API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                Alert.alert('Success', `Delivery Box created successfully! Box ID: ${data.boxId}`);
                setAddress('');
                setBoxType('SMALL');
                setIsSecured(false);
                setStatus('AVAILABLE'); // Reset status to default
                fetchDeliveryBoxes(); // Refresh the list of delivery boxes
            } else {
                setError(data.message || 'Failed to create delivery box');
            }
        } catch (error) {
            setError('Error creating delivery box');
        } finally {
            setLoading(false);
        }
    };

    // Render each delivery box
    const renderBoxItem = ({ item }) => {
        return (
            <View style={styles.boxItem}>
                <Text style={styles.boxText}>Box ID: {item.boxId}</Text>
                {/* <Text style={styles.boxText}>Type: {item.type}</Text> */}
                <Text style={styles.boxText}>Address: {item.address}</Text>
                {/* <Text style={styles.boxText}>Secured: {item.secured ? 'Yes' : 'No'}</Text> */}
                {/* <Text style={styles.boxText}>Status: {item.status}</Text> */}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Delivery Boxes</Text>

            {/* Existing Delivery Boxes List */}
            <View style={styles.listContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        <FlatList
                            data={deliveryBoxes}
                            renderItem={renderBoxItem}
                            keyExtractor={(item) => item.boxId}
                        />
                    </>
                )}
            </View>

            {/* Create New Delivery Box Form */}
            <Text style={styles.title}>Create New Delivery Box</Text>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Box Type</Text>
                <Picker
                    selectedValue={boxType}
                    onValueChange={(itemValue) => setBoxType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Small" value="SMALL" />
                    <Picker.Item label="Medium" value="MEDIUM" />
                    <Picker.Item label="Large" value="LARGE" />
                </Picker>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter the delivery box address"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Is Secured?</Text>
                <TouchableOpacity
                    style={[styles.checkbox, isSecured && styles.checkboxSelected]}
                    onPress={() => setIsSecured(!isSecured)}
                >
                    <Text style={styles.checkboxText}>{isSecured ? 'Yes' : 'No'}</Text>
                </TouchableOpacity>
            </View>

            {/* Status Dropdown */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Status</Text>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Available" value="AVAILABLE" />
                    <Picker.Item label="Unavailable" value="UNAVAILABLE" />
                </Picker>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateBox}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Create Box</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05, // Responsive padding based on screen width
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    listContainer: {
        marginBottom: 30,
    },
    boxItem: {
        backgroundColor: '#1f1f1f',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    boxText: {
        color: '#fff',
        fontSize: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        height: 40,
        backgroundColor: '#1f1f1f',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    picker: {
        height: 60,
        backgroundColor: '#1f1f1f',
        color: '#fff',
        borderRadius: 8,
    },
    checkbox: {
        backgroundColor: '#1f1f1f',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#388e3c',
    },
    checkboxText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    submitButton: {
        backgroundColor: '#388e3c',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DeliveryBoxScreen;
