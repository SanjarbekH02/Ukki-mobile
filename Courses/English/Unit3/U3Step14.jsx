import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Vibration,
} from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";

const { width } = Dimensions.get("window");

export default function QuizGame({ next }) {
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [, setDictionary] = useState(false);
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const correctAnswer = "b";
  const handlePlay = () => {
    setShowQuestion(true);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === correctAnswer) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } else {
      setErrorMessage("WRONG!");
      setShowError(true);
      Vibration.vibrate(500);
      setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 2000);
    }
  };

  const resetGame = () => {
    setShowQuestion(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsSuccess(false);
    setShowError(false);
  };

  return (
    <View style={styles.container}>
      <ThreeButtons
        audioUrl="https://ukkibackend.soof.uz/media/audio/" //audio mavjud emas 
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#f0f8ff" />

      {/* Image */}
      <View style={styles.imageContainer}>
        <View
          style={[
            styles.imagePlaceholder,
            showQuestion && {
              width: width * 0.35,
              height: width * 0.35,
            },
          ]}
        >
          <Image
            source={require("../../../assets/images/unit-3/student49.png")}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        </View>
      </View>

      {!showQuestion && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlay}
          activeOpacity={0.7}
        >
          <Ionicons name="play" size={24} color="#fff" />
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>
      )}

      {showQuestion && (
        <ScrollView style={styles.questionContainer}>
          {/* Question */}
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>WHAT IS IT?</Text>
            <Text style={styles.questionTranslation}>Bu nima?</Text>
          </View>

          <View style={styles.answersContainer}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswer === "a" && styles.selectedAnswer,
                showResult &&
                  selectedAnswer === "a" &&
                  correctAnswer !== "a" &&
                  styles.wrongAnswer,
                showResult && correctAnswer === "a" && styles.correctAnswer,
              ]}
              onPress={() => handleAnswer("a")}
              disabled={showResult}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.answerText,
                  showResult &&
                    selectedAnswer === "a" &&
                    correctAnswer !== "a" &&
                    styles.wrongAnswerText,
                  showResult &&
                    correctAnswer === "a" &&
                    styles.correctAnswerText,
                ]}
              >
                a) It is a pen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswer === "b" && styles.selectedAnswer,
                showResult &&
                  selectedAnswer === "b" &&
                  correctAnswer !== "b" &&
                  styles.wrongAnswer,
                showResult && correctAnswer === "b" && styles.correctAnswer,
              ]}
              onPress={() => handleAnswer("b")}
              disabled={showResult}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.answerText,
                  showResult &&
                    selectedAnswer === "b" &&
                    correctAnswer !== "b" &&
                    styles.wrongAnswerText,
                  showResult &&
                    correctAnswer === "b" &&
                    styles.correctAnswerText,
                ]}
              >
                b) It is a book
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {showResult && (
        <Modal
          transparent={true}
          visible={showResult}
          animationType="slide"
          onRequestClose={() => {}}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.resultHeader}>
                <Text
                  style={[
                    styles.resultText,
                    selectedAnswer === correctAnswer
                      ? styles.correctText
                      : styles.wrongText,
                  ]}
                >
                  {selectedAnswer === correctAnswer ? "CORRECT!" : "WRONG!"}
                </Text>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetGame}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh" size={20} color="#fff" />
                  <Text style={styles.resetButtonText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextBtn} onPress={next}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: StatusBar.currentHeight + 20,
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  imagePlaceholder: {
    width: "100%",
    height: width * 0.6,
    maxWidth: 250,
    maxHeight: 250,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#e0e0e0",
  },
  playButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 20,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 1,
  },
  questionContainer: {
    width: "100%",
  },
  questionBox: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#2196F3",
    width: "100%",
  },
  questionText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  questionTranslation: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  answersContainer: {
    width: "100%",
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  selectedAnswer: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
  },
  correctAnswer: {
    borderColor: "#4CAF50",
    backgroundColor: "#e8f5e8",
  },
  wrongAnswer: {
    borderColor: "#f44336",
    backgroundColor: "#ffebee",
  },
  answerText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  correctAnswerText: {
    color: "#2e7d32",
  },
  wrongAnswerText: {
    color: "#c62828",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: 250,
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
  },
  correctText: {
    color: "#4CAF50",
  },
  wrongText: {
    color: "#f44336",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  resetButton: {
    backgroundColor: "#FF9800",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 1,
  },
  nextBtn: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
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
    marginBottom: 10,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
});
