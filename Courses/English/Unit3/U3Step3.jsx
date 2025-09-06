import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NameGame from '../../../components/IsmTop';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import FlashCards from '../../../components/YangiSozlar';
import Styles from '../../../Styles/Styles';

export default function U3Step3({ next }) {
    const [showPointer, setShowPointer] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [buttonIndex, setButtonIndex] = useState(null);
    const soundRef = useRef(null);
    const [onAllCorrect, setOnAllCorrect] = useState(false);
    const [selectName, setSelectName] = useState(null);
    const [hiddenButtons, setHiddenButtons] = useState([]);
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)

    const buttonAudios = {
        1: "https://ukkibackend.soof.uz/media/audio/unit2-step3-1.mp3",
        2: "https://ukkibackend.soof.uz/media/audio/unit2-step3-2.mp3",
        3: "https://ukkibackend.soof.uz/media/audio/unit2-step3-3.mp3",
        4: "https://ukkibackend.soof.uz/media/audio/unit2-step3-4.mp3",
    };

    const handlePlay = async (btnIndex) => {
        setShowPointer(false);
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: buttonAudios[btnIndex] },
                { shouldPlay: true }
            );
            soundRef.current = sound;

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setButtonIndex(null);
                    setHiddenButtons((prev) => [...prev, btnIndex]);
                }
            });

            setButtonIndex(btnIndex);
        } catch (error) {
            console.log("Audio play error:", error);
        }
    };

    useEffect(() => {
        if (showPointer) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
                ])
            ).start();
        } else {
            scaleAnim.setValue(1);
        }
    }, [showPointer]);

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        if (hiddenButtons.length === 4) {
            setTimeout(() => {
                setOnAllCorrect(true);
            }, 1000);
        }
    }, [hiddenButtons]);

    const nameGameData = [
        { id: 1, name: "This", image: require("../../../assets/images/classrom.jpg") },
        { id: 2, name: "That", image: require("../../../assets/images/english.png") },
        { id: 3, name: "School", image: require("../../../assets/images/english.png") },
        { id: 4, name: "Classroom", image: require("../../../assets/images/classrom.jpg") },
    ];

    return (
        <>
            {dictionary ? (
                <FlashCards
                    setDictionary={setDictionary}
                    data={[
                        { word: "This", translation: "Bu", audioUrl: "https://ukkibackend.soof.uz/media/audio/bu.mp3" },
                        { word: "That", translation: "Sha/u", audioUrl: "https://ukkibackend.soof.uz/media/audio/sha.mp3" },
                        { word: "School", translation: "Maktab", audioUrl: "https://ukkibackend.soof.uz/media/audio/maktab.mp3" },
                        { word: "Classroom", translation: "Sinf xonasi", audioUrl: "https://ukkibackend.soof.uz/media/audio/sinf.mp3" },
                        { word: "Here", translation: "Mana bu yerda", audioUrl: "https://ukkibackend.soof.uz/media/audio/mana_bu_yerda.mp3" },
                        { word: "There", translation: "Mana u yerda", audioUrl: "https://ukkibackend.soof.uz/media/audio/mana_u_yerda.mp3" },
                    ]}
                />
            ) : onAllCorrect ? (
                <NameGame 
                    data={nameGameData} 
                    setOnAllCorrect={setOnAllCorrect} 
                    next={next}
                />
            ) : (
                <View style={styles.container}>
                    <ThreeButtons
                        setDictionary={setDictionary}
                        infoClick={infoClick} 
                        clicked={clicked} 
                        setClicked={setClicked} 
                        setInfoClick={setInfoClick}
                        setShowPointer={setShowPointer}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/unit2-step3-intro.mp3"
                    />
                    <Image
                        source={require('../../../assets/images/unit-3/unit-2-step-1.png')}
                        style={styles.backgroundImg}
                    />
                    
                    <View style={{
                        position: 'absolute',
                        bottom: 50,
                        left: 0,
                        right: 0,
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity 
                            style={{
                                backgroundColor: '#FF6B35',
                                paddingVertical: 18,
                                paddingHorizontal: 60,
                                borderRadius: 25,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                                elevation: 8
                            }}
                            onPress={() => handlePlay(1)}
                        >
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>▶ Play</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#eee',
    },
    backgroundImg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '75%',
        resizeMode: 'cover',
    },
    stepTitle: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 10,
        borderRadius: 8,
    },
    audioButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    audioButton1: {
        top: '20%',
        left: '15%',
    },
    audioButton2: {
        top: '35%',
        right: '20%',
    },
    audioButton3: {
        bottom: '30%',
        left: '25%',
    },
    audioButton4: {
        bottom: '20%',
        right: '15%',
    },
    activeButton: {
        backgroundColor: '#FF5722',
        borderWidth: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    voiceAnimation: {
        width: 50,
        height: 50,
    },
    pointer: {
        position: "absolute",
        left: -25,
        top: -25,
        width: 50,
        height: 50,
        resizeMode: "contain",
        zIndex: 10,
    },
});