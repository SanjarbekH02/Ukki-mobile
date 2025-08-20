import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

export default function Step7({ next }) {
    const [sound, setSound] = useState(null);
    const [recording, setRecording] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [completed, setCompleted] = useState([]);
    const [showMic, setShowMic] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // 🎤 yozib olish holati
    const [errorMessage, setErrorMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    // 🔥 oq to‘lqin animatsiyasi uchun
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.4,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    async function playSound(index) {
        try {
            setCurrentIndex(index);
            setShowMic(false);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });

            const { sound } = await Audio.Sound.createAsync({
                uri: `https://ukkibackend.soof.uz/media/audio/CD1-09-${index + 1}.mp3`,
            });

            setSound(sound);
            await sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setShowMic(true);
                }
            });
        } catch (err) {
            console.log("Audio play error", err);
        }
    }

    async function startRecording() {
        try {
            console.log("Recording start...");
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            setRecording(recording);
            setIsRecording(true); // 🔴 yozib olish holati yoqildi
        } catch (err) {
            console.log("Recording error", err);
        }
    }

    async function stopRecording() {
        try {
            console.log("Recording stop...");
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            setIsRecording(false); // 🔴 yozib olish tugadi
            setShowMic(false);

            await sendToSTT(uri);
        } catch (err) {
            console.log("Stop record error", err);
        }
    }

    async function sendToSTT(uri) {
        try {
            let formData = new FormData();
            formData.append("file", {
                uri,
                name: "audio.mp3",
                type: "audio/mpeg",
            });

            const sttResponse = await fetch("https://stt.soof.uz/stt", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "accept-language": "en",
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            });

            const data = await sttResponse.json();
            const text = data?.transcript?.toLowerCase().trim();

            console.log("STT Result:", text);

            if (text.includes(words[currentIndex])) {
                setCompleted((prev) => [...prev, currentIndex]);
                setSuccessMessage(true);
                setTimeout(() => setSuccessMessage(false), 2000);
            } else {
                setErrorMessage(true);
                setTimeout(() => setErrorMessage(false), 2000);
                setShowMic(true); // ❌ noto‘g‘ri bo‘lsa mic qaytadi
            }
        } catch (err) {
            console.log("STT send error", err);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <ThreeButtons />

                {words.map((w, i) =>
                    completed.includes(i) ? null : (
                        <TouchableOpacity
                            key={i}
                            style={[styles.bowlingBtn, { left: `${i * 9}%`, bottom: i % 2 === 0 ? "50%" : "33%" }]}
                            onPress={() => playSound(i)}
                        >
                            <View style={styles.bowlingBox}>
                                <Image source={require("../../../assets/images/bowling.png")} style={styles.image} />
                                <Text style={i === 9 ? styles.bowlingNumber10 : styles.bowlingNumber}>{i + 1}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                )}

                {/* 🎤 MIC tugma */}
                {showMic && !isRecording && (
                    <TouchableOpacity
                        style={styles.micBtn}
                        onPress={recording ? stopRecording : startRecording}
                    >
                        <Image source={require("../../../assets/images/mic.png")} style={{ width: 120, height: 120 }} />
                    </TouchableOpacity>
                )}

                {isRecording && (
                    <TouchableOpacity style={styles.micBtn} onPress={stopRecording}>
                        <View style={styles.recordingCircle}>
                            <Animated.View
                                style={[
                                    styles.wave,
                                    { transform: [{ scale: pulseAnim }] }
                                ]}
                            />
                            <View style={styles.innerCircle} />
                        </View>
                    </TouchableOpacity>
                )}

                {completed.length === words.length && (
                    <TouchableOpacity style={Styles.NextButton} onPress={next}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
            {successMessage && <ConfettiEffect />}
            {errorMessage && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "90%",
        justifyContent: "center",
        alignItems: "center",
    },
    bowlingBtn: {
        position: "absolute",
    },
    bowlingBox: {
        position: "relative",
        width: 70,
        height: 200,
    },
    image: {
        width: "100%",
        resizeMode: "contain",
    },
    bowlingNumber: {
        position: "absolute",
        bottom: "22%",
        left: "30%",
        color: "red",
        fontSize: 36,
        fontWeight: "bold",
    },
    bowlingNumber10: {
        position: "absolute",
        bottom: "22%",
        left: "17%",
        color: "red",
        fontSize: 34,
        fontWeight: "bold",
    },
    micBtn: {
        position: "absolute",
        bottom: 40,
    },
    recordingCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
    },
    wave: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "white",
        opacity: 0.6,
    },
    innerCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "white",
    },
});
