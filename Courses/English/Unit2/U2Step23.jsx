import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function U2Step23({ next }) {
    const audios = [
        "https://ukkibackend.soof.uz/media/audio/CD1-37-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-37-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-37-3.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-37-4.mp3",
    ];

    const [playingIndex, setPlayingIndex] = useState(null);
    const [allPlayed, setAllPlayed] = useState(false);
    const [result, setResult] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const sound = useRef(new Audio.Sound());
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const images = [
        { id: 0, src: require("../../../assets/images/cd371.jpg"), name: "ruchka" },
        { id: 1, src: require("../../../assets/images/cd372.jpg"), name: "panda" },
        { id: 2, src: require("../../../assets/images/cd373.jpg"), name: "toshbaqa" },
        { id: 3, src: require("../../../assets/images/cd374.jpg"), name: "kitob" },
    ];

    const playSequential = async (index = 0) => {
        if (index >= audios.length) {
            setPlayingIndex(null);
            setAllPlayed(true);
            return;
        }

        try {
            await sound.current.unloadAsync();
            await sound.current.loadAsync({ uri: audios[index] });
            setPlayingIndex(index);
            await sound.current.playAsync();
            sound.current.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    playSequential(index + 1);
                }
            });
        } catch (e) {
            console.log("Audio error", e);
        }
    };

    const handleSelect = (item) => {
        if (!allPlayed) return;

        if (["ruchka", "kitob"].includes(item.name)) {
            if (!correctAnswers.includes(item.name)) {
                setCorrectAnswers([...correctAnswers, item.name]);
            }
            setResult("To‘g‘ri ✅");
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false)
            }, 2000)
        } else {
            setResult("Noto‘g‘ri ❌");
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
            }, 1000)
        }
    };

    return (
        <>
            <View style={Styles.stepContainer}>
                <ThreeButtons />

                {!allPlayed && playingIndex === null && (
                    <TouchableOpacity
                        style={styles.playBtn}
                        onPress={() => playSequential(0)}
                    >
                        <AntDesign name="play" size={28} color="white" />
                        <Text style={styles.playText}>Play</Text>
                    </TouchableOpacity>
                )}

                {allPlayed && (
                    <Text style={styles.question}>
                        "B" harfi bilan boshlangan rasmni toping.
                    </Text>
                )}

                <View style={styles.block}>
                    {images.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.btn}
                            onPress={() => handleSelect(item)}
                        >
                            <Image
                                style={[
                                    styles.image,
                                    playingIndex === idx && { transform: [{ scale: 1.2 }] },
                                ]}
                                source={item.src}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {result && <Text style={styles.result}>{result}</Text>}

                {correctAnswers.length === 2 && (
                    <TouchableOpacity style={styles.nextBtn} onPress={next}>
                        <Text style={styles.nextText}>Next ➡️</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    block: {
        flexWrap: "wrap",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        padding: 10,
        backgroundColor: "#ececec",
        marginTop: 20,
    },
    btn: {
        width: 150,
        height: 150,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
        borderRadius: 12,
    },
    playBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10B981",
        padding: 12,
        borderRadius: 10,
        alignSelf: "center",
        gap: 6,
    },
    playText: {
        color: "white",
        fontWeight: "bold",
    },
    question: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    result: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    nextBtn: {
        marginTop: 25,
        backgroundColor: "#3B82F6",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignSelf: "center",
    },
    nextText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
