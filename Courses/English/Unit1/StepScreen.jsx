import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ComponentTop from "../../../components/Utils/ComponentTop";
import Styles from "../../../Styles/Styles";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function StepScreen({ route, navigation }) {
    const { unitId, step, unitSteps, progress, setProgress } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);


    const currentStepIndex = unitSteps.findIndex(s => s.order === step.order);
    const isLastStep = currentStepIndex === unitSteps.length - 1;

    const goToNextStep = () => {
        setProgress((prev) => {
            let newProgress = { ...prev };
            if (step.order > prev.lastCompletedStep) {
                newProgress = {
                    unitId,
                    lastCompletedStep: step.order
                };
            }
            return newProgress;
        });
        if (isLastStep) {
            Alert.alert("Tabriklaymiz!", "Unit tugadi 🎉");
            navigation.goBack();
            return;
        }
        const nextStep = unitSteps[currentStepIndex + 1];
        navigation.replace("StepScreen", {
            unitId,
            step: nextStep,
            unitSteps,
            progress,
            setProgress,
        });
    };
    return (
        <View style={styles.container}>
            {!isPlaying && (
                <View style={Styles.ComponentTop}>
                    <ComponentTop text={step.title} />
                </View>
            )}
            {step.order === 1 && (
                <>
                    <Step1 isPlaying={isPlaying} setIsPlaying={setIsPlaying} next={goToNextStep} />
                    <TouchableOpacity style={styles.NextButton} onPress={goToNextStep}>
                        <Text style={styles.buttonText}>
                            {isLastStep ? "✅ Unit tugadi" : "➡ Keyingi step"}
                        </Text>
                    </TouchableOpacity>
                </>
            )}

            {step.order === 2 && (
                <Step2 next={goToNextStep} />
            )}
            {step.order === 3 && (
                <Step3 next={goToNextStep} />
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    content: { fontSize: 16, marginBottom: 20 },
    NextButton: {
        backgroundColor: "#FFD93D",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
});
