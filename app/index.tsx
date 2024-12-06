import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to SDB</Text>
                <Text style={styles.subtitle}>Your Delivery Companion</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/auth/login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.registerButton]}
                        onPress={() => router.push('/auth/register')}
                    >
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background color
        justifyContent: 'center',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff', // Light text color for dark theme
    },
    subtitle: {
        fontSize: 18,
        color: '#ccc', // Lighter color for subtitle text
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        backgroundColor: '#007bff', // Blue button color
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    registerButton: {
        backgroundColor: '#1f1f1f', // Dark background for "Create Account" button
        borderWidth: 1,
        borderColor: '#007bff', // Blue border color
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButtonText: {
        color: '#007bff', // Blue text for the "Create Account" button
        fontSize: 16,
        fontWeight: 'bold',
    },
});
