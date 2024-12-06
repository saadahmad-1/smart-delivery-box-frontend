import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CustomerDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customer Dashboard</Text>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/login')}>
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
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
