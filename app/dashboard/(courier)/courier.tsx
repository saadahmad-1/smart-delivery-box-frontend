import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CourierDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Courier Dashboard</Text>

            {/* Buttons Section */}
            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard/manage-parcels')}>
                    <Text style={styles.buttonText}>Manage Parcels</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => router.push('/auth/login')}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark theme background
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20, // Added padding for responsiveness
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', // Ensure full width
    },
    button: {
        backgroundColor: '#1976d2', // Dark blue button color (same as admin screen)
        paddingVertical: 15, // Added padding for better touchability
        paddingHorizontal: 20, // Added padding for better touchability
        borderRadius: 8,
        marginVertical: 10,
        width: '100%', // Full width for responsiveness
        maxWidth: 350, // Ensure buttons don't get too wide on large screens
        alignItems: 'center',
        justifyContent: 'center', // Ensures text is centered
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5, // Shadow for Android
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#d32f2f', // Red Logout button
    },
});
