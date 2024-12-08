import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Animated,
    Easing,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import useEmailStore from '@/app/contexts/EmailContext';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const Emulator: React.FC = () => {
    const [otpDigits, setOtpDigits] = useState<number[]>([0, 0, 0, 0, 0, 0]);
    const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
    const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
    const [boxOpened, setBoxOpened] = useState<boolean>(false);
    const [showHomeButton, setShowHomeButton] = useState<boolean>(false);
    const [showKeypad, setShowKeypad] = useState<boolean>(true);

    // Animated values
    const boxOpenProgress = useRef(new Animated.Value(0)).current;
    const parcelSlideProgress = useRef(new Animated.Value(0)).current;
    const parcelScaleProgress = useRef(new Animated.Value(0)).current;
    const handleRotation = useRef(new Animated.Value(0)).current;

    const { email } = useEmailStore();
    const router = useRouter();

    const verifyOtp = async () => {
        try {
            const otp = otpDigits.join('');

            const requestBody = {
                email: email,
                otp: otp,
            };

            const response = await fetch(
                'https://sdb-backend.onrender.com/api/v1/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
            );

            const data = await response.json();
            if (response.ok && data.status === 'SUCCESS') {
                setIsOtpVerified(true);
                setShowKeypad(false);
            } else {
                Alert.alert('Verification Failed', data.message || 'Invalid OTP');
            }
        } catch (error) {
            Alert.alert('Error', (error as Error).message || 'Network error.');
        }
    };

    const handleNumberPress = (number: number) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[currentDigitIndex] = number;
        setOtpDigits(newOtpDigits);

        const nextIndex = (currentDigitIndex + 1) % 6;
        setCurrentDigitIndex(nextIndex);
    };

    const handleBackspace = () => {
        const newOtpDigits = [...otpDigits];

        if (newOtpDigits[currentDigitIndex] === 0) {
            const prevIndex = currentDigitIndex === 0 ? 5 : currentDigitIndex - 1;
            setCurrentDigitIndex(prevIndex);
            newOtpDigits[prevIndex] = 0;
        } else {
            newOtpDigits[currentDigitIndex] = 0;
        }

        setOtpDigits(newOtpDigits);
    };

    const openBox = () => {
        Animated.parallel([
            Animated.timing(handleRotation, {
                toValue: 1,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(boxOpenProgress, {
                toValue: 1,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.timing(parcelSlideProgress, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(parcelScaleProgress, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.elastic(1.2),
                    useNativeDriver: true
                })
            ])
        ]).start(() => {
            setBoxOpened(true);
            setShowHomeButton(true);
        });
    };

    const closeBox = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(parcelScaleProgress, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(parcelSlideProgress, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ]),
            Animated.timing(boxOpenProgress, {
                toValue: 0,
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true
            }),
            Animated.timing(handleRotation, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]).start(() => {
            setBoxOpened(false);
        });
    };

    const navigateToHome = () => {
        router.push('/dashboard/customer');
    };

    const renderSmartBox = () => {
        const boxLidRotation = boxOpenProgress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-110deg']
        });

        const parcelTranslateX = parcelSlideProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width]
        });

        const parcelScale = parcelScaleProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.2, 1.1, 1]
        });

        const handleRotate = handleRotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '90deg']
        });

        return (
            <View style={styles.smartBoxContainer}>
                <View style={styles.boxBody}>
                    {/* OTP Display */}
                    {showKeypad && (
                        <View style={styles.otpDisplay}>
                            {otpDigits.map((digit, index) => (
                                <Text
                                    key={index}
                                    style={[
                                        styles.otpDigit,
                                        currentDigitIndex === index && styles.currentDigit
                                    ]}
                                >
                                    {digit}
                                </Text>
                            ))}
                        </View>
                    )}

                    {/* Numeric Keypad */}
                    {showKeypad && (
                        <View style={styles.keypadContainer}>
                            {[
                                [1, 2, 3],
                                [4, 5, 6],
                                [7, 8, 9],
                                ['⌫', 0, 'Verify']
                            ].map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.keypadRow}>
                                    {row.map((key) => (
                                        <TouchableOpacity
                                            key={key}
                                            style={styles.keypadButton}
                                            onPress={() => {
                                                if (key === '⌫') handleBackspace();
                                                else if (key === 'Verify') verifyOtp();
                                                else if (typeof key === 'number') handleNumberPress(key);
                                            }}
                                        >
                                            <Text style={styles.keypadButtonText}>{key}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Box Lid */}
                    <Animated.View
                        style={[
                            styles.boxLid,
                            {
                                transform: [
                                    { translateY: -50 },
                                    { rotateX: boxLidRotation },
                                    { translateY: 50 }
                                ]
                            }
                        ]}
                    />

                    {/* Handle */}
                    {isOtpVerified && (
                        <Animated.View
                            style={[
                                styles.boxHandle,
                                {
                                    transform: [{ rotate: handleRotate }]
                                }
                            ]}
                        />
                    )}

                    {/* Parcel - Only show after OTP verification */}
                    {isOtpVerified && (
                        <Animated.View
                            style={[
                                styles.parcel,
                                {
                                    transform: [
                                        { translateX: parcelTranslateX },
                                        { scale: parcelScale }
                                    ]
                                }
                            ]}
                        >
                            <Text style={styles.parcelText}>Your Package</Text>
                        </Animated.View>
                    )}
                </View>

                {/* Open Handle */}
                {isOtpVerified && !boxOpened && (
                    <TouchableOpacity
                        style={styles.openButton}
                        onPress={openBox}
                    >
                        <MaterialIcons name="open-in-browser" size={40} color="white" />
                        <Text style={styles.openButtonText}>Open Box</Text>
                    </TouchableOpacity>
                )}

                {/* Home Navigation Button */}
                {showHomeButton && (
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={navigateToHome}
                    >
                        <Text style={styles.homeButtonText}>Return to Home</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Delivery Box</Text>
            {renderSmartBox()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    smartBoxContainer: {
        alignItems: 'center',
    },
    boxBody: {
        width: width * 0.8,
        height: height * 0.6,
        backgroundColor: '#2C2C2C',
        borderRadius: 20,
        borderWidth: 5,
        borderColor: '#3C3C3C',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    otpDisplay: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
    },
    otpDigit: {
        fontSize: 32,
        color: '#888',
        marginHorizontal: 10,
        width: 40,
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#555',
    },
    currentDigit: {
        color: '#1DB954',
        borderBottomColor: '#1DB954',
    },
    keypadContainer: {
        width: '80%',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    keypadButton: {
        backgroundColor: '#3C3C3C',
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4C4C4C',
    },
    keypadButtonText: {
        color: '#1DB954',
        fontSize: 24,
        fontWeight: 'bold',
    },
    boxLid: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 100,
        backgroundColor: '#3C3C3C',
        transformOrigin: 'top center',
    },
    boxHandle: {
        position: 'absolute',
        top: 50,
        right: -20,
        width: 40,
        height: 10,
        backgroundColor: '#1DB954',
        transform: [{ translateX: -20 }],
    },
    parcel: {
        width: 1000,
        height: 250,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    parcelText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    openButton: {
        flexDirection: 'row',
        backgroundColor: '#1DB954',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    openButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    homeButton: {
        backgroundColor: '#1DB954',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    homeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Emulator;