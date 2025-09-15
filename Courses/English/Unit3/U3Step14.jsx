import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

const { width, height } = Dimensions.get('window');

export default function QuizGame({ next }) {
    const [showQuestion, setShowQuestion] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const correctAnswer = 'b'; // To'g'ri javob B varianti

    const handlePlay = () => {
        setShowQuestion(true);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        setShowResult(true);
    };

    const resetGame = () => {
        setShowQuestion(false);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    return (
        <View style={styles.container}>
            <ThreeButtons />
            <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />

            {/* Rasm */}
            <View style={styles.imageContainer}>
                <View
                    style={[
                        styles.imagePlaceholder,
                        showQuestion && {
                            width: width * 0.35,   // kichikroq qilyapmiz
                            height: width * 0.35,
                        }
                    ]}
                >
                    <Image
                        source={require('../../../assets/images/unit-3/student49.png')}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                </View>
            </View>


            {!showQuestion && (
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePlay}
                    activeOpacity={0.7}
                >
                    <Ionicons name="play" size={24} color="#fff" />

                    <Text style={styles.playButtonText}>PLAY</Text>
                </TouchableOpacity>
            )}

            {showQuestion && (
                <ScrollView style={styles.questionContainer}>
                    {/* Savol */}
                    <View style={styles.questionBox}>
                        <Text style={styles.questionText}>WHAT IS IT?</Text>
                        <Text style={styles.questionTranslation}>Bu nima?</Text>
                    </View>

                    <View style={styles.answersContainer}>
                        <TouchableOpacity
                            style={[
                                styles.answerButton,
                                selectedAnswer === 'a' && styles.selectedAnswer,
                                showResult && selectedAnswer === 'a' && correctAnswer !== 'a' && styles.wrongAnswer,
                                showResult && correctAnswer === 'a' && styles.correctAnswer
                            ]}
                            onPress={() => handleAnswer('a')}
                            disabled={showResult}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.answerText,
                                showResult && selectedAnswer === 'a' && correctAnswer !== 'a' && styles.wrongAnswerText,
                                showResult && correctAnswer === 'a' && styles.correctAnswerText
                            ]}>
                                a) It is a pen
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.answerButton,
                                selectedAnswer === 'b' && styles.selectedAnswer,
                                showResult && selectedAnswer === 'b' && correctAnswer !== 'b' && styles.wrongAnswer,
                                showResult && correctAnswer === 'b' && styles.correctAnswer
                            ]}
                            onPress={() => handleAnswer('b')}
                            disabled={showResult}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.answerText,
                                showResult && selectedAnswer === 'b' && correctAnswer !== 'b' && styles.wrongAnswerText,
                                showResult && correctAnswer === 'b' && styles.correctAnswerText
                            ]}>
                                b) It is a book
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Natija */}
                    {showResult && (
                        <View style={styles.resultContainer}>
                            <Text style={[
                                styles.resultText,
                                selectedAnswer === correctAnswer ? styles.correctText : styles.wrongText
                            ]}>
                                {selectedAnswer === correctAnswer ? 'TO\'G\'RI!' : 'NOTO\'G\'RI!'}
                            </Text>

                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetGame}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="refresh" size={20} color="#fff" />
                                <Text style={styles.resetButtonText}>QAYTA O'YNASH</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nextBtn} onPress={next}>
                                <Text style={styles.resetButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingTop: StatusBar.currentHeight + 20,
    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },
    imagePlaceholder: {
        width: width * 0.6,
        height: width * 0.6,
        maxWidth: 250,
        maxHeight: 250,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        borderWidth: 3,
        borderColor: '#e0e0e0',
    },
    imageText: {
        fontSize: 80,
        marginBottom: 10,
    },
    bookText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 3,
    },
    playButton: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        marginBottom: 20,
    },
    playButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        letterSpacing: 1,
    },
    questionContainer: {
        width: '100%',
        // alignItems: 'center',
    },
    questionBox: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        marginBottom: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.65,
        elevation: 8,
        borderWidth: 4,
        borderColor: '#2196F3',
        width: '100%',
    },
    questionText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 1,
    },
    questionTranslation: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    answersContainer: {
        width: '100%',
        marginBottom: 20,
    },
    answerButton: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 15,
    },
    selectedAnswer: {
        borderColor: '#2196F3',
        backgroundColor: '#e3f2fd',
    },
    correctAnswer: {
        borderColor: '#4CAF50',
        backgroundColor: '#e8f5e8',
    },
    wrongAnswer: {
        borderColor: '#f44336',
        backgroundColor: '#ffebee',
    },
    answerText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
    },
    correctAnswerText: {
        color: '#2e7d32',
    },
    wrongAnswerText: {
        color: '#c62828',
    },
    resultContainer: {
        alignItems: 'center',
        // marginTop: 20,
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 2,
    },
    correctText: {
        color: '#4CAF50',
    },
    wrongText: {
        color: '#f44336',
    },
    resetButton: {
        backgroundColor: '#FF9800',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
    nextBtn: {
        backgroundColor: '#FF9800',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
        marginTop: 10,
        marginBottom: 10
    }
});