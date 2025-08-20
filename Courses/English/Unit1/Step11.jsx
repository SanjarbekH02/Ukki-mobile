import { Audio } from 'expo-av';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ErrorOverlay from '../../../components/Utils/OnError';
import ConfettiEffect from '../../../components/Utils/Success';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import Styles from '../../../Styles/Styles';

const audioLinks = [
    "https://ukkibackend.soof.uz/media/audio/CD1-09-1.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-09-2.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-09-3.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-09-4.mp3",
];

const correctAnswers = [
    { index: 2, value: '3' },
    { index: 1, value: '5' },
    { index: 0, value: '4' },
    { index: 3, value: '8' },
];

export default function Step11({next}) {
    const [inputs, setInputs] = useState(['', '', '', '']);
    const [feedback, setFeedback] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [soundObject, setSoundObject] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

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
    };

    const handleCheck = (inputIndex) => {
        const correctInputIndex = correctAnswers[currentIndex].index;
        const correctValue = correctAnswers[currentIndex].value;

        if (inputIndex !== correctInputIndex) {
            setFeedback('❌ Notog‘ri rasm!');
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 1000)
            return;
        }

        if (inputs[inputIndex] === correctValue) {
            setFeedback('✅ To‘g‘ri!');
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false)
            }, 2000)
            if (currentIndex < audioLinks.length - 1) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                handlePlay(nextIndex);
            } else {
                setFeedback('🎉 Barcha topshiriqlar tugadi!');
            }
        } else {
            setFeedback('❌ Notog‘ri raqam!');
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 1000)
        }
    };

    return (
        <>
            <View style={styles.container}>
                <ThreeButtons />
                <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() => handlePlay(currentIndex)}
                >
                    <Text style={{color: '#fff', fontWeight: '600'}}>Play Audio {currentIndex + 1}</Text>
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
                            onSubmitEditing={() => handleCheck(0)}
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
                            onSubmitEditing={() => handleCheck(1)}
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
                            onSubmitEditing={() => handleCheck(2)}
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
                            onSubmitEditing={() => handleCheck(3)}
                        />
                    </View>
                </View>

                {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
            </View>
            <TouchableOpacity onPress={next} style={Styles.NextButton}>
                <Text>Next</Text>
            </TouchableOpacity>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    playBtn: {backgroundColor: '#1d5affff', padding: 10, borderRadius: 10, },
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
    feedback: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
