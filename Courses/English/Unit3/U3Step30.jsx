import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
  Vibration,
  Modal,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";

import img from "../../../assets/images/unit-3/unit3step30.jpg";

const { height } = Dimensions.get("window");

export default function U3Step30({ next }) {
  const [, setDictionary] = useState(false);
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false); 
  const [playStarted, setPlayStarted] = useState(false);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [showHand, setShowHand] = useState(false);
  const [sound, setSound] = useState(null);
  const [answers, setAnswers] = useState(Array(12).fill(null));
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [nextBtn, setNextBtn] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const initialAudioUrl =
    "https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, Rasmlarga qara va ularni moslashtir. .mp3";

  const handData = [
    {
      id: "hand1",
      text: "What's this? It's a pencil case.\nBu nima? Bu qalamdon.",
      position: { top: "82%", left: "45%", zIndex: 15 },
      textPosition: { top: "68%", left: "15%", zIndex: 16 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand2",
      text: "Is it a teddy bear?\nBu yumshoq ayiqchami?",
      position: { top: "80%", left: "65%", zIndex: 10 },
      textPosition: { top: "67%", left: "35%", zIndex: 11 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand3",
      text: "How many books can you see?\nNechta kitob koʻrayapsan?",
      position: { top: "79%", right: "4%", zIndex: 10 },
      textPosition: { top: "60%", right: "10%", zIndex: 11 },
      correctAnswer: 6,
      answerType: "number",
      options: [3, 5, 6, 2],
    },
    {
      id: "hand4",
      text: "What's this? It's a computer.\nBu nima? Bu kompyuter.",
      position: { top: "68%", right: "15%", zIndex: 10 },
      textPosition: { top: "50%", right: "20%", zIndex: 11 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand5",
      text: "Is it a kite?\nBu varrakmi?",
      position: { top: "58%", right: "5%", zIndex: 10 },
      textPosition: { top: "38%", right: "10%", zIndex: 11 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand6",
      text: "How many pens can you see?\nNechta ruchka koʻrayapsan?",
      position: { top: "55%", left: "55%", zIndex: 10 },
      textPosition: { top: "37%", left: "20%", zIndex: 11 },
      correctAnswer: 8,
      answerType: "number",
      options: [7, 8, 9, 6],
    },
    {
      id: "hand7",
      text: "What's this? It's an art set.\nBu nima? Bu rasm chizish toʻplami.",
      position: { top: "63%", left: "40%", zIndex: 10 },
      textPosition: { top: "45%", left: "8%", zIndex: 11 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand8",
      text: "Is it a bike?\nBu velosipedmi?",
      position: { top: "55%", left: "23%", zIndex: 10 },
      textPosition: { top: "48%", left: "33%", zIndex: 11 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand9",
      text: "How many cameras can you see? \nNechta kamera koʻrayapsiz?",
      position: { top: "45%", left: "35%", zIndex: 11 },
      textPosition: { top: "50%", left: "10%", zIndex: 12 },
      correctAnswer: 3,
      answerType: "number",
      options: [2, 1, 5, 3],
    },
    {
      id: "hand10",
      text: "What's this? It's a robot.\nBu nima? Bu robot.",
      position: { top: "40%", left: "45%", zIndex: 12 },
      textPosition: { top: "20%", left: "10%", zIndex: 13 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand11",
      text: "Is it a gift? \nBu sovg‘ami?",
      position: { top: "35%", right: "25%", zIndex: 13 },
      textPosition: { top: "40%", right: "30%", zIndex: 14 },
      correctAnswer: true,
      answerType: "yesNo",
    },
    {
      id: "hand12",
      text: "How many windows can you see?\nNechta deraza koʻrayapsan?",
      position: { top: "30%", right: "10%", zIndex: 14 },
      textPosition: { top: "35%", right: "10%", zIndex: 15 },
      correctAnswer: 4,
      answerType: "number",
      options: [2, 4, 5, 3],
    },
  ];

  useEffect(() => {
    if (showHand) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
    return () => {
      scaleAnim.stopAnimation();
    };
  }, [showHand]);

  // Audio faqat ThreeButtons orqali ijro etiladi
  useEffect(() => {
    async function playInitialSound() {
      if (clicked) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: initialAudioUrl },
            { shouldPlay: true }
          );
          setSound(sound);
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              sound.unloadAsync().catch((error) => {
                console.error("Initial sound unload error:", error);
              });
            }
          });
        } catch (error) {
          console.error("Boshlang‘ich audio yuklashda xato:", error);
        }
      }
    }
    playInitialSound();
    return () => {
      if (sound) {
        sound.unloadAsync().catch((error) => {
          console.error("Initial sound cleanup error:", error);
        });
      }
    };
  }, [clicked]);

  // Play tugmasi faqat o‘yinni boshlaydi
  const handlePlayButtonPress = () => {
    setPlayStarted(true);
    setCurrentHandIndex(0);
    setShowHand(true);
  };

  const handleRestart = () => {
    setAnswers(Array(12).fill(null));
    setCurrentHandIndex(0);
    setShowHand(false);
    setNextBtn(false);
    setPlayStarted(false);
  };

  const handleAnswer = (answer) => {
    if (!playStarted) return; // Play bosilmaguncha javob berishni bloklash

    const newAnswers = [...answers];
    newAnswers[currentHandIndex] = answer;
    setAnswers(newAnswers);

    if (answer === handData[currentHandIndex].correctAnswer) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } else {
      setErrorMessage("Xato javob berdingiz");
      setShowError(true);
      Vibration.vibrate(500);
      setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 2000);
    }

    const nextIndex = currentHandIndex + 1;
    if (nextIndex < 12) {
      setCurrentHandIndex(nextIndex);
      setShowHand(false);
      setTimeout(() => {
        setShowHand(true);
      }, 500);
    } else {
      setShowHand(false);
      setNextBtn(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return answer === handData[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  return (
    <View style={styles.container}>
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        setInfoClick={setInfoClick}
        clicked={clicked}
        setClicked={setClicked}
        audioUrl={initialAudioUrl}
        playBtn={false}
      />
      <View style={styles.imageContainer}>
        <Image source={img} style={styles.image} />
        {!playStarted && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayButtonPress}
          >
            <Text style={styles.playText}>play</Text>
          </TouchableOpacity>
        )}
        {showHand && handData[currentHandIndex] && (
          <>
            <Animated.Text
              style={[
                styles.handImage,
                {
                  top: handData[currentHandIndex].position.top,
                  left: handData[currentHandIndex].position.left || "auto",
                  right: handData[currentHandIndex].position.right || "auto",
                  zIndex: handData[currentHandIndex].position.zIndex,
                  transform: [
                    { translateX: -30 },
                    { translateY: -30 },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              🤖
            </Animated.Text>
            <Text
              style={[
                styles.handText,
                {
                  top: handData[currentHandIndex].textPosition.top,
                  left: handData[currentHandIndex].textPosition.left || "auto",
                  right:
                    handData[currentHandIndex].textPosition.right || "auto",
                  zIndex: handData[currentHandIndex].textPosition.zIndex,
                },
              ]}
            >
              {handData[currentHandIndex].text}
            </Text>
          </>
        )}
        {showError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <ErrorOverlay />
          </View>
        )}
        {isSuccess && (
          <View style={styles.confettiContainer}>
            <ConfettiEffect />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={nextBtn}
          onRequestClose={handleRestart}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Siz 12ta savoldan {calculateScore()} ta to‘g‘ri javob yechdingiz
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={next} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRestart}
                  style={styles.restartButton}
                >
                  <Text style={styles.restartButtonText}>Restart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {showHand && handData[currentHandIndex] && (
        <View style={styles.buttonContainer}>
          {handData[currentHandIndex].answerType === "yesNo" ? (
            <>
              <TouchableOpacity
                style={[styles.yesNoButton, { backgroundColor: "#4CAF50" }]}
                onPress={() => handleAnswer(true)}
                disabled={!playStarted}
              >
                <Text style={styles.yesNoText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.yesNoButton, { backgroundColor: "#F44336" }]}
                onPress={() => handleAnswer(false)}
                disabled={!playStarted}
              >
                <Text style={styles.yesNoText}>No</Text>
              </TouchableOpacity>
            </>
          ) : (
            handData[currentHandIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.numberButton, { backgroundColor: "#2196F3" }]}
                onPress={() => handleAnswer(option)}
                disabled={!playStarted}
              >
                <Text style={styles.numberText}>{option}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: height * 0.01,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.9,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "90%",
    resizeMode: "stretch",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -25 }],
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 25,
    zIndex: 1000,
    elevation: 10,
  },
  playText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  handImage: {
    position: "absolute",
    fontSize: 30, // Emoji o‘lchami kichiklashtirilgan
    textAlign: "center",
  },
  handText: {
    position: "absolute",
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    bottom: 20,
  },
  yesNoButton: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 80,
    alignItems: "center",
  },
  yesNoText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  numberButton: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 60,
    alignItems: "center",
  },
  numberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  errorText: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 25,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 18,
  },
  restartButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF9800",
    borderRadius: 10,
    alignItems: "center",
  },
  restartButtonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 18,
  },
});
