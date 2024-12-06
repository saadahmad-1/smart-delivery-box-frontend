import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthService, UserRegistrationRequest } from '../../services/AuthService';
import { useRouter } from 'expo-router';

export default function RegistrationScreen({ navigation }: any) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegistration = async () => {
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);

        const registrationData: UserRegistrationRequest = {
            name,
            email,
            password,
            role
        };

        try {
            const response = await AuthService.register(registrationData);

            if (response.status === 'SUCCESS') {
                Alert.alert('Success', response.message);
                router.replace('/auth/login');
            } else {
                Alert.alert('Registration Error', response.message);
            }
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#aaa"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#aaa"
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#aaa"
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Role:</Text>
                <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Customer" value="Customer" />
                    <Picker.Item label="Courier" value="Courier" />
                    <Picker.Item label="Admin" value="Admin" />
                </Picker>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegistration}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Registering...' : 'Register'}
                </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121212' // Dark background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff' // Light text
    },
    input: {
        height: 50,
        borderColor: '#333', // Dark border color
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 5,
        backgroundColor: '#1f1f1f', // Dark input background
        color: '#fff', // Light text inside input
    },
    pickerContainer: {
        marginBottom: 15,
    },
    pickerLabel: {
        color: '#fff', // Light label text
        marginBottom: 5
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#fff', // Light text in picker
        backgroundColor: '#1f1f1f', // Dark background for picker
    },
    button: {
        backgroundColor: '#007bff', // Blue button color
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15
    },
    loginText: {
        color: '#007bff', // Light blue text
        fontWeight: 'bold'
    }
});
