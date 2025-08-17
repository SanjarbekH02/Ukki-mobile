import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step6({ next }) {
    const [isPlayBtn, setIsPlayBtn] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [message, setMessage] = useState("");
    const [completed, setCompleted] = useState(false);
    const soundRef = useRef(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorCount, setErrorCount] = useState(0);

    const audios = [
        "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-03-3.mp3",
    ];

    const correctOrder = ["olivia", "tina", "david"];

    const playAudio = async (index) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: audios[index] },
                { shouldPlay: true }
            );
            soundRef.current = sound;
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setMessage("Kim gapirdi? Ustiga bosing");
                }
            });
        } catch (err) {
            console.log("Audio error", err);
        }
    };

    const handlePlay = () => {
        setIsPlayBtn(false);
        setMessage("");
        playAudio(currentStep);
    };

    const handleSelect = (name) => {
        if (correctOrder[currentStep] === name) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
            if (currentStep < correctOrder.length - 1) {
                // keyingi step
                setTimeout(() => {
                    setCurrentStep((prev) => prev + 1);
                    setMessage("");
                    playAudio(currentStep + 1);
                }, 1000);
            } else {
                // oxirgi step
                setCompleted(true);
            }
        } else {
            setIsError(true);
            setErrorCount((prev) => prev + 1);
            setTimeout(() => {
                setIsError(false);
            }, 2000);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <ThreeButtons setShowPointer={setIsPlayBtn} />

                <View style={styles.imageContainer}>
                    <Image
                        source={require("../../../assets/images/background.jpg")}
                        style={styles.image}
                    />

                    {/* Olivia */}
                    <TouchableOpacity
                        style={styles.olivia}
                        onPress={() => handleSelect("tina")}
                    >
                        <Image
                            source={require("../../../assets/images/tinaozi.png")}
                            style={{ width: 80, resizeMode: "contain" }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tina}
                        onPress={() => handleSelect("olivia")}
                    >
                        <Image
                            source={require("../../../assets/images/oliviaozi.png")}
                            style={{ width: 80, resizeMode: "contain" }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.david}
                        onPress={() => handleSelect("david")}
                    >
                        <Image
                            source={require("../../../assets/images/davidozi.png")}
                            style={{ width: 80, resizeMode: "contain" }}
                        />
                    </TouchableOpacity>

                    {isPlayBtn && (
                        <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
                            <Text style={{ color: "#fff", fontSize: 18 }}>▶ Play</Text>
                        </TouchableOpacity>
                    )}

                    {message ? (
                        <Text style={styles.message}>{message}</Text>
                    ) : null}

                    {completed && (
                        <TouchableOpacity style={styles.nextBtn} onPress={next}>
                            <Text style={{ color: "#fff", fontSize: 18 }}>Next ➡</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
        height: "90%",
        backgroundColor: "#eee",
        marginBottom: 95,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
    },
    olivia: {
        width: 80,
        position: "absolute",
        bottom: "20%",
        left: "10%",
    },
    tina: {
        width: 80,
        position: "absolute",
        bottom: "20%",
        left: "40%",
    },
    david: {
        width: 80,
        position: "absolute",
        bottom: "22%",
        right: "10%",
    },
    playBtn: {
        position: "absolute",
        top: "40%",
        backgroundColor: "tomato",
        padding: 15,
        borderRadius: 10,
    },
    nextBtn: {
        position: "absolute",
        bottom: "10%",
        backgroundColor: "green",
        padding: 15,
        borderRadius: 10,
    },
    message: {
        position: "absolute",
        top: "20%",
        fontSize: 20,
        fontWeight: "bold",
        color: "blue",
    },
});
