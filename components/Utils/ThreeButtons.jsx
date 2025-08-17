import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../Styles/Styles";

function ThreeButtons({setShowPointer, audioUrl = "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3", setIsPlaying, playBtn }) {
    const [clicked, setClicked] = useState(false);
    const [isButton, setIsButton] = useState(false);

    const pointerScale = useRef(new Animated.Value(1)).current;
    const pointerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!clicked) {
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
    }, [clicked]);

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
                    setIsButton(true);
                    setShowPointer(true)
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log("Audio play error:", error);
        }
    };

    return (
        <View style={styles.buttonsBLock}>
            {isButton && playBtn && (
                <TouchableOpacity onPress={() => setIsPlaying(true)} style={styles.playBtn}>
                    <Text style={Styles.buttonText}>Play</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                {/* Soroq belgisi */}
                <Image
                    style={styles.buttonImage}
                    source={require("../../assets/images/soroq.png")}
                />

                {/* Qo'l rasmi */}
                {!clicked && (
                    <Animated.Image
                        style={[
                            styles.handImage,
                            { transform: [{ scale: pointerScale }], opacity: pointerOpacity },
                        ]}
                        source={require("../../assets/images/hand2.png")}
                    />
                )}
            </TouchableOpacity>
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
        zIndex:100
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
        top: 30,
        zIndex: 2,
    },
});

export default ThreeButtons;
