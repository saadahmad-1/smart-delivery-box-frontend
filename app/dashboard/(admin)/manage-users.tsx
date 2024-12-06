import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetching users from the API
    useEffect(() => {
        fetch('https://sdb-backend.onrender.com/api/v1/get-users') // Replace with your API URL
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'SUCCESS') {
                    setUsers(data.users);
                } else {
                    setError('No users found');
                }
            })
            .catch((err) => {
                setError('Failed to fetch users');
            })
            .finally(() => setLoading(false));
    }, []);

    // Render each user
    const renderUser = ({ item }: any) => (
        <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRole}>{item.role}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Manage Users</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderUser}
                    contentContainerStyle={styles.userList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    userList: {
        paddingBottom: 20,
    },
    userCard: {
        backgroundColor: '#1f1f1f',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5, // For Android shadow
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    userEmail: {
        fontSize: 16,
        color: '#bbb',
    },
    userRole: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
});

export default ManageUsers;
