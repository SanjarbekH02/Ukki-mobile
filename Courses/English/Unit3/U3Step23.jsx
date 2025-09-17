import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Vibration,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ElectricDetectionApp = ({next}) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isVibrating, setIsVibrating] = useState(false);
    const vibrationInterval = useRef(null);

    // Vibratsiyani boshlash
    const startVibration = () => {
        if (!isVibrating) {
            setIsVibrating(true);
            // Dastlabki vibratsiya
            Vibration.vibrate(100);

            // Davomiy vibratsiya
            vibrationInterval.current = setInterval(() => {
                Vibration.vibrate(50);
            }, 200);
        }
    };

    // Vibratsiyani to'xtatish
    const stopVibration = () => {
        if (isVibrating) {
            setIsVibrating(false);
            if (vibrationInterval.current) {
                clearInterval(vibrationInterval.current);
                vibrationInterval.current = null;
            }
            Vibration.cancel();
        }
    };

    // Rasmga bosish
    const handlePressIn = () => {
        setIsPressed(true);
        startVibration();
    };

    // Rasmdan qo'lni olish
    const handlePressOut = () => {
        setIsPressed(false);
        stopVibration();
    };

    // Next tugmasi
    const handleNext = () => {
        console.log('Next button pressed');
        // Bu yerda keyingi sahifaga o'tish logikasini yozishingiz mumkin
    };

    // Component unmount bo'lganda vibratsiyani to'xtatish
    useEffect(() => {
        return () => {
            stopVibration();
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

            {/* Background gradient */}
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.gradient}
            >
                {/* Header text */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Is it electric?</Text>
                    <Text style={styles.subHeaderText}>Bu elektrikmi?</Text>
                </View>

                {/* Main image area */}
                <TouchableWithoutFeedback
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <View style={[styles.imageContainer, isPressed && styles.imagePressed]}>
                        <ImageBackground
                            source={require('../../../assets/images/tok.jpg')}
                            style={styles.backgroundImage}
                            imageStyle={styles.imageStyle}
                        >
                            {/* Overlay effect */}
                            <View style={[styles.overlay, isPressed && styles.overlayPressed]}>
                                {isVibrating && (
                                    <View style={styles.electricEffect}>
                                        <Text style={styles.electricText}>⚡</Text>
                                    </View>
                                )}
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableWithoutFeedback>

                {/* Instruction text */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>
                        Rasmni bosing 
                    </Text>
                    <Text style={styles.instructionSubText}>
                        Press on the image
                    </Text>
                </View>

                {/* Next button */}
                <TouchableOpacity style={styles.nextButton} onPress={next}>
                    <LinearGradient
                        colors={['#00d2ff', '#3a7bd5']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.nextButtonText}>NEXT</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 210, 255, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
        marginBottom: 8,
    },
    subHeaderText: {
        fontSize: 18,
        color: '#b0c4de',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    imageContainer: {
        flex: 1,
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#00d2ff',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        transform: [{ scale: 1 }],
    },
    imagePressed: {
        transform: [{ scale: 0.98 }],
        shadowOpacity: 0.6,
        shadowRadius: 15,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        borderRadius: 20,
    },
    overlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayPressed: {
        backgroundColor: 'rgba(0, 210, 255, 0.2)',
    },
    electricEffect: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    electricText: {
        fontSize: 80,
        color: '#00d2ff',
        textShadowColor: '#ffffff',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    instructionContainer: {
        alignItems: 'center',
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    instructionText: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 5,
    },
    instructionSubText: {
        fontSize: 14,
        color: '#b0c4de',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    nextButton: {
        marginHorizontal: 40,
        marginBottom: 50,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#00d2ff',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonGradient: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default ElectricDetectionApp;