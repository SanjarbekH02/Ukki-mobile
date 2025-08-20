import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NameGame from '../../../components/IsmTop';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import Styles from '../../../Styles/Styles';

export default function Step3({ next }) {
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
        1: "https://ukkibackend.soof.uz/media/audio/cd659513-0efb-45ac-bc55-207460a2805d.mp3",
        2: "https://ukkibackend.soof.uz/media/audio/cd659513-0efb-45ac-bc55-207460a2805d.mp3",
        3: "https://ukkibackend.soof.uz/media/audio/cd659513-0efb-45ac-bc55-207460a2805d.mp3",
        4: "https://ukkibackend.soof.uz/media/audio/CD1-03-5.mp3",
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
                    // ✅ audio tugaganda tugmani yashirish
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

    return (
        <View style={{ height: "100%", justifyContent: "center" }}>
            <View style={styles.container}>
                <ThreeButtons
                    setDictionary={setDictionary}
                    infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick}
                    setShowPointer={setShowPointer}
                    audioUrl="https://ukkibackend.soof.uz/media/audio/ddf40a8d-9519-42a3-8d00-4e3722302aa7.mp3"
                />

                <TouchableOpacity style={Styles.listenBtn}>
                    <Text style={Styles.listenNumber}>2</Text>
                    <Text style={Styles.listenText}>Listen. point, and say.</Text>
                </TouchableOpacity>

                <Image
                    source={require('../../../assets/images/step2.jpg')}
                    style={styles.step2Img}
                />

                {/* Button 1 */}
                {!hiddenButtons.includes(1) && (
                    <TouchableOpacity
                        onPress={() => { handlePlay(1); setSelectName("Olivia"); }}
                        style={[Styles.userNumber, Styles.userNumber1, buttonIndex === 1 && { borderWidth: 0, backgroundColor: 'inherit' }]}
                    >
                        {buttonIndex === 1 ? (
                            <LottieView
                                source={require('../../../assets/images/vois.json')}
                                autoPlay
                                loop
                                style={Styles.userNumberImage}
                            />
                        ) : (
                            <>
                                <Text style={Styles.userNumberText}>1</Text>
                                {showPointer && (
                                    <Animated.Image
                                        source={require("../../../assets/images/hand2.png")}
                                        style={[styles.pointer, { transform: [{ scale: scaleAnim }] }]}
                                    />
                                )}
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Button 2 */}
                {!hiddenButtons.includes(2) && (
                    <TouchableOpacity
                        onPress={() => { handlePlay(2); setSelectName("David"); }}
                        style={[Styles.userNumber, Styles.userNumber2, buttonIndex === 2 && { borderWidth: 0, backgroundColor: 'inherit' }]}
                    >
                        {buttonIndex === 2 ? (
                            <LottieView
                                source={require('../../../assets/images/vois.json')}
                                autoPlay
                                loop
                                style={Styles.userNumberImage}
                            />
                        ) : (
                            <Text style={Styles.userNumberText}>2</Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Button 3 */}
                {!hiddenButtons.includes(3) && (
                    <TouchableOpacity
                        onPress={() => { handlePlay(3); setSelectName("Tina"); }}
                        style={[Styles.userNumber, Styles.userNumber3, buttonIndex === 3 && { borderWidth: 0, backgroundColor: 'inherit' }]}
                    >
                        {buttonIndex === 3 ? (
                            <LottieView
                                source={require('../../../assets/images/vois.json')}
                                autoPlay
                                loop
                                style={Styles.userNumberImage}
                            />
                        ) : (
                            <Text style={Styles.userNumberText}>3</Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Button 4 */}
                {!hiddenButtons.includes(4) && (
                    <TouchableOpacity
                        onPress={() => { handlePlay(4); setSelectName("Leo"); }}
                        style={[Styles.userNumber, Styles.userNumber4, buttonIndex === 4 && { borderWidth: 0, backgroundColor: 'inherit' }]}
                    >
                        {buttonIndex === 4 ? (
                            <LottieView
                                source={require('../../../assets/images/vois.json')}
                                autoPlay
                                loop
                                style={Styles.userNumberImage}
                            />
                        ) : (
                            <Text style={Styles.userNumberText}>4</Text>
                        )}
                    </TouchableOpacity>
                )}

                {onAllCorrect && (
                    <TouchableOpacity onPress={next} style={[Styles.NextButton]}>

                        <Text style={Styles.listenText}>NEXT</Text>
                    </TouchableOpacity>
                )}

                <NameGame
                    setSelectName={setSelectName}
                    selectName={selectName}
                    onAllCorrect={setOnAllCorrect}
                />
            </View>
        </View>
    );
}

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
    pointer: {
        position: "absolute",
        left: 5,
        top: "50%",
        width: 40,
        height: 40,
        resizeMode: "contain",
        zIndex: 10,
    },
});
