import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const data = [
    { question: "How are you?", answer: "I'm fine, thank you." },
    { question: "How old are you?", answer: "I'm five" },
    { question: "What's your favorite color?", answer: "My favorite color is red" },
    { question: "Is your favorite color yellow?", answer: "No, it's blue" },
];

// Shuffle funksiyasi
const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
};

export default function QABox({ }) {
    const [shuffledAnswers] = useState(shuffleArray(data.map((d) => d.answer)));
    const [selectedQ, setSelectedQ] = useState(null);
    const [selectedA, setSelectedA] = useState(null);
    const [result, setResult] = useState(null);
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)

    const [disabledQuestions, setDisabledQuestions] = useState([]);
    const [disabledAnswers, setDisabledAnswers] = useState([]);

    const handleSelectQ = (q) => {
        if (disabledQuestions.includes(q.question)) return;
        setSelectedQ(q);
        setSelectedA(null);
        setResult(null);
    };

    const handleSelectA = (a) => {
        if (!selectedQ) return;
        if (disabledAnswers.includes(a)) return;

        setSelectedA(a);

        if (selectedQ.answer === a) {
            setResult("correct");
            setDisabledQuestions([...disabledQuestions, selectedQ.question]);
            setDisabledAnswers([...disabledAnswers, a]);
            setSelectedQ(null);
            setSelectedA(null);
        } else {
            setResult("wrong");
            setTimeout(() => {
                setSelectedQ(null);
                setSelectedA(null);
                setResult(null);
            }, 1500);
        }
    };

    const allCorrect = disabledQuestions.length === data.length;

    return (
        <>
            <View style={Styles.stepContainer}>
                <TouchableOpacity style={Styles.listenBtn}>
                    <Text style={Styles.listenNumber}>11</Text>
                    <Text style={Styles.listenText}>Ask and answer</Text>
                </TouchableOpacity>

                <ThreeButtons
                    setDictionary={setDictionary}
                    infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick}
                    audioUrl="https://ukkibackend.soof.uz/media/audio/4afacf03-8c3b-4477-971a-1125121da03b.mp3" />

                <View style={styles.table}>
                    <View style={styles.col}>
                        {data.map((item, idx) => {
                            const disabled = disabledQuestions.includes(item.question);
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    disabled={disabled}
                                    style={[
                                        styles.box,
                                        selectedQ?.question === item.question && styles.selected,
                                        disabled && styles.disabled,
                                    ]}
                                    onPress={() => handleSelectQ(item)}
                                >
                                    <Text>{item.question}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.col}>
                        {shuffledAnswers.map((ans, idx) => {
                            const disabled = disabledAnswers.includes(ans);
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    disabled={disabled}
                                    style={[
                                        styles.box,
                                        selectedA === ans && styles.selected,
                                        disabled && styles.disabled,
                                    ]}
                                    onPress={() => handleSelectA(ans)}
                                >
                                    <Text>{ans}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Hamma to‘g‘ri topilganda Next tugmasi */}
                {allCorrect && (
                    <TouchableOpacity style={Styles.NextButton} onPress={() => alert("Next step! 🚀")}>
                        <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Natija */}
            {result === "correct" && <ConfettiEffect />}
            {result === "wrong" && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: "row", padding: 20, flex: 1 },
    table: { width: "100%", height: "50%", flexDirection: "row" },
    col: { flex: 1, marginHorizontal: 5 },
    box: {
        borderWidth: 1,
        padding: 10,
        height: 60,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    selected: { backgroundColor: "#d0f0c0" },
    disabled: { backgroundColor: "#ccc" },
    correct: { color: "green", fontSize: 18, textAlign: "center", marginTop: 20 },
    wrong: { color: "red", fontSize: 18, textAlign: "center", marginTop: 20 },
    nextBtn: {
        marginTop: 20,
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    nextText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
});
