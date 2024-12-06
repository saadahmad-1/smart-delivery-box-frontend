import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Coordinates for Lahore
const LAHORE_LOCATION = {
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
};

const DeliveryBoxScreen = () => {
    const [deliveryBoxes, setDeliveryBoxes] = useState([]);
    const [boxType, setBoxType] = useState('SMALL');
    const [address, setAddress] = useState('');
    const [isSecured, setIsSecured] = useState(false);
    const [status, setStatus] = useState('AVAILABLE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Map-related states
    const [currentLocation, setCurrentLocation] = useState(LAHORE_LOCATION);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const [mapMode, setMapMode] = useState(null); // 'create' or 'view'
    const [currentViewBox, setCurrentViewBox] = useState(null);

    const fetchDeliveryBoxes = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sdb-backend.onrender.com/api/v1/get-delivery-boxes');
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

    const handleCreateBox = async () => {
        if (!address || !selectedLocation) {
            Alert.alert('Validation Error', 'Please provide an address and select a location');
            return;
        }

        setLoading(true);
        setError('');

        const requestData = {
            type: boxType,
            address: address,
            isSecured: isSecured,
            status: status,
            location: {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude
            }
        };

        try {
            const response = await fetch('https://sdb-backend.onrender.com/api/v1/create-delivery-box', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const data = await response.json();

            if (data.status === 'SUCCESS') {
                Alert.alert('Success', `Delivery Box created successfully! Box ID: ${data.boxId}`);
                // Reset form
                setAddress('');
                setBoxType('SMALL');
                setIsSecured(false);
                setStatus('AVAILABLE');
                setSelectedLocation(null);
                fetchDeliveryBoxes();
            } else {
                setError(data.message || 'Failed to create delivery box');
            }
        } catch (error) {
            setError('Error creating delivery box');
        } finally {
            setLoading(false);
        }
    };

    const renderBoxItem = ({ item }) => {
        return (
            <View style={styles.boxItem}>
                <Text style={styles.boxText}>Box ID: {item.boxId}</Text>
                <Text style={styles.boxText}>Address: {item.address}</Text>
                {item.location && (
                    <Text style={styles.boxText}>
                        Location: {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                    </Text>
                )}
                <TouchableOpacity
                    style={styles.viewMapButton}
                    onPress={() => {
                        // Set current location to the box's location
                        setCurrentLocation({
                            latitude: item.location.latitude,
                            longitude: item.location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        });
                        setMapMode('view');
                        setCurrentViewBox(item);
                        setIsMapVisible(true);
                    }}
                >
                    <Text style={styles.viewMapButtonText}>View on Map</Text>
                </TouchableOpacity>
            </View>
        );
    };

    useEffect(() => {
        fetchDeliveryBoxes();
    }, []);

    const handleCloseMap = () => {
        setIsMapVisible(false);
        setCurrentViewBox(null);
        setMapMode(null);
    };

    return (
        <TouchableWithoutFeedback onPress={handleCloseMap}>
            <ScrollView style={styles.container}>
                {/* Delivery Boxes List */}
                <Text style={styles.title}>Delivery Boxes</Text>
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

                {/* Location View Modal/Map */}
                {isMapVisible && (
                    <TouchableWithoutFeedback onPress={handleCloseMap}>
                        <View style={styles.mapContainer}>
                            <TouchableWithoutFeedback>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    style={styles.map}
                                    initialRegion={currentLocation}
                                    region={currentLocation}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                    rotateEnabled={false}
                                >
                                    {currentViewBox && currentViewBox.location && (
                                        <Marker
                                            coordinate={{
                                                latitude: currentViewBox.location.latitude,
                                                longitude: currentViewBox.location.longitude
                                            }}
                                            title="Delivery Box Location"
                                            description={`Box ID: ${currentViewBox.boxId}`}
                                            pinColor="#388e3c"
                                        />
                                    )}
                                </MapView>
                            </TouchableWithoutFeedback>
                            <View style={styles.mapButtonContainer}>
                                <TouchableOpacity
                                    style={styles.mapButton}
                                    onPress={handleCloseMap}
                                >
                                    <Text style={styles.mapButtonText}>Close Map</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}

                {/* Create New Delivery Box */}
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

                {/* Location Selection Button */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Select Location</Text>
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={() => {
                            // Reset to Lahore's initial location when opening map for creation
                            setCurrentLocation(LAHORE_LOCATION);
                            setSelectedLocation(null);
                            setMapMode('create');
                            setIsMapVisible(true);
                        }}
                    >
                        <Text style={styles.locationButtonText}>
                            {selectedLocation
                                ? `Location Selected: ${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`
                                : 'Select Location on Map'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Location Selection Modal/Map for Creation */}
                {isMapVisible && mapMode === 'create' && (
                    <TouchableWithoutFeedback onPress={handleCloseMap}>
                        <View style={styles.mapContainer}>
                            <TouchableWithoutFeedback>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    style={styles.map}
                                    initialRegion={currentLocation}
                                    region={currentLocation}
                                    onPress={(e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setSelectedLocation({ latitude, longitude });
                                    }}
                                >
                                    {selectedLocation && (
                                        <Marker
                                            coordinate={selectedLocation}
                                            title="Selected Delivery Box Location"
                                            description="Tap to confirm"
                                            pinColor="#388e3c"
                                        />
                                    )}
                                </MapView>
                            </TouchableWithoutFeedback>
                            <View style={styles.mapButtonContainer}>
                                <TouchableOpacity
                                    style={styles.mapButton}
                                    onPress={() => {
                                        if (!selectedLocation) {
                                            Alert.alert('Select Location', 'Please tap on the map to select a location');
                                            return;
                                        }
                                        setIsMapVisible(false);
                                    }}
                                >
                                    <Text style={styles.mapButtonText}>Confirm Location</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}

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
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
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
    mapContainer: {
        width: width,
        height: height * 0.7,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1000,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    mapButton: {
        backgroundColor: '#388e3c',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    mapButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationButton: {
        backgroundColor: '#1f1f1f',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    viewMapButton: {
        backgroundColor: '#388e3c',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    viewMapButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default DeliveryBoxScreen;




