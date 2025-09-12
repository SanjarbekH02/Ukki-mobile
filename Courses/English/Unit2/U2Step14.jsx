import { Audio } from "expo-av";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WordPractice from "../../../components/Utils/Talaffuz";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import WordGameAssist from "../../../components/Utils/WordGame";
import FlashCards from "../../../components/YangiSozlar";

const questions = [
    {
        id: 1,
        image: require("../../../assets/images/wochmoq.jpg"),
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-1.mp3",
    },
    {
        id: 2,
        image: require("../../../assets/images/wotirmoq.jpg"),
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-2.mp3",
    },
    {
        id: 3,
        image: require("../../../assets/images/wolmoq.jpg"),
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-3.mp3",
    },
    {
        id: 4,
        image: require("../../../assets/images/wturmoq.jpg"),
        audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-4.mp3",
    },
];

export default function AudioQuiz({ next }) {
    const [sound, setSound] = useState(null);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState({});
    const [checked, setChecked] = useState(false);
    const [selectedBtns, setSelectedBtns] = useState([]);
    const [started, setStarted] = useState(false); // yangi state

    const playAudio = async (index) => {
        if (sound) {
            await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync({
            uri: questions[index].audio,
        });
        setSound(newSound);
        await newSound.playAsync();
    };

    const handleStart = () => {
        setStarted(true);
        playAudio(current);
    };

    const handleSelect = (imgId) => {
        setSelected({ ...selected, [current]: imgId });
        if (!selectedBtns.includes(imgId)) {
            setSelectedBtns([...selectedBtns, imgId]);
        }
        if (current < questions.length - 1) {
            setCurrent(current + 1);
            playAudio(current + 1);
        }
    };

    const handleCheck = () => setChecked(true);

    const handleTryAgain = () => {
        setSelectedBtns([]);
        setSelected({});
        setChecked(false);
        setCurrent(0);
        setStarted(false);
        if (sound) sound.unloadAsync();
    };

    const isAllCorrect = () =>
        questions.every((q, i) => selected[i] === q.id);

    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true);
    const [dictionary, setDictionary] = useState(false);
    const [wordgame, setWordgame] = useState(true)
    const [talaffuz, setTalaffuz] = useState(false)

    return (
        <>
            {dictionary ? (
                <>

                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[
                                { word: "Different ", translation: "Boshqacha", audioUrl: "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3" },
                                { word: "The same", translation: "Bir xil", audioUrl: "https://ukkibackend.soof.uz/media/audio/bir xil.mp3" },
                                { word: "Circle", translation: "Aylana", audioUrl: "https://ukkibackend.soof.uz/media/audio/aylana.mp3" },
                                { word: "Stand", translation: "Tik turmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3" },
                                { word: "Sit", translation: "O‘tirmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3" },
                                { word: "Read", translation: "O‘qimoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3" },
                                { word: "Bend down", translation: "Egilmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3" },
                                { word: "Boy", translation: "O‘g‘il bola", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3" },
                                { word: "Girl", translation: "Qiz bola", audioUrl: "https://ukkibackend.soof.uz/media/audio /qizbola.mp3" },
                                { word: "Look", translation: "Qaramoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3" },
                            ]}
                        />

                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                { text: "Different", audioUrl: "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3" },
                                { text: "The same", audioUrl: "https://ukkibackend.soof.uz/media/audio/bir xil.mp3" },
                                { text: "Circle", audioUrl: "https://ukkibackend.soof.uz/media/audio/aylana.mp3" },
                                { text: "Stand", audioUrl: "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3" },
                                { text: "Sit", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3" },
                                { text: "Read", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3" },
                                { text: "Bend down", audioUrl: "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3" },
                                { text: "Boy", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3" },
                                { text: "Girl", audioUrl: "https://ukkibackend.soof.uz/media/audio/qizbola.mp3" },
                                { text: "Look", audioUrl: "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3" },
                            ]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={["Different", "The same", "Circle", "Stand", "Sit", "Read", "Bend down", "Boy", "Girl", "Look"]}
                            audios={
                                [
                                    "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/bir xil.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/aylana.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/qizbola.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3",

                                ]
                            }
                        />
                    )}
                </>
            ) : (
                <View style={styles.container}>
                    <ThreeButtons
                        setDictionary={setDictionary}
                        infoClick={infoClick}
                        clicked={clicked}
                        setClicked={setClicked}
                        setInfoClick={setInfoClick}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila. .mp3"
                    />

                    {!started ? (
                        <TouchableOpacity style={styles.playBtn} onPress={handleStart}>
                            <Text style={styles.playText}>▶ Play</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <View style={styles.imagesRow}>
                                {questions.map((q, index) => (
                                    <View key={q.id} style={styles.card}>
                                        <Image source={q.image} style={styles.img} />
                                        <TouchableOpacity
                                            style={[
                                                styles.box,
                                                selectedBtns.includes(q.id) && styles.selectedBox,
                                            ]}
                                            onPress={() => handleSelect(q.id)}
                                            disabled={checked}
                                        >
                                            {checked && selected[index] === q.id ? (
                                                <Text style={styles.correct}>✔</Text>
                                            ) : checked && selected[index] && selected[index] !== q.id ? (
                                                <Text style={styles.incorrect}>✘</Text>
                                            ) : null}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            {!checked ? (
                                <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
                                    <Text style={styles.btnText}>Check</Text>
                                </TouchableOpacity>
                            ) : isAllCorrect() ? (
                                <TouchableOpacity onPress={next} style={styles.nextBtn}>
                                    <Text style={styles.btnText}>Next</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.tryBtn} onPress={handleTryAgain}>
                                    <Text style={styles.btnText}>Try Again</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
    imagesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    card: { margin: 10, alignItems: "center" },
    img: { width: 150, height: 120, resizeMode: "contain" },
    box: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: "#333",
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedBox: { borderColor: "blue", backgroundColor: "#e0f0ff" },
    correct: { fontSize: 22, color: "green" },
    incorrect: { fontSize: 22, color: "red" },
    checkBtn: {
        marginTop: 30,
        backgroundColor: "#2196F3",
        padding: 12,
        borderRadius: 8,
    },
    tryBtn: {
        marginTop: 30,
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8,
    },
    nextBtn: {
        marginTop: 30,
        backgroundColor: "green",
        padding: 12,
        borderRadius: 8,
    },
    btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

    // yangi play tugmasi
    playBtn: {
        backgroundColor: "#4CAF50",
        paddingVertical: 20,
        paddingHorizontal: 50,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    playText: { fontSize: 28, color: "#fff", fontWeight: "bold" },
});
