import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import { audioPlay } from "../../../constants/AudioPlay";
import Styles from "../../../Styles/Styles";

const buttonData = {
    1: "board",
    2: "door",
    3: "window",
    4: "desk",
    5: "chair",
    6: "pencil",
    7: "pencil case",
    8: "book",
    9: "eraser",
    10: "pen",
};

const U2Step2 = ({ next }) => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [hiddenButtons, setHiddenButtons] = useState([]);
    const [resultText, setResultText] = useState("");

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [showPointer, setShowPointer] = useState(false);
    const [showPointer2, setShowPointer2] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorCount, setErrorCount] = useState(0);

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.3,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scaleAnim.stopAnimation();
            scaleAnim.setValue(1);
        }
    }, [isRecording]);

    const buttonAudio = {
        1: "https://ukkibackend.soof.uz/media/audio/CD1-23-1.mp3",
        2: "https://ukkibackend.soof.uz/media/audio/CD1-23-2.mp3",
        3: "https://ukkibackend.soof.uz/media/audio/CD1-23-3.mp3",
        4: "https://ukkibackend.soof.uz/media/audio/CD1-23-4.mp3",
        5: "https://ukkibackend.soof.uz/media/audio/CD1-23-5.mp3",
        6: "https://ukkibackend.soof.uz/media/audio/CD1-23-6.mp3",
        7: "https://ukkibackend.soof.uz/media/audio/CD1-23-7.mp3",
        8:"https://ukkibackend.soof.uz/media/audio/CD1-23-8.mp3",
        9: "https://ukkibackend.soof.uz/media/audio/CD1-23-9.mp3",
        10: "https://ukkibackend.soof.uz/media/audio/CD1-23-10.mp3"
    };

    useEffect(() => {
        if (showPointer || showPointer2) {
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
    }, [showPointer, showPointer2]);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            setResultText("");
        } catch (err) {
            // console.error("Start recording error:", err);
        }
    };

    const stopRecording = async () => {
        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "audio/m4a",
                name: "recording.m4a",
            });

            const res = await fetch("https://stt.soof.uz/stt", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "accept-language": "en",
                },
                body: formData,
            });

            const data = await res.json();
            // console.log("STT response:", data);

            if ((data?.text || data?.transcript) && activeButton) {
                const recognized = (data.text || data.transcript).toLowerCase().trim();
                const correct = buttonData[activeButton].toLowerCase().trim();

                // console.log("Recognized:", recognized, " Correct:", correct);

                if (recognized.includes(correct)) {
                    setResultText(`✅ To‘g‘ri: ${correct}`);
                    setIsSuccess(true);
                    setTimeout(() => setIsSuccess(false), 2000);
                    setHiddenButtons([...hiddenButtons, activeButton]);
                    setActiveButton(null);
                } else {
                    setIsError(true);
                    setTimeout(() => setIsError(false), 1000);
                    setErrorCount((prev) => prev + 1);
                    setResultText(`❌ Noto‘g‘ri. To‘g‘ri: ${correct}`);
                }
            } else {
                setResultText("⚠️ Ovoz tanilmadi");
            }
        } catch (err) {
            // console.error("Stop recording error:", err);
        }
    };

    const handleButtonPress = (index) => {
        audioPlay(buttonAudio[index])
        if (hiddenButtons.includes(index)) return;
        setActiveButton(index);
        // startRecording();
    };

    const allCorrect = hiddenButtons.length === Object.keys(buttonData).length;

    return (
        <>
            <View style={{ height: "100%", justifyContent: "center" }}>
                <View style={styles.container}>
                    <ThreeButtons
                        setShowPointer={setShowPointer}
                        setInfoClick={() => { }}
                        infoClick={false}
                        clicked={false}
                        setClicked={() => { }}
                        setDictionary={() => { }}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/e4949dfd-4e72-449a-bba1-70de09457bed.mp3"
                    />

                    <Image
                        source={require("../../../assets/images/unit1,1.png")}
                        style={styles.step2Img}
                    />
                    {Object.keys(buttonData).map((key) => {
                        const index = Number(key);
                        if (hiddenButtons.includes(index)) return null;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.userNumber, styles[`userNumber${index}`]]}
                                onPress={() => handleButtonPress(index)}
                            >
                                <Text style={Styles.userNumberText}>{index}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    {activeButton && (
                        <View style={styles.micWrapper}>
                            <TouchableOpacity
                                style={styles.micButton}
                                onPress={isRecording ? stopRecording : startRecording}
                            >
                                <Animated.View
                                    style={{
                                        transform: [{ scale: isRecording ? scaleAnim : 1 }],
                                    }}
                                >
                                    <Ionicons
                                        name={isRecording ? "stop-circle" : "mic"}
                                        size={50}
                                        color={isRecording ? "red" : "black"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                            <Text style={{ marginTop: 8, color: "white" }}>
                                {isRecording ? "Speaking..." : "Tap to stop & check"}
                            </Text>
                        </View>
                    )}
                    {resultText !== "" && (
                        <Text style={styles.resultText}>{resultText}</Text>
                    )}

                    {/* NEXT tugmasi faqat hammasi tugaganida chiqadi */}
                    {allCorrect && (
                        <TouchableOpacity style={Styles.NextButton} onPress={next}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    )}
                    {errorCount >= 3 && (
                        <TouchableOpacity style={Styles.NextButton} onPress={next}>
                            <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
        height: "90%",
        backgroundColor: "#eee",
        marginBottom: 95,
    },
    step2Img: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
    },
    userNumber: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: "#7272728e",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        borderWidth: 1,
        borderColor: "#fff",
    },
    userNumber1: { top: "40%", left: "0%" },
    userNumber2: { top: "25%", left: "40%" },
    userNumber3: { top: "27%", right: "5%" },
    userNumber4: { bottom: "35%", left: "10%" },
    userNumber5: { bottom: "33%", left: "40%" },
    userNumber6: { bottom: "35%", right: "32%" },
    userNumber7: { bottom: "27%", left: "42%" },
    userNumber8: { bottom: "27%", right: "27%" },
    userNumber9: { bottom: "27%", right: "10%" },
    userNumber10: { bottom: "17%", right: "16%" },
    micWrapper: {
        position: "absolute",
        bottom: 60,
        alignSelf: "center",
        alignItems: "center",
    },
    micButton: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    resultText: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        fontSize: 18,
        fontWeight: "600",
        color: '#d3d3d3ff'
    },
    nextButton: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        backgroundColor: "#4CAF50",
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    nextButtonText: {
        color: "#000000ff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default U2Step2;
