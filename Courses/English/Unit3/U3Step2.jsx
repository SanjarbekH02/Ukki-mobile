import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const TOYS = [
  { id: "bike", en: "bike", uz: "velosiped", pos: { top: "33%", left: "8%" } },
  { id: "ball", en: "ball", uz: "koptok", pos: { top: "27%", left: "35%" } },
  { id: "kite", en: "kite", uz: "varrak", pos: { top: "24%", left: "45%" } },
  { id: "doll", en: "doll", uz: "qo'g'irchoq", pos: { top: "23%", left: "60%" } },
  { id: "teddy1", en: "teddy bear", uz: "yumshoq ayiqcha", pos: { top: "21%", left: "72%" } },
  { id: "camera", en: "camera", uz: "kamera", pos: { top: "32%", left: "65%" } },
  { id: "robot", en: "robot", uz: "robot", pos: { top: "39%", left: "54%" } },
  { id: "laptop", en: "computer", uz: "kompyuter", pos: { top: "52%", left: "16%" } },
  { id: "computergames", en: "computer game", uz: "kompyuter o'yini", pos: { top: "48%", left: "40%" } },
  { id: "artset", en: "art set", uz: "rasm chizish to'plami", pos: { top: "55%", left: "69%" } },
];

const AUDIO_SEQUENCE = [
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-1.mp3", correctId: "artset" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-2.mp3", correctId: "camera" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-3.mp3", correctId: "ball" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-4.mp3", correctId: "doll" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-5.mp3", correctId: "laptop" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-6.mp3", correctId: "computergames" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-7.mp3", correctId: "teddy1" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-8.mp3", correctId: "kite" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-9.mp3", correctId: "bike" },
  { audio: "https://ukkibackend.soof.uz/media/audio/CD1-42-10.mp3", correctId: "robot" },
];

export default function U3Step2({ next }) {
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [foundIds, setFoundIds] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waitingForAnswer, setWaitingForAnswer] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const soundRef = useRef(null);
  const timeoutsRef = useRef([]);

  const stopAllAudio = async () => {
    try {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch {}
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // ✅ Har safar currentQuestionIndex o'zgarsa — yangi audio o'ynaydi
  useEffect(() => {
    if (gameStarted && currentQuestionIndex < AUDIO_SEQUENCE.length) {
      playCurrentAudio();
    }
  }, [currentQuestionIndex, gameStarted]);

  const playSingle = async (uri) => {
    await stopAllAudio();
    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
    soundRef.current = sound;
    return new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate((st) => {
        if (st.isLoaded && st.didJustFinish) resolve();
      });
    });
  };

  const playCurrentAudio = async () => {
    if (currentQuestionIndex >= AUDIO_SEQUENCE.length) return;

    setIsPlaying(true);
    setFeedbackMessage("");

    try {
      await playSingle(AUDIO_SEQUENCE[currentQuestionIndex].audio);
      setWaitingForAnswer(true);
    } catch (error) {
      console.error("Audio play error:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setFoundIds([]);
    setWaitingForAnswer(false);
    setFeedbackMessage("");
  };

  const onTapToy = (id) => {
    if (!waitingForAnswer || isPlaying) return;

    const currentQuestion = AUDIO_SEQUENCE[currentQuestionIndex];

    if (currentQuestion.correctId === id) {
      // ✅ To'g'ri javob
      setFeedbackMessage("To'g'ri!");
      setFoundIds((prev) => [...prev, id]);
      setWaitingForAnswer(false);

      // 🔄 Faqat indexni oshiramiz, audio useEffect orqali o'ynaydi
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // ❌ Noto'g'ri javob
      setFeedbackMessage("Noto'g'ri!");
      setWaitingForAnswer(false);

      const timeoutId = setTimeout(() => {
        setFeedbackMessage("");
        playCurrentAudio();
      }, 1500);

      timeoutsRef.current.push(timeoutId);
    }
  };

  const getButtonStyle = (toyId) => {
    if (foundIds.includes(toyId)) {
      return [styles.toyButton, { backgroundColor: "#4CAF50", borderColor: "#4CAF50" }];
    }
    return [styles.toyButton, { backgroundColor: "rgba(255, 255, 255, 0)", borderColor: "#ffffffff" }];
  };

  return (
    <>
      <View style={styles.topRightContainer}>
        <ThreeButtons
          setDictionary={() => {}}
          infoClick={infoClick}
          clicked={clicked}
          setClicked={setClicked}
          setInfoClick={setInfoClick}
          audioUrl="https://ukkibackend.soof.uz/media/audio/unit2-step2-intro.mp3"
        />
      </View>

      <Animated.View style={[styles.container]}>
        <Image
          source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
          style={styles.largeImage}
          resizeMode="contain"
        />

        {TOYS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.toyButton, t.pos, ...getButtonStyle(t.id)]}
            onPress={() => onTapToy(t.id)}
            disabled={!waitingForAnswer}
          />
        ))}

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {!gameStarted
              ? "Audio tinglab, mos keladigan o'yinchoqni toping!"
              : waitingForAnswer
              ? "Qaysi o'yinchoq haqida gap ketayapti?"
              : isPlaying
              ? "Tinglang..."
              : "Keyingi audio..."}
          </Text>
          <Text style={styles.progressText}>
            {foundIds.length} / {AUDIO_SEQUENCE.length}
          </Text>
        </View>

        {feedbackMessage && (
          <View
            style={[
              styles.feedbackContainer,
              feedbackMessage === "To'g'ri!" ? styles.correctFeedback : styles.incorrectFeedback,
            ]}
          >
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
        )}

        {!gameStarted ? (
          <TouchableOpacity style={styles.playButton} onPress={startGame}>
            <Text style={styles.playButtonText}>🔊 O'yinni Boshlash</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.playButton, { opacity: 0.5 }]} disabled={true}>
            <Text style={styles.playButtonText}>
              {isPlaying
                ? "▶ O'qilmoqda..."
                : `Audio ${currentQuestionIndex + 1}/${AUDIO_SEQUENCE.length}`}
            </Text>
          </TouchableOpacity>
        )}

        {foundIds.length === AUDIO_SEQUENCE.length && (
          <TouchableOpacity style={Styles.NextButton} onPress={next}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </>
  );
}

const styles = {
  topRightContainer: {
    position: "absolute",
    top: 90,
    right: 0,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: "#fdf6ff",
  },
  largeImage: {
    width: "100%",
    height: "75%",
    marginTop: 0,
  },
  toyButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "inherit",
    borderWidth: 2,
    elevation: 4,
  },
  instructionsContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C200F3",
    textAlign: "center",
  },
  playButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  feedbackContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
  },
  correctFeedback: {
    backgroundColor: "#4CAF50",
  },
  incorrectFeedback: {
    backgroundColor: "#F44336",
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  nextButtonText: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "bold",
  },
};
