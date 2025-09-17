import { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Styles from '../../../Styles/Styles';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

const { width } = Dimensions.get('window');

const U3Step25 = ({ next }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [resultText, setResultText] = useState('');
    const [nextShow, setNextShow] = useState(false);
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true);

    const quizData = [
        {
            id: 1,
            image: require('../../../assets/images/unit-3/cd573.jpg'),
            correctAnswer: false,
            description: 'Kompyuter'
        },
        {
            id: 2,
            image: require('../../../assets/images/unit-3/cd574.jpg'),
            correctAnswer: true,
            description: 'Velosiped'
        },
        {
            id: 3,
            image: require('../../../assets/images/unit-3/cd575.jpg'),
            correctAnswer: false,
            description: 'Qog\'irchoq'
        },
        {
            id: 4,
            image: require('../../../assets/images/unit-3/cd576.jpg'),
            correctAnswer: true,
            description: 'Rasm chizish to\'plami'
        }
    ];

    const currentItem = quizData[currentIndex];

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
        }
    };

    return (
        <View style={styles.container}>
            <ThreeButtons
                setDictionary={() => {}}
                infoClick={infoClick}
                clicked={clicked}
                setClicked={setClicked}
                setInfoClick={setInfoClick}
                audioUrl={null} // audio URL olib tashlandi
            />
            <Text style={styles.questionText}>
                Bu elektirlimi?
            </Text>

            <View style={styles.imageContainer}>
                <Image
                    source={currentItem.image}
                    style={styles.image}
                    resizeMode="stretch"
                />
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 20 },
    questionText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
    imageContainer: { marginBottom: 40 },
    image: { width: width * 0.7, height: width * 0.7, borderRadius: 15, borderWidth: 3, borderColor: '#ddd' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingHorizontal: 50 },
    button: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', elevation: 3 },
    correctButton: { backgroundColor: '#4CAF50' },
    incorrectButton: { backgroundColor: '#F44336' },
    buttonText: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    resultContainer: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 20, marginHorizontal: 50, borderRadius: 10 },
    resultText: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    progressText: { position: 'absolute', bottom: 50, fontSize: 18, color: '#666' },
});

export default U3Step25;
