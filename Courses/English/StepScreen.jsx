import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import ComponentTop from "../../components/Utils/ComponentTop";
import Styles from "../../Styles/Styles";
import Step1 from "./Unit1/Step1";
import Step10 from "./Unit1/Step10";
import Step11 from "./Unit1/Step11";
import Step12 from "./Unit1/Step12";
import Step13 from "./Unit1/Step13";
import Step14 from "./Unit1/Step14";
import QABox from "./Unit1/Step15";
import Step16 from "./Unit1/Step16";
import Step17 from "./Unit1/Step17";
import Step18 from './Unit1/Step18';
import Step19 from "./Unit1/Step19";
import Step2 from "./Unit1/Step2";
import Step20 from "./Unit1/Step20";
import Step21 from "./Unit1/Step21";
import Step22 from "./Unit1/Step22";
import Step23 from "./Unit1/Step23";
import Step24 from "./Unit1/Step24";
import Step25 from "./Unit1/Step25";
import Step3 from "./Unit1/Step3";
import Step4 from "./Unit1/Step4";
import Step5 from "./Unit1/Step5";
import Step6 from "./Unit1/Step6";
import Step7 from "./Unit1/Step7";
import Step8 from "./Unit1/Step8";
import Step9 from "./Unit1/Step9";
import U2Step1 from "./Unit2/U2Step1";
import U2Step10 from "./Unit2/U2Step10";
import ClassroomCountGame from "./Unit2/U2Step11";
import U2Step12 from "./Unit2/U2Step12";
import U2Step13 from "./Unit2/U2Step13";
import AudioQuiz from "./Unit2/U2Step14";
import U2Step2 from "./Unit2/U2Step2";
import U2Step3 from "./Unit2/U2Step3";
import U2Step4 from "./Unit2/U2Step4";
import U2Step5 from "./Unit2/U2Step5";
import ListenAndChooseGrid from "./Unit2/U2Step6";
import MatchPairsGame from "./Unit2/U2Step7";
import U2Step8 from "./Unit2/U2Step8";
import U2Step9 from "./Unit2/U2Step9";

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
            {!isPlaying && step.order !== 14 && unitId !== 1 &&(
                <View style={Styles.ComponentTop}>
                    <ComponentTop text={step.title} />
                </View>
            )}
            {unitId === 1 && step.order === 1 && (<>
                <Step1 isPlaying={isPlaying} setIsPlaying={setIsPlaying} next={goToNextStep} />
                {/* <TouchableOpacity style={styles.NextButton} onPress={goToNextStep}>
                        <Text style={styles.buttonText}>
                            {isLastStep ? "✅ Unit tugadi" : "➡ Keyingi step"}
                        </Text>
                    </TouchableOpacity> */}
            </>
            )}

            {unitId === 1 && step.order === 2 && (
                <Step2 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 3 && (
                <Step3 next={goToNextStep} />
                // <FlashCards
                //     data={[
                //         { word: "Hello", translation: "Salom", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3" },
                //         { word: "Bye", translation: "Hayr", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                //     ]}
                // />
            )}

            {unitId === 1 && step.order === 4 && (
                <Step4 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 5 && (
                <Step5 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 6 && (
                <Step6 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 7 && (
                <Step7 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 8 && (
                <Step8 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 9 && (
                <Step9 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 10 && (
                <Step10 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 11 && (
                <Step11 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 12 && (
                <Step12 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 13 && (
                <Step13 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 14 && (
                <Step14 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 15 && (
                <QABox next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 16 && (
                <Step16 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 17 && (
                <Step17 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 18 && (
                <Step18 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 19 && (
                <Step19 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 20 && (
                <Step20 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 21 && (
                <Step21 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 22 && (
                <Step22 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 23 && (
                <Step23 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 24 && (
                <Step24 next={goToNextStep} />
            )}
            {unitId === 1 && step.order === 25 && (
                <Step25 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 1 && (
                <U2Step1 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 2 && (
                <U2Step2 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 3 && (
                <U2Step3 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 4 && (
                <U2Step4 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 5 && (
                <U2Step5 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 6 && (
                <ListenAndChooseGrid next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 7 && (
                <MatchPairsGame next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 8 && (
                <U2Step8 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 9 && (
                <U2Step9 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 10 && (
                <U2Step10 isPlaying={isPlaying} setIsPlaying={setIsPlaying} next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 11 && (
                <ClassroomCountGame next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 12 && (
                <U2Step12 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 13 && (
                <U2Step13 next={goToNextStep} />
            )}
            {unitId === 2 && step.order === 14 && (
                <AudioQuiz next={goToNextStep} />
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
