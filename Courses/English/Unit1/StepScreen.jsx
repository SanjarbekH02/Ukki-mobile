import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ComponentTop from "../../../components/Utils/ComponentTop";
import Styles from "../../../Styles/Styles";
import Step1 from "./Step1";
import Step10 from "./Step10";
import Step11 from "./Step11";
import Step12 from "./Step12";
import Step13 from "./Step13";
import Step14 from "./Step14";
import QABox from "./Step15";
import Step16 from "./Step16";
import Step17 from "./Step17";
import Step18 from './Step18';
import Step19 from "./Step19";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";

export default function StepScreen({ route, navigation }) {
    const { unitId, step, unitSteps, progress, setProgress } = route.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(true)


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
            {!isPlaying && step.order !== 14 && (
                <View style={Styles.ComponentTop}>
                    <ComponentTop text={step.title} />
                </View>
            )}
            {step.order === 1 && (
                <>
                    <Step1 isPlaying={isPlaying} setIsPlaying={setIsPlaying} next={goToNextStep} />
                    {/* <TouchableOpacity style={styles.NextButton} onPress={goToNextStep}>
                        <Text style={styles.buttonText}>
                            {isLastStep ? "✅ Unit tugadi" : "➡ Keyingi step"}
                        </Text>
                    </TouchableOpacity> */}
                </>
            )}

            {step.order === 2 && (
                <Step2 next={goToNextStep} />
            )}
            {step.order === 3 && (
                <Step3 next={goToNextStep} />
                // <FlashCards
                //     data={[
                //         { word: "Hello", translation: "Salom", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3" },
                //         { word: "Bye", translation: "Hayr", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                //     ]}
                // />
            )}

            {step.order === 4 && (
                <Step4 next={goToNextStep} />
            )}
            {step.order === 5 && (
                <Step5 next={goToNextStep} />
            )}
            {step.order === 6 && (
                <Step6 next={goToNextStep} />
            )}
            {step.order === 7 && (
                <Step7 next={goToNextStep} />
            )}
            {step.order === 8 && (
                <Step8 next={goToNextStep} />
            )}
            {step.order === 9 && (
                <Step9 next={goToNextStep} />
            )}
            {step.order === 10 && (
                <Step10 next={goToNextStep} />
            )}
            {step.order === 11 && (
                <Step11 next={goToNextStep} />
            )}
            {step.order === 12 && (
                <Step12 next={goToNextStep} />
            )}
            {step.order === 13 && (
                <Step13 next={goToNextStep} />
            )}
            {step.order === 14 && (
                <Step14 next={goToNextStep} />
            )}
            {step.order === 15 && (
                <QABox next={goToNextStep} />
            )}
            {step.order === 16 && (
                <Step16 next={goToNextStep}/>
            )}
            {step.order === 17 && (
                <Step17 next={goToNextStep} />
            )}
            {step.order === 18 && (
                <Step18 next={goToNextStep} />
            )}
            {step.order === 19 && (
                <Step19 next={goToNextStep} />
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
