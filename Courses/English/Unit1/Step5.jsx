import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const roles = ["Mandy", "Jack", "Penny"];

const dialogData = {
    Jack: [
        {
            app: "Hello, I’m Mandy. What’s your name?",
            options: ["Hello, I’m Jack.", "Hello, I’m Dino.", "I’m Penny."],
            correct: "Hello, I’m Jack.",
        },
        {
            app: "This is Penny.",
            options: ["Hello, Penny.", "Goodbye, Penny.", "I’m five."],
            correct: "Hello, Penny.",
        },
    ],
    Mandy: [
        {
            app: "Hello, I’m Jack. What’s your name?",
            options: ["Hello, I’m Mandy.", "I’m Dino.", "I’m Penny."],
            correct: "Hello, I’m Mandy.",
        },
        {
            app: "This is Penny.",
            options: ["Hello, Penny.", "Goodbye, Penny.", "I’m five."],
            correct: "Hello, Penny.",
        },
    ],
    Penny: [
        {
            app: "Hello, I’m Jack. What’s your name?",
            options: ["Hello, I’m Penny.", "I’m Dino.", "I’m Mandy."],
            correct: "Hello, I’m Penny.",
        },
        {
            app: "This is Mandy.",
            options: ["Hello, Mandy.", "Goodbye, Mandy.", "I’m five."],
            correct: "Hello, Mandy.",
        },
    ],
};

export default function RoleDialog({next}) {
    const [selectedRole, setSelectedRole] = useState(null);
    const [step, setStep] = useState(0);
    const [feedback, setFeedback] = useState(false);
    const [finished, setFinished] = useState(false);
    const [wrongCount, setWrongCount] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const handleAnswer = (answer) => {
        const current = dialogData[selectedRole][step];
        if (answer === current.correct) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
            if (step + 1 < dialogData[selectedRole].length) {
                setTimeout(() => {
                    setStep(step + 1);
                    setFeedback("");
                }, 1000);
            } else {
                setTimeout(() => {
                    setFinished(true);
                    setFeedback("");
                }, 1000);
            }
        } else {
            setWrongCount(wrongCount + 1);
            setFeedback(true);
            setTimeout(() => {
                setFeedback(false);
            }, 2000);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <ThreeButtons />
                {!selectedRole ? (
                    <>
                        <Text style={styles.title}>Rolni tanlang 👇</Text>
                        {roles.map((role) => (
                            <TouchableOpacity
                                key={role}
                                style={styles.roleBtn}
                                onPress={() => setSelectedRole(role)}
                            >
                                <Text style={styles.roleText}>{role}</Text>
                            </TouchableOpacity>
                        ))}
                    </>
                ) : finished ? (
                    <>
                        <Text style={styles.title}>🎉 Dialog tugadi!</Text>
                        <Text style={{ fontSize: 18, marginTop: 10 }}>
                            ❌ Noto‘g‘ri urinishlar soni: {wrongCount}
                        </Text>
                        <TouchableOpacity onPress={next} style={styles.nextBtn}>
                            <Text style={styles.nextText}>Next</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.appText}>
                            🗨 {dialogData[selectedRole][step].app}
                        </Text>
                        {dialogData[selectedRole][step].options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionBtn}
                                onPress={() => handleAnswer(option)}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </View>
            {feedback && <ErrorOverlay />}
            {isSuccess && <ConfettiEffect />}
        </>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#e1f5fe", },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    roleBtn: {
        backgroundColor: "#4e73df",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: "70%",
        alignItems: "center",
    },
    roleText: { color: "white", fontSize: 18 },
    appText: { fontSize: 20, marginBottom: 20, textAlign: "center" },
    optionBtn: {
        backgroundColor: "#f8f9fc",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginVertical: 5,
        width: "90%",
    },
    optionText: { fontSize: 18, textAlign: "center" },
    feedback: { marginTop: 10, fontSize: 16, fontWeight: "bold" },
    nextBtn: {
        marginTop: 20,
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 10,
    },
    nextText: { color: "white", fontSize: 18 },
});
