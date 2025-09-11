import { Audio } from 'expo-av';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ErrorOverlay from '../../../components/Utils/OnError';
import ConfettiEffect from '../../../components/Utils/Success';
import WordPractice from '../../../components/Utils/Talaffuz';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import WordGameAssist from '../../../components/Utils/WordGame';
import FlashCards from '../../../components/YangiSozlar';
import Styles from '../../../Styles/Styles';

const audioLinks = [
    "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_11_1.mp3",
    "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_11_2.mp3",
    "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_11_3.mp3",
    "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_11_4.mp3"
];

const correctAnswers = [
    { index: 0, value: '7' },
    { index: 1, value: '6' },
    { index: 2, value: '9' },
    { index: 3, value: '3' }
];

export default function Step11({ next }) {
    const [inputs, setInputs] = useState(['', '', '', '']);
    const [feedback, setFeedback] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [soundObject, setSoundObject] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [showCheckButton, setShowCheckButton] = useState(false);
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true);
    const [dictionary, setDictionary] = useState(false);
    const [wordgame, setWordgame] = useState(true);
    const [talaffuz, setTalaffuz] = useState(false);

    const handlePlay = async (index) => {
        if (soundObject) {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
            setSoundObject(null);
        }
        const { sound } = await Audio.Sound.createAsync(
            { uri: audioLinks[index] },
            { shouldPlay: true }
        );
        setSoundObject(sound);
        sound.playAsync();
        setFeedback('');
    };

    const handleInputChange = (text, inputIndex) => {
        const newInputs = [...inputs];
        newInputs[inputIndex] = text;
        setInputs(newInputs);

        const correctInputIndex = correctAnswers[currentIndex].index;
        if (inputIndex === correctInputIndex && text.length > 0) {
            setShowCheckButton(true);
        } else if (inputIndex === correctInputIndex && text.length === 0) {
            setShowCheckButton(false);
        }
    };

    const handleCheck = (inputIndex) => {
        const correctInputIndex = correctAnswers[currentIndex].index;
        const correctValue = correctAnswers[currentIndex].value;

        if (inputIndex !== correctInputIndex) {
            setFeedback('❌ Notog\'ri rasm!');
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
            }, 1000);
            return;
        }

        if (inputs[inputIndex] === correctValue) {
            setFeedback('✅ To\'g\'ri!');
            setIsSuccess(true);
            setShowCheckButton(false);
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
            if (currentIndex < audioLinks.length - 1) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                handlePlay(nextIndex);
            } else {
                setFeedback('🎉 Barcha topshiriqlar tugadi!');
            }
        } else {
            setFeedback('❌ Notog\'ri raqam!');
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
            }, 1000);
        }
    };

    const renderCheckButton = () => {
        const correctInputIndex = correctAnswers[currentIndex].index;
        if (showCheckButton) {
            return (
                <TouchableOpacity
                    style={styles.checkBtn}
                    onPress={() => handleCheck(correctInputIndex)}
                >
                    <Text style={styles.checkBtnText}>Check</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };


    const areAllAnswersCorrect = () => {
        return correctAnswers.every(
            ans => inputs[ans.index] === ans.value
        );
    };

    return (
        <>
            {dictionary ? (
                <>
                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[
                                { word: "Boy", translation: "o'g'il bola", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3" },
                                { word: "Girl", translation: "Qiz bola", audioUrl: "https://ukkibackend.soof.uz/media/audio/qizbola.mp3" },
                                { word: "Cap", translation: "Kepka", audioUrl: "https://ukkibackend.soof.uz/media/audio/kepka.mp3" },
                                { word: "T-Shift", translation: "Futbolka", audioUrl: "https://ukkibackend.soof.uz/media/audio/fudbolka.mp3" },
                                { word: "Number", translation: "Raqam", audioUrl: "https://ukkibackend.soof.uz/media/audio/raqam.mp3" },
                                { word: "Write", translation: "Yozmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/yozmoq.mp3" },
                                { word: "Picture", translation: "Rasm", audioUrl: "https://ukkibackend.soof.uz/media/audio/rasm.mp3" }
                            ]}
                        />
                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                { text: "Boy", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3" },
                                { text: "Girl", audioUrl: "https://ukkibackend.soof.uz/media/audio/qizbola.mp3" },
                                { text: "Cap", audioUrl: "https://ukkibackend.soof.uz/media/audio/kepka.mp3" },
                                { text: "T-Shift", audioUrl: "https://ukkibackend.soof.uz/media/audio/fudbolka.mp3" },
                                { text: "Number", audioUrl: "https://ukkibackend.soof.uz/media/audio/raqam.mp3" },
                                { text: "Write", audioUrl: "https://ukkibackend.soof.uz/media/audio/yozmoq.mp3" },
                                { text: "Picture", audioUrl: "https://ukkibackend.soof.uz/media/audio/rasm.mp3" }
                            ]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={["Boy", "Girl", "Cap", "T-Shift", "Number", "Write", "Picture"]}
                            audios={[
                                "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3",
                                "https://ukkibackend.soof.uz/media/audio/qizbola.mp3",
                                "https://ukkibackend.soof.uz/media/audio/kepka.mp3",
                                "https://ukkibackend.soof.uz/media/audio/fudbolka.mp3",
                                "https://ukkibackend.soof.uz/media/audio/raqam.mp3",
                                "https://ukkibackend.soof.uz/media/audio/yozmoq.mp3",
                                "https://ukkibackend.soof.uz/media/audio/rasm.mp3"
                            ]}
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
                        audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, kel suhbatni tinglaymiz va kerakli raqamlarni belgilaymiz. .mp3"
                    />

                    <TouchableOpacity
                        style={styles.playBtn}
                        onPress={() => handlePlay(currentIndex)}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>Play Audio {currentIndex + 1}</Text>
                    </TouchableOpacity>

                    <View style={styles.imageBlock}>
                        <View style={styles.imageWrapper}>
                            <Image style={styles.image} source={require('../../../assets/images/userball.jpg')} />
                            <TextInput
                                style={[styles.input, { left: 5 }]}
                                maxLength={2}
                                keyboardType="numeric"
                                returnKeyType="done"
                                value={inputs[0]}
                                onChangeText={(text) => handleInputChange(text, 0)}
                            />
                        </View>

                        <View style={styles.imageWrapper}>
                            <Image style={styles.image} source={require('../../../assets/images/userBook.jpg')} />
                            <TextInput
                                style={[styles.input, { right: 5 }]}
                                maxLength={2}
                                keyboardType="numeric"
                                returnKeyType="done"
                                value={inputs[1]}
                                onChangeText={(text) => handleInputChange(text, 1)}
                            />
                        </View>
                    </View>

                    <View style={styles.imageBlock}>
                        <View style={styles.imageWrapper}>
                            <Image style={styles.image} source={require('../../../assets/images/userCap.jpg')} />
                            <TextInput
                                style={[styles.input, { left: 5 }]}
                                maxLength={2}
                                keyboardType="numeric"
                                returnKeyType="done"
                                value={inputs[2]}
                                onChangeText={(text) => handleInputChange(text, 2)}
                            />
                        </View>

                        <View style={styles.imageWrapper}>
                            <Image style={styles.image} source={require('../../../assets/images/userChups.jpg')} />
                            <TextInput
                                style={[styles.input, { right: 0 }]}
                                maxLength={2}
                                keyboardType="numeric"
                                returnKeyType="done"
                                value={inputs[3]}
                                onChangeText={(text) => handleInputChange(text, 3)}
                            />
                        </View>
                    </View>

                    {renderCheckButton()}

                    {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

                    {areAllAnswersCorrect() && (
                        <TouchableOpacity onPress={next} style={Styles.NextButton}>
                            <Text>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '90%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    playBtn: {
        backgroundColor: '#1d5affff',
        padding: 10,
        borderRadius: 10
    },
    imageBlock: {
        width: '100%',
        height: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 20,
    },
    imageWrapper: {
        width: '40%',
        height: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
        borderRadius: 10,
    },
    input: {
        position: 'absolute',
        top: 5,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#999',
        textAlign: 'center',
        fontSize: 16,
        padding: 0,
    },
    checkBtn: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginTop: 15,
        marginBottom: 10,
    },
    checkBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    feedback: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
