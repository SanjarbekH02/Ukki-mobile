import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function U3Step16({ next }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [selected, setSelected] = useState({});
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [, setDictionary] = useState(false);
  const [showPointer, setShowPointer] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState({});
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;

  const steps = [
    {
      id: 1,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-53-1.mp3",
      imgA: require("../../../assets/images/unit-3/cd520.png"),
      imgB: require("../../../assets/images/unit-3/cd523.png"),
      correct: "a",
    },
    {
      id: 2,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-53-2.mp3",
      imgA: require("../../../assets/images/unit-3/cd522.png"),
      imgB: require("../../../assets/images/unit-3/cd521.png"),
      correct: "b",
    },
    {
      id: 3,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-53-3.mp3",
      imgA: require("../../../assets/images/unit-3/cd522.png"),
      imgB: require("../../../assets/images/unit-3/cd523.png"),
      correct: "b",
    },
    {
      id: 4,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-53-4.mp3",
      imgA: require("../../../assets/images/unit-3/cd525.png"),
      imgB: require("../../../assets/images/unit-3/cd524.png"),
      correct: "a",
    },
  ];

  useEffect(() => {
    if (showPointer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [showPointer, scaleAnim]);

  useEffect(() => {
    if (completed) {
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  },);

  async function playAudio(stepIndex) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      setIsPlaying(true);
      setSelected((prev) => ({ ...prev, [steps[stepIndex].id]: null }));

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: steps[stepIndex].audio,
      });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setShowPointer(false);
          setAudioPlayed((prev) => ({ ...prev, [steps[stepIndex].id]: true }));
        }
      });

      await newSound.playAsync();
    } catch (_) {
      setIsPlaying(false);
    }
  }

  const handleSelection = (stepId, choice) => {
    if (
      !isPlaying &&
      (selected[stepId] === null || selected[stepId] === undefined) &&
      currentStep === stepId - 1 &&
      audioPlayed[stepId]
    ) {
      setSelected((prev) => ({ ...prev, [stepId]: choice }));
      setShowPointer(false);

      const currentIndex = steps.findIndex((s) => s.id === stepId);
      if (currentIndex < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(currentIndex + 1);
          playAudio(currentIndex + 1);
        }, 1000);
      } else {
        setCompleted(true);
      }
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSound(null);
    setSelected({});
    setCompleted(false);
    setShowPointer(true);
    setAudioPlayed({});
    translateYAnim.setValue(Dimensions.get("window").height);
  };

  const handleNext = () => {
    if (next) {
      next();
    }
  };

  const replayAudio = () => {
    if (!isPlaying && audioPlayed[currentStepData.id]) {
      playAudio(currentStep);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <ThreeButtons
        setShowPointer={setShowPointer}
        audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila. .mp3"
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
      />

      {completed ? (
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <Text style={styles.scoreText}>
            Siz 4 ta savoldan{" "}
            {steps.filter((step) => selected[step.id] === step.correct).length}{" "}
            ta to‘g‘ri javob berdingiz
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.restartButton} onPress={restart}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <View style={styles.imagesContainer}>
          {(isPlaying ||
            (audioPlayed[currentStepData.id] &&
              (selected[currentStepData.id] === null ||
                selected[currentStepData.id] === undefined))) && (
            <Text style={styles.promptText}>
              Suhbat qaysi rasm haqida ketmoqda?
            </Text>
          )}
          <View key={currentStepData.id} style={styles.imgBlock}>
            <TouchableOpacity
              onPress={() => handleSelection(currentStepData.id, "a")}
              style={styles.imgBtn}
              disabled={isPlaying || !audioPlayed[currentStepData.id]}
            >
              <View style={styles.letterBoxA}>
                <Text style={styles.letterText}>a</Text>
              </View>
              <Image style={styles.image} source={currentStepData.imgA} />
              <View style={styles.feedbackBox}>
                {selected[currentStepData.id] === "a" && (
                  <Text
                    style={[
                      styles.checkmark,
                      {
                        color:
                          currentStepData.correct === "a"
                            ? "#28a745"
                            : "#dc3545",
                      },
                    ]}
                  >
                    {currentStepData.correct === "a" ? "\u2713" : "\u2717"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelection(currentStepData.id, "b")}
              style={styles.imgBtn}
              disabled={isPlaying || !audioPlayed[currentStepData.id]}
            >
              <View style={styles.letterBoxB}>
                <Text style={styles.letterText}>b</Text>
              </View>
              <Image style={styles.image} source={currentStepData.imgB} />
              <View style={styles.feedbackBox}>
                {selected[currentStepData.id] === "b" && (
                  <Text
                    style={[
                      styles.checkmark,
                      {
                        color:
                          currentStepData.correct === "b"
                            ? "#28a745"
                            : "#dc3545",
                      },
                    ]}
                  >
                    {currentStepData.correct === "b" ? "\u2713" : "\u2717"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Play/Replay Button Logic */}
          {!isPlaying &&
            (selected[currentStepData.id] === null ||
              selected[currentStepData.id] === undefined) && (
              <View style={styles.buttonRow}>
                {!audioPlayed[currentStepData.id] ? (
                  <TouchableOpacity
                    onPress={() => playAudio(currentStep)}
                    style={styles.playButton}
                  >
                    <Text style={styles.playText}>PLAY</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={replayAudio}
                    style={styles.replayButton}
                  >
                    <Text style={styles.playText}>REPLAY</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
        </View>
      )}

      <View style={styles.progress}>
        <View style={styles.dotContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index <= currentStep ? styles.filledDot : styles.emptyDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imagesContainer: {
    width: "100%",
    maxWidth: 800,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  imgBlock: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 15,
    paddingHorizontal: 10,
  },
  imgBtn: {
    width: Dimensions.get("window").width > 600 ? "45%" : "48%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  letterBoxA: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#ff6f00",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  letterBoxB: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  letterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  feedbackBox: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 10,
    elevation: 2,
  },
  checkmark: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  replayButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonRow: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  playText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  progress: {
    marginTop: 20,
    alignItems: "center",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  filledDot: {
    backgroundColor: "#007bff",
  },
  emptyDot: {
    backgroundColor: "transparent",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: Dimensions.get("window").height * 0.35,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    justifyContent: "center",
  },
  restartButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  promptText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
});
