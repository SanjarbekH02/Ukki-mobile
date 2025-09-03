import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function U2Step13() {
    const [sound, setSound] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [result, setResult] = useState(null);
    const [gameFinished, setGameFinished] = useState(false);

    // Savollar ro‘yxati
    const questions = [
        {
            audio: "https://ukkibackend.soof.uz/media/audio/CD1-30-1.mp3",
            correct: 1,
            options: [
                require("../../../assets/images/otirmoq.png"),
                require("../../../assets/images/turmoq.png"), // to‘g‘ri
                require("../../../assets/images/kitobochmoq.png"),
                require("../../../assets/images/qalamsolmoq.png"),
            ],
        },
        {
            audio: "https://ukkibackend.soof.uz/media/audio/CD1-30-3.mp3",
            correct: 2,
            options: [
                require("../../../assets/images/otirmoq.png"),
                require("../../../assets/images/turmoq.png"),
                require("../../../assets/images/kitobochmoq.png"),
                require("../../../assets/images/qalamolmoq.png"),
            ],
        },
        {
            audio: "https://ukkibackend.soof.uz/media/audio/CD1-30-2.mp3",
            correct: 1,
            options: [
                require("../../../assets/images/turmoq.png"),
                require("../../../assets/images/otirmoq.png"),
                require("../../../assets/images/kitobochmoq.png"),
                require('../../../assets/images/kitobyoqmoq.png'),

            ],
        },
        {
            audio: "https://ukkibackend.soof.uz/media/audio/CD1-30-5.mp3",
            correct: 2,
            options: [
                require("../../../assets/images/turmoq.png"),
                require("../../../assets/images/otirmoq.png"),
                require("../../../assets/images/qalamolmoq.png"),
                require('../../../assets/images/kitobyoqmoq.png'),

            ],
        },
        {
            audio: "https://ukkibackend.soof.uz/media/audio/CD1-30-4.mp3",
            correct: 0,
            options: [
                require('../../../assets/images/kitobyoqmoq.png'),
                require("../../../assets/images/turmoq.png"),
                require("../../../assets/images/kitobochmoq.png"),
                require("../../../assets/images/otirmoq.png"),

            ],
        },
        {
            audio: "https://ukkibackend.soof.uz/media/audio/CD1-30-6.mp3",
            correct: 3,
            options: [
                require("../../../assets/images/kitobochmoq.png"),
                require("../../../assets/images/turmoq.png"),
                require('../../../assets/images/kitobyoqmoq.png'),
                require("../../../assets/images/qalamsolmoq.png"),

            ],
        },

    ];

    useEffect(() => {
        return () => {
            if (sound) sound.unloadAsync();
        };
    }, [sound]);

    const playAudio = async (uri) => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync({ uri });
            setSound(newSound);
            await newSound.playAsync();
        } catch (err) {
            console.log("Audio error:", err);
        }
    };

    const handleAnswer = (index) => {
        if (index === questions[currentQ].correct) {
            setResult("✅ To‘g‘ri!");
            if (currentQ < questions.length - 1) {
                setTimeout(() => {
                    setResult(null);
                    setCurrentQ((prev) => prev + 1);
                    playAudio(questions[currentQ + 1].audio);
                }, 1000);
            } else {
                setTimeout(() => {
                    setResult(null);
                    setGameFinished(true);
                }, 1000);
            }
        } else {
            setResult("❌ Noto‘g‘ri!");
            setTimeout(() => {
                playAudio(questions[currentQ].audio);
                setResult(null);
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            {!gameFinished && (
                <>
                    <TouchableOpacity
                        style={styles.playBtn}
                        onPress={() => playAudio(questions[currentQ].audio)}
                    >
                        <Text style={styles.playText}>▶ Audio</Text>
                    </TouchableOpacity>

                    <View style={styles.imgGrid}>
                        {questions[currentQ].options.map((img, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.imgBox}
                                onPress={() => handleAnswer(i)}
                            >
                                <Image source={img} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {result && (
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
                                {result}
                            </Text>
                        </View>
                    )}
                </>
            )}

            {gameFinished && (
                <View style={{ alignItems: "center", marginTop: 30 }}>
                    <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
                        🎉 Barcha savollar tugadi!
                    </Text>
                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => alert("Keyingi Step!")}
                    >
                        <Text style={styles.nextText}>Next ➜</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgGrid: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
    },
    imgBox: {
        width: "48%",
        aspectRatio: 1,
        marginVertical: 5,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
    },
    playBtn: {
        marginTop: 20,
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: "#ff9800",
        borderRadius: 10,
        alignSelf: "center",
    },
    playText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    nextBtn: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: "#4caf50",
        borderRadius: 10,
    },
    nextText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});
