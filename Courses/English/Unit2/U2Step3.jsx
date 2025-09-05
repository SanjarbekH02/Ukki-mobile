import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles from '../../../Styles/Styles';
import ErrorOverlay from '../../../components/Utils/OnError';
import ConfettiEffect from '../../../components/Utils/Success';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

const U2Step1 = ({ next }) => {
    const soundRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [resultText, setResultText] = useState("");
    const [position, setPosition] = useState(0);
    const [finished, setFinished] = useState(false);
    const [hiddenButtons, setHiddenButtons] = useState([]);
    const [isSucces, setIsSucces] = useState(false);
    const [isError, setIsError] = useState(false)
    const [errorCount, setErrorCount] = useState(0)

    const audioList = [
        "https://ukkibackend.soof.uz/media/audio/CD1-23-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-3.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-4.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-5.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-6.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-7.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-8.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-9.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-23-10.mp3",
    ];

    const mapping = {
        0: 1, 1: 2, 2: 3, 3: 4, 4: 5,
        5: 6, 6: 7, 7: 8, 8: 9, 9: 10,
    };

    const shuffleArray = (array) => {
        let arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const [shuffledIndexes] = useState(
        shuffleArray([...Array(audioList.length).keys()])
    );

    const playAudio = async (index) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioList[index] },
                { shouldPlay: true }
            );
            soundRef.current = sound;
            setCurrentIndex(index);
        } catch (error) {
            console.log("Audio error:", error);
        }
    };

    useEffect(() => {
        if (position < shuffledIndexes.length) {
            playAudio(shuffledIndexes[position]);
        } else {
            setFinished(true);
        }
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, [position]);

    const handleAnswer = (btnIndex) => {
        if (mapping[currentIndex] === btnIndex) {
            setIsSucces(true);
            setTimeout(() => {
                setIsSucces(false)
            }, 2000)
            setHiddenButtons((prev) => [...prev, btnIndex]);
            setTimeout(() => {
                setResultText("");
                setPosition(prev => prev + 1);
            }, 1000);
        } else {
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 1000)
            setTimeout(() => {
                setResultText("");
                playAudio(currentIndex);
            }, 1000);
        }
    };

    return (
        <>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ThreeButtons />
                <View style={styles.container}>
                    <Image
                        source={require('../../../assets/images/unit1,1.png')}
                        style={styles.step2Img}
                    />

                    {[...Array(10).keys()].map((i) => (
                        hiddenButtons.includes(i + 1) ? null : (
                            <TouchableOpacity
                                key={i}
                                style={[styles.userNumber, styles[`userNumber${i + 1}`]]}
                                onPress={() => handleAnswer(i + 1)}
                            >
                                <Text style={Styles.userNumberText}>{i + 1}</Text>
                            </TouchableOpacity>
                        )
                    ))}

                    {resultText !== "" && (
                        <View style={{ alignItems: "center", marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{resultText}</Text>
                        </View>
                    )}

                </View>
                {finished && (
                    <TouchableOpacity style={Styles.NextButton} onPress={next}>
                        <Text style={Styles.listenText}>Next</Text>
                    </TouchableOpacity>
                )}

            </View>
            {isSucces && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        height: "90%",
        backgroundColor: '#eee',
        marginBottom: 95
    },
    step2Img: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
    },
    userNumber: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: '#7272728e',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#fff',
    },
    userNumber1: { top: '40%', left: "0%" },
    userNumber2: { top: '25%', left: '40%' },
    userNumber3: { top: '27%', right: '5%' },
    userNumber4: { bottom: '35%', left: '10%' },
    userNumber5: { bottom: '33%', left: '40%' },
    userNumber6: { bottom: '35%', right: '32%' },
    userNumber7: { bottom: '27%', left: '42%' },
    userNumber8: { bottom: '27%', right: '27%' },
    userNumber9: { bottom: '27%', right: '10%' },
    userNumber10: { bottom: '17%', right: '16%' },
});

export default U2Step1;
