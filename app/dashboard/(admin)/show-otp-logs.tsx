import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

// Define the OTP Log entry structure
const OtpLogEntry = ({ log }) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>OTP ID: {log.otpId}</Text>
        <Text style={styles.cardText}>Phone Number: {log.phoneNumber}</Text>
        <Text style={styles.cardText}>Service Provider: {log.serviceProviderId}</Text>
        <Text style={styles.cardText}>Status: {log.status}</Text>
        <Text style={styles.cardText}>Error: {log.error || 'N/A'}</Text>
        <Text style={styles.cardText}>Timestamp: {new Date(log.createdAt).toLocaleString()}</Text>
    </View>
);

const OtpLogsScreen = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch OTP logs when the component mounts
    useEffect(() => {
        const fetchOtpLogs = async () => {
            try {
                const response = await fetch('https://sdb-backend.onrender.com/api/v1/otp-logs'); // Adjust URL based on your server
                if (response.ok) {
                    const data = await response.json();
                    setLogs(data);
                } else {
                    setError('Failed to fetch logs');
                }
            } catch (err: any) {
                setError('Error fetching logs: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOtpLogs();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Loading OTP logs...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>OTP Logs</Text>
            <FlatList
                data={logs}
                renderItem={({ item }) => <OtpLogEntry log={item} />}
                keyExtractor={(item) => item.otpId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212', // Dark background color
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#fff', // White text for header
    },
    card: {
        padding: 16,
        backgroundColor: '#1E1E1E', // Dark card background
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff', // White text for title
    },
    cardText: {
        color: '#ccc', // Lighter text color
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
        color: '#fff', // White text for error
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default OtpLogsScreen;
