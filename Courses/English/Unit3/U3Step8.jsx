import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

const { width } = Dimensions.get('window');

const InteractiveLearningApp = ({ next }) => {
    const [showGift, setShowGift] = useState(true);
    const [audioFinished, setAudioFinished] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Har xil so'zlar va ularning ma'lumotlari
    const words = [
        {
            text: "It's a computer game - Bu kompyuter o'yini",
            correctAnswer: "it's a computer game",
            audioUrl: 'https://ukkibackend.soof.uz/media/audio/CD1-46-1.mp3',
            giftImage: require('../../../assets/images/unit-3/cd46-1.jpg'),
            revealImage: require('../../../assets/images/unit-3/cd46-2.jpg'),
        },
        {
            text: "It's an art set - Bu rasm chizish toʻplami",
            correctAnswer: "it's an art set",
            audioUrl: 'https://ukkibackend.soof.uz/media/audio/CD1-46-2.mp3', // Bu URL ni o'zgartiring
            giftImage: require('../../../assets/images/unit-3/cd46-3.jpg'), // Bu rasm yo'lini o'zgartiring
            revealImage: require('../../../assets/images/unit-3/cd46-4.jpg'), // Bu rasm yo'lini o'zgartiring
        },
        // Qo'shimcha so'zlar qo'shishingiz mumkin
    ];

    const currentWord = words[currentIndex];

    // Audio ijro etish funksiyasi
    const playAudio = async () => {
        try {
            // Avvalgi audio ni to'xtatish
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: currentWord.audioUrl },
                { shouldPlay: true }
            );

            setSound(newSound);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setAudioFinished(true);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }
            });
        } catch (error) {
            console.error('Audio ijro etishda xatolik:', error);
            Alert.alert('Xatolik', 'Audio faylini ijro etib bo\'lmadi');
        }
    };

    // Sovg'ani ochish funksiyasi
    const openGift = () => {
        setShowGift(false);
        setTimeout(playAudio, 500);
    };

    // Ovoz yozishni boshlash
    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ruxsat kerak', 'Mikrofon ishlatish uchun ruxsat bering');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
            setStatusText(''); // Status textni tozalash
        } catch (error) {
            console.error('Yozishni boshlaganda xatolik:', error);
        }
    };

    // Ovoz yozishni to'xtatish va STT API chaqirish
    const stopRecording = async () => {
        if (!isRecording || !recording) return;

        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            if (!uri) {
                Alert.alert('Xatolik', 'Audio fayl topilmadi');
                return;
            }

            setStatusText('Audio tekshirilmoqda...');

            const formData = new FormData();
            formData.append("file", {
                uri,
                name: "audio.mp3",
                type: "audio/mpeg",
            });

            const sttResponse = await fetch("https://stt.soof.uz/stt", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "accept-language": "en",
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            if (!sttResponse.ok) {
                throw new Error('STT API dan javob olmadi');
            }

            const sttData = await sttResponse.json();
            console.log("STT javobi:", sttData);

            const userSaid = (sttData.transcript || "").toLowerCase().trim();
            const correctAnswer = currentWord.correctAnswer.toLowerCase().trim();

            console.log("Foydalanuvchi aytgani:", userSaid);
            console.log("To'g'ri javob:", correctAnswer);

            if (userSaid.includes(correctAnswer) || correctAnswer.includes(userSaid)) {
                setSuccess(true);
                setStatusText('✅ To\'g\'ri javob!');
                setRetryCount(0);

                setTimeout(() => {
                    setSuccess(false);
                    nextWord();
                }, 2000);
            } else {
                if (retryCount < 2) {
                    setError(true);
                    setStatusText(`❌ Noto'g'ri! Qayta urining. (${retryCount + 1}/3)`);
                    setRetryCount(retryCount + 1);

                    setTimeout(() => {
                        setError(false);
                        setStatusText('');
                        playAudio(); // Audioni qayta ijro etish
                    }, 2000);
                } else {
                    setStatusText(`❌ 3 marta noto'g'ri! To'g'ri javob: "${currentWord.correctAnswer}"`);
                    setRetryCount(0);

                    setTimeout(() => {
                        nextWord();
                    }, 3000);
                }
            }

            setRecording(null);
        } catch (err) {
            console.error("Stop recording error:", err);
            setStatusText('Xatolik yuz berdi. Qayta urining.');
            setRecording(null);
        }
    };

    // Keyingi so'zga o'tish
    const nextWord = () => {
        const nextIndex = (currentIndex + 1) % words.length;
        setCurrentIndex(nextIndex);

        // Barcha holatlarni qayta tiklash
        setAudioFinished(false);
        setStatusText('');
        setSuccess(false);
        setError(false);
        setRetryCount(0);
        fadeAnim.setValue(0);
        setShowGift(true);

        // Audio ni to'xtatish
        if (sound) {
            sound.unloadAsync();
            setSound(null);
        }
    };


    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);

    return (
        <View style={styles.container}>
            <ThreeButtons
                setDictionary={setDictionary}
                infoClick={infoClick}
                clicked={clicked}
                setClicked={setClicked}
                setInfoClick={setInfoClick}
                audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, kel o’yinchoqlarni belgilaymiz.mp3" />
            {/* Progress indicator */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    {currentIndex + 1} / {words.length}
                </Text>
            </View>

            <View style={styles.imageContainer}>
                {showGift ? (
                    <View>
                        <Image
                            source={currentWord.giftImage}
                            style={styles.image}
                        />
                        <TouchableOpacity style={styles.giftButton} onPress={openGift}>
                            <Text style={styles.giftButtonText}>Sovg'ani ochish</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Image
                        source={currentWord.revealImage}
                        style={styles.image}
                    />
                )}
            </View>

            {!showGift && (
                <View style={styles.textContainer}>
                    <Text style={styles.questionText}>What's this - Bu nima</Text>
                    <Text style={styles.answerText}>{currentWord.text}</Text>
                </View>
            )}

            {audioFinished && (
                <Animated.View style={[styles.microphoneContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.microphonePrompt}>Sovg'a ichida nima bor?</Text>
                    <TouchableOpacity
                        style={[styles.microphoneButton, isRecording && styles.recordingButton]}
                        onPress={isRecording ? stopRecording : startRecording}
                        disabled={success} // Muvaffaqiyat holatida tugmani o'chirish
                    >
                        <Ionicons
                            name={isRecording ? 'stop' : 'mic'}
                            size={30}
                            color="white"
                        />
                    </TouchableOpacity>
                    {isRecording && <Text style={styles.recordingText}>Yozilmoqda...</Text>}
                </Animated.View>
            )}

            {statusText ? (
                <Text style={[
                    styles.statusText,
                    success && styles.successText,
                    error && styles.errorText
                ]}>
                    {statusText}
                </Text>
            ) : null}

            {/* Next tugmasi - faqat 2-savolda ko'rsatiladi */}
            {currentIndex === 1 && (success || statusText.includes('noto\'g\'ri')) && (
                <TouchableOpacity style={styles.nextButton} onPress={next}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    progressContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    progressText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    imageContainer: {
        position: 'relative',
        width: width * 0.8,
        height: 300,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    giftButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -75 }, { translateY: -25 }],
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    giftButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    textContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        width: width * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    questionText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
    answerText: { fontSize: 16, color: '#666', textAlign: 'center' },
    microphoneContainer: { alignItems: 'center' },
    microphonePrompt: { fontSize: 16, color: '#333', marginBottom: 15, textAlign: 'center' },
    microphoneButton: {
        backgroundColor: '#4CAF50',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    recordingButton: { backgroundColor: '#f44336' },
    recordingText: { marginTop: 10, fontSize: 14, color: '#f44336', fontWeight: 'bold' },
    statusText: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    successText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 18,
    },
    errorText: {
        color: '#f44336',
        fontWeight: 'bold',
        fontSize: 16,
    },
    nextButton: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default InteractiveLearningApp;