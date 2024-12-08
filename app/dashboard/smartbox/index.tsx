import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import useEmailStore from '@/app/contexts/EmailContext';

const SmartBox: React.FC = () => {
    const [parcelId, setParcelId] = useState<string>('');
    const [status, setStatus] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const { setEmail: setGlobalEmail } = useEmailStore();
    const router = useRouter();

    const fetchParcelStatus = async () => {
        try {
            const response = await fetch(
                `https://sdb-backend.onrender.com/api/v1/delivery/status/${parcelId}`
            );
            const data = await response.json();
            if (response.ok) {
                setStatus(data.status);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch parcel status.');
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message || 'Network error.');
        }
    };

    const generateOtp = async () => {
        try {
            if (!email || !parcelId) {
                Alert.alert('Error', 'Please provide both email and parcel ID.');
                return;
            }

            // Store the email in the global store before navigation
            setGlobalEmail(email);

            const requestBody = {
                email: email,
                parcelId: parcelId,
            };

            const response = await fetch(
                `https://sdb-backend.onrender.com/api/v1/generate-otp`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            const data = await response.json();
            if (response.ok) {
                Alert.alert(
                    'OTP Generated',
                    `Your OTP is generated successfully. Use it to proceed!`
                );
                router.push('/dashboard/smartbox/emulator');
            } else {
                Alert.alert('Error', data.message || 'Failed to generate OTP.');
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message || 'Network error.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Parcel Status Checker</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Parcel ID"
                placeholderTextColor="#aaa"
                value={parcelId}
                onChangeText={setParcelId}
            />
            <Button title="Check Status" onPress={fetchParcelStatus} color="#1db954" />
            {status && (
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>
                        Parcel Status: {status}
                    </Text>
                    {status === 'DELIVERED' && (
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Email Address"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Text style={styles.promptText}>
                                Do you want to collect the parcel?
                            </Text>
                            <Button title="Generate OTP" onPress={generateOtp} color="#1db954" />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    statusContainer: {
        marginTop: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 18,
    },
    promptText: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 10,
    },
});

export default SmartBox;