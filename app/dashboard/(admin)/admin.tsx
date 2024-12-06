import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Admin Dashboard</Text>
            </View>

            {/* Buttons Section */}
            <View style={styles.content}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard/manage-users')}>
                    <Text style={styles.buttonText}>Manage Users</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard/manage-delivery-boxes')}>
                    <Text style={styles.buttonText}>Manage Delivery Boxes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard/create-parcel')}>
                    <Text style={styles.buttonText}>Create Parcel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard/show-parcels')}>
                    <Text style={styles.buttonText}>Manage Parcels</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push('/dashboard/show-otp-logs')}>
                    <Text style={styles.buttonText}>Show OTP Logs</Text>
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
    },
    header: {
        backgroundColor: '#1e1e1e', // Slightly lighter for distinction
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#1f1f1f', // Dark button background
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
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
    },
    logoutButton: {
        backgroundColor: '#d32f2f', // Red Logout button
    },
});
