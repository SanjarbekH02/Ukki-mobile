import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step25({ next }) {
    const [recording, setRecording] = useState(null);
    const [result, setResult] = useState("");
    const [answer, setAnswer] = useState("");
    const [borderColor, setBorderColor] = useState("#fff");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [nextBtn, setNextBtn] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);
    const [infoClick, setInfoClick] = useState(false);
    const [showMic, setShowMic] = useState(false); // 🔥 Mic faqat audio tugaganda chiqadi
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioUrl =
        "https://ukkibackend.soof.uz/media/audio/1094f105-2868-46ba-8de9-0df2569dd9c7.ogg" ;

    const playAudio = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
            setSound(sound);
            setIsPlaying(true);

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    setShowMic(true);
                }
            });

            await sound.playAsync();
        } catch (err) {
            console.error("Audio play error:", err);
        }
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    // Recording start
    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                alert("Microphone permission required!");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const rec = new Audio.Recording();
            await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await rec.startAsync();
            setRecording(rec);
            setResult("");
            setAnswer("");
            setBorderColor("#ffcc00");
        } catch (err) {
            console.error("Recording error:", err);
        }
    };

    // Recording stop
    const stopRecording = async () => {
        try {
            if (!recording) return;
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            if (uri) {
                const text = await sendToSTT(uri);
                setResult(text);

                if (text?.toLowerCase().includes("wood")) {
                    setIsSuccess(true);
                    setTimeout(() => setIsSuccess(false), 2000);
                    setAnswer("✅ To‘g‘ri");
                    setBorderColor("green");
                    setTimeout(() => {
                        setNextBtn(true);
                        setAnswer("🎉 Zo‘r! Keyingiga o‘tishingiz mumkin.");
                    }, 1500);
                } else {
                    setIsError(true);
                    setTimeout(() => setIsError(false), 1000);
                    setAnswer("❌ Noto‘g‘ri, qaytadan urinib ko‘r");
                    setBorderColor("red");
                }
            }
        } catch (err) {
            console.error("Stop error:", err);
        }
    };

    // STT
    const sendToSTT = async (fileUri) => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri: fileUri,
                type: "audio/m4a",
                name: "recording.m4a",
            });

            const sttResponse = await fetch("https://stt.soof.uz/stt", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "accept-language": "en",
                },
                body: formData,
            });

            if (!sttResponse.ok) {
                throw new Error(`STT error: ${sttResponse.status}`);
            }

            const text = await sttResponse.text();
            console.log("STT natija:", text);
            return text;
        } catch (err) {
            console.error("STT error:", err);
            return "";
        }
    };

    return (
        <View style={styles.container}>
            <ThreeButtons
                setDictionary={setDictionary}
                infoClick={infoClick}
                clicked={clicked}
                setClicked={setClicked}
                setInfoClick={setInfoClick}
                audioUrl={audioUrl}
            />

            <Image
                style={styles.img}
                source={require("../../../assets/images/cd361.jpg")}
            />

            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
                {answer}
            </Text>

            {!isPlaying && !showMic && (
                <TouchableOpacity style={styles.playButton} onPress={playAudio}>
                    <Ionicons name="play" size={40} color="white" />
                </TouchableOpacity>
            )}

            {showMic && (
                <>
                <Text>WOOD - YOG’OCH</Text>
                    <TouchableOpacity
                        style={styles.micButton}
                        onPress={recording ? stopRecording : startRecording}
                    >
                        <Ionicons
                            name="mic"
                            size={40}
                            color={recording ? "red" : "black"}
                        />
                    </TouchableOpacity>
                </>
            )}

            {nextBtn && (
                <TouchableOpacity onPress={next} style={Styles.NextButton}>
                    <Text>Next</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    img: {
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
        position: "absolute",
        top: 0,
        left: 0,
    },

    playButton: {
        // position: "absolute",
        // top: 40,
        alignSelf: "center",
        backgroundColor: "#444",
        padding: 15,
        borderRadius: 50,
    },

    micButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        marginTop: 70,
    },
});
