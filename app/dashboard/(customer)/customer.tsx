import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CustomerDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer Dashboard</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/dashboard/track-parcel')}>
                <Text style={styles.buttonText}>Track Parcel</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={() => router.push('/auth/login')}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212', // Dark background
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff', // White text
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#1e88e5', // Blue for primary action
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#ffffff', // White text
        fontWeight: 'bold',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#e53935', // Red for logout
    },
});
