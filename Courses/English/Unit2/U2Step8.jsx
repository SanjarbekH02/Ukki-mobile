import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const questions = [
    {
        id: 1,
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-27-1.mp3",
        answer: "d",
        images: [
            { id: "a", src: require("../../../assets/images/cd273.png") },
            { id: "b", src: require("../../../assets/images/kokstol.jpg") },
            { id: "c", src: require("../../../assets/images/redDoor.jpg") },
            { id: "d", src: require("../../../assets/images/bu doska.jpg") },
            { id: "e", src: require("../../../assets/images/toqsariqkashalok.jpg") },
        ],
    },
    {
        id: 2,
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-27-2.mp3",
        answer: "e",
        images: [
            { id: "a", src: require("../../../assets/images/cd273.png") },
            { id: "b", src: require("../../../assets/images/kokstol.jpg") },
            { id: "c", src: require("../../../assets/images/redDoor.jpg") },
            { id: "d", src: require("../../../assets/images/bu doska.jpg") },
            { id: "e", src: require("../../../assets/images/toqsariqkashalok.jpg") },
        ],
    },
    {
        id: 3,
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-27-3.mp3",
        answer: "a",
        images: [
            { id: "a", src: require("../../../assets/images/cd273.png") },
            { id: "b", src: require("../../../assets/images/kokstol.jpg") },
            { id: "c", src: require("../../../assets/images/redDoor.jpg") },
            { id: "d", src: require("../../../assets/images/bu doska.jpg") },
            { id: "e", src: require("../../../assets/images/toqsariqkashalok.jpg") },
        ],
    },
    {
        id: 4,
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-27-4.mp3",
        answer: "c",
        images: [
            { id: "a", src: require("../../../assets/images/cd273.png") },
            { id: "b", src: require("../../../assets/images/kokstol.jpg") },
            { id: "c", src: require("../../../assets/images/redDoor.jpg") },
            { id: "d", src: require("../../../assets/images/bu doska.jpg") },
            { id: "e", src: require("../../../assets/images/toqsariqkashalok.jpg") },
        ],
    },
    {
        id: 5,
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-27-5.mp3",
        answer: "b",
        images: [
            { id: "a", src: require("../../../assets/images/cd273.png") },
            { id: "b", src: require("../../../assets/images/kokstol.jpg") },
            { id: "c", src: require("../../../assets/images/redDoor.jpg") },
            { id: "d", src: require("../../../assets/images/bu doska.jpg") },
            { id: "e", src: require("../../../assets/images/toqsariqkashalok.jpg") },
        ],
    },
];

export default function U2Step8({ next }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [message, setMessage] = useState("");
    const [filled, setFilled] = useState({});
    const soundRef = useRef(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    // 🔘 Play button state
    const [showPlayBtn, setShowPlayBtn] = useState(true);

    // 🔊 Qo‘l bilan audio chalish
    const playAudio = async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
            { uri: questions[currentQ].audio },
            { shouldPlay: false }
        );
        soundRef.current = sound;
        await sound.playAsync();
    };

    // 🔊 1-savol uchun avtomatik chalish (faqat play tugma bosilganda)
    const startFirstAudio = async () => {
        setShowPlayBtn(false); // tugmani yo'qotamiz
        if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
            { uri: questions[0].audio },
            { shouldPlay: true }
        );
        soundRef.current = sound;
    };

    const handleAnswer = async (choice) => {
        const correct = questions[currentQ].answer;
        if (choice === correct) {
            setMessage("✅ To‘g‘ri");
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);

            setFilled((prev) => ({
                ...prev,
                [questions[currentQ].id]: choice,
            }));

            setTimeout(async () => {
                if (currentQ < questions.length - 1) {
                    const nextQ = currentQ + 1;
                    setCurrentQ(nextQ);
                    setMessage("");

                    if (soundRef.current) {
                        await soundRef.current.stopAsync();
                        await soundRef.current.unloadAsync();
                    }
                    const { sound } = await Audio.Sound.createAsync(
                        { uri: questions[nextQ].audio },
                        { shouldPlay: true }
                    );
                    soundRef.current = sound;
                } else {
                    setMessage("🎉 Barchasi tugadi!");
                }
            }, 1000);
        } else {
            setMessage("❌ Noto‘g‘ri");
            setIsError(true);
            setTimeout(() => setIsError(false), 1000);
            playAudio();
        }
    };

    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);

    return (
        <>
            <View style={styles.container}>
                {showPlayBtn && (
                    <TouchableOpacity style={styles.playBtn} onPress={startFirstAudio}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>▶ Play</Text>
                    </TouchableOpacity>
                )}

                <ThreeButtons
                    audioUrl="https://ukkibackend.soof.uz/media/audio/Kel audioni tinglaymiz, va rasmlarni joylashtiramiz.mp3"
                    setDictionary={setDictionary}
                    infoClick={infoClick}
                    clicked={clicked}
                    setClicked={setClicked}
                    setInfoClick={setInfoClick}
                />

                <View style={styles.framesRow}>
                    {questions.map((q) => (
                        <View key={q.id} style={styles.frame}>
                            {filled[q.id] && (
                                <Image
                                    source={q.images.find((img) => img.id === filled[q.id]).src}
                                    style={styles.frameImg}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {message !== "" && <Text style={styles.message}>{message}</Text>}

                <View style={styles.imagesRow}>
                    {questions[currentQ].images.map((img) => (
                        <TouchableOpacity key={img.id} onPress={() => handleAnswer(img.id)}>
                            <Image source={img.src} style={styles.optionImg} />
                        </TouchableOpacity>
                    ))}
                </View>
                {message === "🎉 Barchasi tugadi!" && (
                    <TouchableOpacity onPress={next} style={Styles.NextButton}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    playBtn: {
        backgroundColor: "green",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    framesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 20,
    },
    frame: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    frameImg: { width: 70, height: 70, resizeMode: "cover" },
    imagesRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 20 },
    optionImg: {
        width: 70,
        height: 70,
        margin: 5,
        borderWidth: 1,
        borderColor: "gray",
    },
    message: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
