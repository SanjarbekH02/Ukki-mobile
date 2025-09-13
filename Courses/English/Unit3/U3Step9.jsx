import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Styles from '../../../Styles/Styles';
import WordPractice from '../../../components/Utils/Talaffuz';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import WordGameAssist from '../../../components/Utils/WordGame';
import FlashCards from '../../../components/YangiSozlar';

const { width, height } = Dimensions.get('window');

const AudioImageQuiz = ({ next }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultText, setResultText] = useState('');
    const [nextShow, setNextShow] = useState(false);
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true);
    const [dictionary, setDictionary] = useState(false);
    const [wordgame, setWordgame] = useState(true);
    const [talaffuz, setTalaffuz] = useState(false)

    // Rasmlar va audio URL'lar ma'lumotlari (rasmlar require orqali)
    const quizData = [
        {
            id: 1,
            image: require('../../../assets/images/unit-3/cd481.jpg'), // local papkadan
            audioUrl: 'https://ukkibackend.soof.uz/media/audio/CD1-48-1.mp3',
            correctAnswer: true,
            description: 'Kompyuter'
        },
        {
            id: 2,
            image: require('../../../assets/images/unit-3/cd482.jpg'),
            audioUrl: 'https://ukkibackend.soof.uz/media/audio/CD1-48-2.mp3',
            correctAnswer: false,
            description: 'Velosiped'
        },
        {
            id: 3,
            image: require('../../../assets/images/unit-3/cd483.jpg'),
            audioUrl: 'https://ukkibackend.soof.uz/media/audio/CD1-48-3.mp3',
            correctAnswer: false,
            description: 'Qog\'irchoq'
        },
        {
            id: 4,
            image: require('../../../assets/images/unit-3/cd484.jpg'),
            audioUrl: 'https://ukkibackend.soof.uz/media/audio/CD1-48-4.mp3',
            correctAnswer: false,
            description: 'Rasm chizish to\'plami'
        }
    ];

    const currentItem = quizData[currentIndex];

    const playAudio = async () => {
        try {
            if (sound) {
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: currentItem.audioUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                }
            });
        } catch (error) {
            console.log('Audio yuklashda xatolik:', error);
            Alert.alert('Xatolik', 'Audio faylini yuklab bo\'lmadi');
        }
    };

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync();
            setIsPlaying(false);
        }
    };

    const checkAnswer = (userAnswer) => {
        const isCorrect = userAnswer === currentItem.correctAnswer;
        setResultText(isCorrect ? 'To\'g\'ri!' : 'Noto\'g\'ri!');
        setShowResult(true);

        setTimeout(() => {
            setShowResult(false);
            nextQuestion();
        }, 2000);
    };

    const nextQuestion = () => {
        if (currentIndex < quizData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setNextShow(true);
            //   Alert.alert('Quiz tugadi!', 'Barcha savollar yakunlandi.', [
            //     { text: 'Qaytadan boshlash', onPress: () => setCurrentIndex(0) }
            //   ]);
        }
        stopAudio();
    };

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return (
        <>
            {dictionary ? (
                <>

                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[

                                {
                                    word: "bike",
                                    translation: "velosiped",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
                                },
                                {
                                    word: "ball",
                                    translation: "koptok",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
                                },
                                {
                                    word: "kite",
                                    translation: "varrak",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
                                },
                                {
                                    word: "doll",
                                    translation: "qo'g'irchoq",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3",
                                },

                                {
                                    word: "computer",
                                    translation: "kompyuter",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/komputer.mp3",
                                },


                                {
                                    word: "art set",
                                    translation: "rasm chizish to'plami",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/rasmchizish toplami.mp3",
                                },

                            ]}
                        />

                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                { text: "Bike", audioUrl: "https://ukkibackend.soof.uz/media/audio/velosiped.mp3" },
                                { text: "Ball", audioUrl: "https://ukkibackend.soof.uz/media/audio/koptok.mp3" },
                                { text: "Kite", audioUrl: "https://ukkibackend.soof.uz/media/audio/varrak.mp3" },
                                { text: "Doll", audioUrl: "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3" },
                                { text: "Computer", audioUrl: "https://ukkibackend.soof.uz/media/audio/komputer.mp3" },
                                { text: "Art set", audioUrl: "https://ukkibackend.soof.uz/media/audio/rasmchizish toplami.mp3" },]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={[
                                "bike",
                                "ball",
                                "kite",
                                "doll",
                                "computer",
                                "art set",
                            ]}
                            audios={[
                                "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
                                "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
                                "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
                                "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3",
                                "https://ukkibackend.soof.uz/media/audio/komputer.mp3",
                                "https://ukkibackend.soof.uz/media/audio/rasmchizish toplami.mp3",]}
                        />
                    )}
                </>
            ) : (
                <View style={styles.container}>
                    <ThreeButtons
                        setDictionary={setDictionary}
                        infoClick={infoClick}
                        clicked={clicked}
                        setClicked={setClicked}
                        setInfoClick={setInfoClick}
                        audioUrl='https://ukkibackend.soof.uz/media/audio/aziz bolajon, suhbatlarni tingla va to’gri javobni belgila. .mp3'/>
                    <Text style={styles.questionText}>
                        Aytilgan rasm to'g'rimi?
                    </Text>

                    <View style={styles.imageContainer}>
                        <Image
                            source={currentItem.image}
                            style={styles.image}
                            resizeMode="stretch"
                        />

                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={isPlaying ? stopAudio : playAudio}
                        >
                            <Text style={styles.playButtonText}>
                                {isPlaying ? '⏸Pause' : '▶Play'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.correctButton]}
                            onPress={() => checkAnswer(true)}
                        >
                            <Text style={styles.buttonText}>✓</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.incorrectButton]}
                            onPress={() => checkAnswer(false)}
                        >
                            <Text style={styles.buttonText}>✗</Text>
                        </TouchableOpacity>
                    </View>

                    {showResult && (
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultText}>{resultText}</Text>
                        </View>
                    )}

                    <Text style={styles.progressText}>
                        {currentIndex + 1} / {quizData.length}
                    </Text>
                    {nextShow && (
                        <TouchableOpacity
                            style={Styles.NextButton}
                            onPress={next}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>)}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 40,
    },
    image: {
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#ddd',
    },
    playButton: {
        width: 120,
        // position: 'absolute',
        // top: -10,
        // left: 0,
        backgroundColor: 'rgba(16, 146, 38, 1)',
        // borderRadius: 25,
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        margin: 'auto',
        marginTop: 10,
    },
    playButtonText: {
        fontSize: 20,
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 50,
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    correctButton: {
        backgroundColor: '#4CAF50',
    },
    incorrectButton: {
        backgroundColor: '#F44336',
    },
    buttonText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    resultContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        marginHorizontal: 50,
        borderRadius: 10,
    },
    resultText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    progressText: {
        position: 'absolute',
        bottom: 50,
        fontSize: 18,
        color: '#666',
    },
});

export default AudioImageQuiz;
