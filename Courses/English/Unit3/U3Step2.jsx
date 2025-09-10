import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const TOYS = [
  {
    id: "bike",
    en: "bike",
    uz: "velosiped",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-1.mp3",
    pos: { top: "33%", left: "8%", width: 25, height: 25 },
  },
  {
    id: "ball",
    en: "ball",
    uz: "koptok",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-2.mp3",
    pos: { top: "27%", left: "35%", width: 25, height: 25 },
  },
  {
    id: "kite",
    en: "kite",
    uz: "varrak",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-3.mp3",
    pos: { top: "28%", left: "47%", width: 25, height: 25 },
  },
  {
    id: "doll",
    en: "doll",
    uz: "qo'g'irchoq",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-4.mp3",
    pos: { top: "23%", left: "60%", width: 25, height: 25 },
  },
  {
    id: "teddy1",
    en: "teddy bear",
    uz: "yumshoq ayiqcha",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-5.mp3",
    pos: { top: "21%", left: "72%", width: 25, height: 25 },
  },
  {
    id: "camera",
    en: "camera",
    uz: "kamera",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-6.mp3",
    pos: { top: "32%", left: "67%", width: 25, height: 25 },
  },
  {
    id: "robot",
    en: "robot",
    uz: "robot",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-7.mp3",
    pos: { top: "38%", left: "55%", width: 25, height: 25 },
  },
  {
    id: "laptop",
    en: "computer",
    uz: "kompyuter",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-8.mp3",
    pos: { top: "52%", left: "16%", width: 25, height: 25 },
  },
  {
    id: "computergames",
    en: "computer game",
    uz: "kompyuter o'yini",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-9.mp3",
    pos: { top: "48%", left: "40%", width: 25, height: 25 },
  },
  {
    id: "artset",
    en: "art set",
    uz: "rasm chizish to'plami",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-10.mp3",
    pos: { top: "55%", left: "69%", width: 25, height: 25 },
  },
];

export default function U3Step2({ next }) {
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [foundIds, setFoundIds] = useState([]);
  const [lastTapped, setLastTapped] = useState(null);
  const [isSequencing, setIsSequencing] = useState(false);
  const soundRef = useRef(null);
  const timeoutsRef = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

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

  const playSingle = async (uri) => {
    await stopAllAudio();
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    soundRef.current = sound;
    return new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate((st) => {
        if (st.isLoaded && st.didJustFinish) resolve();
      });
    });
  };

  const sequenceCounting = async () => {
    if (isSequencing) return;
    setIsSequencing(true);
    try {
      for (let i = 0; i < TOYS.length; i++) {
        await playSingle(TOYS[i].audio);
        await new Promise((res) => {
          const id = setTimeout(() => res(), 1000);
          timeoutsRef.current.push(id);
        });
      }
    } finally {
      setIsSequencing(false);
    }
  };

  const onTapToy = (id) => {
    const t = TOYS.find((x) => x.id === id);
    if (!t) return;
    if (!foundIds.includes(id)) {
      setFoundIds((prev) => [...prev, id]);
    }
    setLastTapped({ en: t.en, uz: t.uz });
  };

  return (
    <>
      {/* Three buttons positioned at top-right */}
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
        {/* Large full-width image at top */}
        <Image
          source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
          style={styles.largeImage}
          resizeMode="contain"
        />

        {/* Buttons positioned exactly like first step */}
        {TOYS.map((t) => {
          const found = foundIds.includes(t.id);
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.toyButton, t.pos, found && styles.foundButton]}
              onPress={() => onTapToy(t.id)}
              disabled={found}
            />
          );
        })}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Tingla va top: "Number one… ten". Pauza paytida mos rasmga bos.
          </Text>
          <Text style={styles.progressText}>
            {foundIds.length} / {TOYS.length}
          </Text>
        </View>

        {/* Main play button */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={sequenceCounting}
          disabled={isSequencing}
        >
          <Text style={styles.playButtonText}>
            {isSequencing ? "▶ O‘qilmoqda..." : "🔊 Play"}
          </Text>
        </TouchableOpacity>

        {/* Show word translation when tapped */}
        {lastTapped && (
          <View style={styles.translationContainer}>
            <Text style={styles.translationText}>
              {lastTapped.en} — {lastTapped.uz}
            </Text>
          </View>
        )}

        {/* Next button when all found */}
        {foundIds.length === TOYS.length && (
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
    borderWidth: 2,
    elevation: 4,
  },
  toyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
  },
  translationContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  translationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  nextButtonText: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "bold",
  },
};
