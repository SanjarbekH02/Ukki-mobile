// ListenAndChooseGrid.jsx
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const DATA = [
    {
        id: "c1",
        prompt: "One. Book.",
        audio: "https://ukkibackend.soof.uz/media/audio/kitob_1.mp3",
        options: [
            {
                id: "c1a",
                label: "Book",
                image: require("../../../assets/images/workkitob.jpg"),
                correct: true,
            },
            {
                id: "c1b",
                label: "Pen",
                image: require("../../../assets/images/workruchka.jpg"),
                correct: false,
            },
        ],
    },
    {
        id: "c2",
        prompt: "Two. Window.",
        audio: "https://ukkibackend.soof.uz/media/audio/doska.mp3",
        options: [
            {
                id: "c2a",
                label: "Table",
                image: require("../../../assets/images/workderaza.jpg"),
                correct: false,
            },
            {
                id: "c2b",
                label: "Window",
                image: require("../../../assets/images/workdoska.jpg"),
                correct: true,
            },
        ],
    },
    {
        id: "c3",
        prompt: "Three. Bag.",
        audio: "https://ukkibackend.soof.uz/media/audio/stul.mp3",
        options: [
            {
                id: "c3a",
                label: "Chair",
                image: require("../../../assets/images/workochirgich.jpg"),
                correct: false,
            },
            {
                id: "c3b",
                label: "Bag",
                image: require("../../../assets/images/workstol.jpg"),
                correct: true,
            },
        ],
    },
    {
        id: "c4",
        prompt: "Four. Pencil.",
        audio: "https://ukkibackend.soof.uz/media/audio/qalamdon.mp3",
        options: [
            {
                id: "c4a",
                label: "Pencil",
                image: require("../../../assets/images/sariqkashalok.jpg"),
                correct: true,
            },
            {
                id: "c4b",
                label: "Ruler",
                image: require("../../../assets/images/kokqalam.jpg"),
                correct: false,
            },
        ],
    },
];
export default function ListenAndChooseGrid() {
    const [currentCol, setCurrentCol] = useState(0);
    const [selections, setSelections] = useState({});
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [allCorrect, setAllCorrect] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const soundRef = useRef(null);
    const navigation = useNavigation();
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)

    useEffect(() => {
        if (gameStarted) {
            playPrompt(currentCol);
        }
        return () => {
            cleanupSound();
        };
    }, [currentCol]);

    const cleanupSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }
        } catch { }
        setIsPlaying(false);
    };

    const playPrompt = async (index) => {
        await cleanupSound();
        try {
            const item = DATA[index];
            if (!item) return;
            const { sound } = await Audio.Sound.createAsync(
                { uri: item.audio },
                { shouldPlay: true }
            );
            soundRef.current = sound;
            setIsPlaying(true);
            sound.setOnPlaybackStatusUpdate((st) => {
                if (!st.isLoaded) return;
                if (st.didJustFinish) {
                    setIsPlaying(false);
                }
            });
        } catch (e) {
            setIsPlaying(false);
        }
    };

    const selectOption = (colIdx, optionId) => {
        if (!gameStarted) return;
        if (finished) return;
        if (colIdx !== currentCol) return;
        const col = DATA[colIdx];
        setSelections((prev) => ({ ...prev, [col.id]: optionId }));

        const next = colIdx + 1;
        if (next < DATA.length) {
            setCurrentCol(next);
        } else {
            setFinished(true);
        }
    };

    const checkAnswers = () => {
        const total = DATA.length;
        let correct = 0;
        DATA.forEach((col) => {
            const chosen = selections[col.id];
            const ok = col.options.find((o) => o.id === chosen)?.correct;
            if (ok) correct += 1;
        });
        setResult({ score: correct, total });

        if (correct === total) {
            setAllCorrect(true);
        } else {
            setAllCorrect(false);
            Alert.alert(
                "Tekshirish",
                `Natija: ${correct}/${total}. Qayta urinib ko‘rasizmi?`
            );
        }
    };

    const resetGame = async () => {
        await cleanupSound();
        setSelections({});
        setCurrentCol(0);
        setFinished(false);
        setResult(null);
        setAllCorrect(false);
        setGameStarted(false);
    };

    const renderColumn = ({ item, index }) => {
        const isActive = index === currentCol && !finished;
        return (
            <View style={styles.column}>
                <Text style={styles.colNumber}>{index + 1}</Text>
                {item.options.map((opt) => {
                    const checked = selections[item.id] === opt.id;
                    const disabled = !isActive && !checked;
                    return (
                        <TouchableOpacity
                            key={opt.id}
                            style={[
                                styles.card,
                                checked && styles.cardChecked,
                                disabled && styles.cardDisabled,
                            ]}
                            onPress={() => selectOption(index, opt.id)}
                            disabled={disabled}
                        >
                            <Image source={opt.image} style={styles.image} />
                            <View style={styles.row}>
                                <View
                                    style={[styles.checkbox, checked && styles.checkboxOn]}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {!gameStarted && (
                <View style={styles.overlay}>
                    <ThreeButtons
                    audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila_1.mp3"
                        setDictionary={setDictionary}
                        infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} />
                    <TouchableOpacity
                        style={styles.startBtn}
                        onPress={() => {
                            setGameStarted(true);
                            playPrompt(0);
                        }}
                    >
                        <Text style={styles.startText}>▶ Tinglang</Text>
                    </TouchableOpacity>
                </View>
            )}

            {gameStarted && (
                <>
                    <FlatList
                        data={DATA}
                        keyExtractor={(it) => it.id}
                        renderItem={renderColumn}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.grid}
                        style={{ width: "100%" }}
                    />

                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={[styles.checkBtn, !finished && styles.checkBtnDim]}
                            onPress={checkAnswers}
                            disabled={!finished}
                        >
                            <Text style={styles.checkText}>
                                ✅ Tekshirish {result ? `(${result.score}/${result.total})` : ""}
                            </Text>
                        </TouchableOpacity>

                        {finished && !allCorrect && (
                            <TouchableOpacity style={styles.retryBtn} onPress={resetGame}>
                                <Text style={styles.retryText}>↻ Qayta o‘ynash</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}

            {allCorrect && (
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => navigation.navigate("NextScreen")}
                    >
                        <Text style={styles.nextText}>➡ Next</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    grid: { paddingHorizontal: 12, paddingVertical: 16, gap: 12 },
    column: {
        width: "48%",
        alignItems: "stretch",
        marginRight: 12,
        flexDirection: "row",
    },
    colNumber: {
        textAlign: "center",
        marginBottom: 8,
        fontSize: 18,
        fontWeight: "700",
    },
    card: {
        width: "100%",
        backgroundColor: "#e7e7e7ff",
        borderRadius: 16,
        padding: 10,
        marginBottom: 12,
        marginRight: 12,
        borderWidth: 2,
        borderColor: "transparent",
    },
    cardChecked: { borderColor: "#22c55e", backgroundColor: "#ecfdf5" },
    cardDisabled: { opacity: 0.5 },
    image: { width: "100%", height: 90, resizeMode: "contain", marginBottom: 8 },
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#94a3b8",
        backgroundColor: "transparent",
    },
    checkboxOn: { backgroundColor: "#22c55e", borderColor: "#16a34a" },
    bottomBar: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        gap: 8,
    },
    checkBtn: {
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: "#16a34a",
        alignItems: "center",
    },
    checkBtnDim: { backgroundColor: "#86efac" },
    checkText: { color: "#fff", fontWeight: "700" },
    retryBtn: {
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        alignItems: "center",
    },
    retryText: { fontWeight: "600" },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    startBtn: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        backgroundColor: "#0ea5e9",
        borderRadius: 16,
    },
    startText: { color: "#fff", fontSize: 20, fontWeight: "700" },
    nextBtn: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        backgroundColor: "#3b82f6",
        borderRadius: 16,
    },
    nextText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
