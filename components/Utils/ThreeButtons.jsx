import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../Styles/Styles";

function ThreeButtons({ setShowPointer, audioUrl = "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3", setIsPlaying, playBtn,
    clicked = false,
    infoClick = false,
    setClicked,
    setInfoClick,
    setDictionary
}) {

    const [isButton, setIsButton] = useState(false);

    const pointerScale = useRef(new Animated.Value(1)).current;
    const pointerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!clicked || infoClick) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pointerScale, {
                        toValue: 1.2,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pointerScale, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [clicked, infoClick ]);

    const handlePress = async () => {
        setClicked(true);
        Animated.timing(pointerOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    if (setShowPointer !== undefined) {
                        setShowPointer(true);
                    }
                    setIsButton(true);
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log("Audio play error:", error);
        }
    };

    const handleInfoClick = () => {
        setClicked(false)
        setInfoClick(false)
        setDictionary(true)
    }

    return (
        <View style={styles.buttonsBLock}>
            {isButton && playBtn && (
                <TouchableOpacity onPress={() => setIsPlaying(true)} style={styles.playBtn}>
                    <Text style={Styles.buttonText}>Play</Text>
                </TouchableOpacity>
            )}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleInfoClick}>
                    <Image
                        style={styles.buttonImage}
                        source={require("../../assets/images/undov.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    {/* Soroq belgisi */}
                    <Image
                        style={styles.buttonImage}
                        source={require("../../assets/images/soroq.png")}
                    />

                    {/* Qo'l rasmi */}

                </TouchableOpacity>
                {!clicked && (
                    <Animated.Image
                        style={[
                            styles.handImage,
                            { transform: [{ scale: pointerScale }], opacity: pointerOpacity },
                        ]}
                        source={require("../../assets/images/hand2.png")}
                    />
                )}

                {infoClick && (
                    <Animated.Image
                        style={[
                            styles.handImage2,
                            { transform: [{ scale: pointerScale }], opacity: pointerOpacity },
                        ]}
                        source={require("../../assets/images/hand2.png")}
                    />
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsBLock: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        top: 10,
        right: 0,
        zIndex: 100
    },
    playBtn: {
        backgroundColor: '#FFD93D',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        alignItems: "center",
        width: '40%',
        marginLeft: 100,
        // position: "fixed",
    },
    buttonsContainer: { backgroundColor: 'white', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, },
    button: {
        padding: 8,
        backgroundColor: "#fff",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    buttonImage: {
        margin: 5,
        width: 30,
        height: 30,
        zIndex: 1,
    },
    handImage: {
        width: 50,
        height: 70,
        position: "absolute",
        right: -15,
        bottom: -50,
        zIndex: 2,
    },
    handImage2: {
        width: 50,
        height: 70,
        position: "absolute",
        bottom: 13,
        right: -10,
        zIndex: 2,
    },
});

export default ThreeButtons;
