import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { AuthService, UserLoginRequest } from '../../services/AuthService';
import { Ionicons } from '@expo/vector-icons'; // Import Icon library (if using Expo)
import { useRouter } from 'expo-router';

export default function LoginScreen({ navigation }: any) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setIsLoading(true);

        const loginData: UserLoginRequest = {
            email,
            password
        };

        try {
            const response = await AuthService.login(loginData);

            if (response.status === 'SUCCESS') {
                // Navigate based on role
                switch (response.role) {
                    case 'Admin':
                        router.replace('/dashboard/admin');
                        break;
                    case 'Courier':
                        router.replace('/dashboard/courier');
                        break;
                    case 'Customer':
                    default:
                        router.replace('/dashboard/customer');
                }
            } else {
                Alert.alert('Login Error', response.message);
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword} // Toggle visibility
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'} // Icon for visibility toggle
                        size={24}
                        color="#aaa"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                    <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: '#fff' // Light text inside input
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#1f1f1f',
        marginBottom: 15,
        paddingHorizontal: 10
    },
    passwordInput: {
        flex: 1,
        height: 50,
        color: '#fff' // Light text inside password input
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
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15
    },
    registerText: {
        color: '#007bff', // Light blue text
        fontWeight: 'bold'
    }
});
