import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

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
    const [selectedBtns, setSelectedBtns] = useState([])

    useEffect(() => {
        playAudio(current);
        return () => {
            if (sound) sound.unloadAsync();
        };
    }, [current]);

    const playAudio = async (index) => {
        if (sound) await sound.unloadAsync();
        const { sound: newSound } = await Audio.Sound.createAsync({
            uri: questions[index].audio,
        });
        setSound(newSound);
        await newSound.playAsync();
    };

    const handleSelect = (imgId) => {
        setSelected({ ...selected, [current]: imgId });
        if (!selectedBtns.includes(imgId)) {
            setSelectedBtns([...selectedBtns, imgId]);
        }
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    };

    const handleCheck = () => {
        setChecked(true);
    };

    const handleTryAgain = () => {
        setSelectedBtns([])
        setSelected({});
        setChecked(false);
        setCurrent(0);
        playAudio(0);
    };

    const isAllCorrect = () =>
        questions.every((q, i) => selected[i] === q.id);

    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);
    return (
        <View style={styles.container}>
            <ThreeButtons
                setDictionary={setDictionary}
                infoClick={infoClick}
                clicked={clicked}
                setClicked={setClicked}
                setInfoClick={setInfoClick} audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila. .mp3" />
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
                <TouchableOpacity style={styles.nextBtn}>
                    <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.tryBtn} onPress={handleTryAgain}>
                    <Text style={styles.btnText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
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
});
