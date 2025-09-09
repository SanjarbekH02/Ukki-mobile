import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";
import Styles from "../../../Styles/Styles";

/**
 * Flow:
 * 1) Intro: iPal greeting + "Boshlash"
 * 2) Listen & Find: numbered hotspots 1..10; sequence plays with short pauses; child taps numbers; show "en — uz" on tap
 * 3) Repeat & Say: mic/STT check like Unit1 Step2 (hide numbers on success; Next when all done or >=3 errors)
 * 4) Learn: flashcards with EN + UZ + audio
 */

const INTRO_AUDIO =
  "https://ukkibackend.soof.uz/media/audio/unit2-step2-intro.mp3";

// Adjust positions to match your background image precisely
const TOYS = [
  {
    id: 1,
    en: "bike",
    uz: "velosiped",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-1.mp3",
    pos: { top: "43%", left: "8%" },
  },
  {
    id: 2,
    en: "ball",
    uz: "koptok",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-2.mp3",
    pos: { top: "35%", left: "35%" },
  },
  {
    id: 3,
    en: "kite",
    uz: "varrak",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-3.mp3",
    pos: { top: "28%", left: "47%" },
  },
  {
    id: 4,
    en: "doll",
    uz: "qo'g'irchoq",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-4.mp3",
    pos: { top: "27%", left: "60%" },
  },
  {
    id: 5,
    en: "teddy bear",
    uz: "yumshoq ayiqcha",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-5.mp3",
    pos: { top: "25%", left: "72%" },
  },
  {
    id: 6,
    en: "camera",
    uz: "kamera",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-6.mp3",
    pos: { top: "42%", left: "67%" },
  },
  {
    id: 7,
    en: "robot",
    uz: "robot",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-7.mp3",
    pos: { top: "52%", left: "55%" },
  }, // adjust to robot spot
  {
    id: 8,
    en: "computer",
    uz: "kompyuter",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-8.mp3",
    pos: { top: "70%", left: "16%" },
  },
  {
    id: 9,
    en: "computer game",
    uz: "kompyuter o'yini",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-9.mp3",
    pos: { top: "68%", left: "40%" },
  },
  {
    id: 10,
    en: "art set",
    uz: "rasm chizish to'plami",
    audio: "https://ukkibackend.soof.uz/media/audio/unit2-step2-10.mp3",
    pos: { top: "75%", left: "69%" },
  },
];

const U3Step2 = ({ next }) => {
  const [phase, setPhase] = useState("intro"); // "intro" | "find" | "repeat" | "learn"

  // shared audio state (JS-only, no TS types)
  const soundRef = useRef(null); // holds current Audio.Sound
  const timeoutsRef = useRef([]); // holds timeout IDs

  // FIND phase
  const [isSequencing, setIsSequencing] = useState(false);
  const [foundIds, setFoundIds] = useState([]);
  const [lastTapped, setLastTapped] = useState(null); // { en, uz } | null

  // REPEAT (mic/STT) phase (pattern from Unit1 Step2)
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [hiddenButtons, setHiddenButtons] = useState([]);
  const [resultText, setResultText] = useState("");
  const [errorCount, setErrorCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  // pulse animation like your sample
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [isRecording]);

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
      if (isRecording && recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  const playSingle = useCallback(async (uri) => {
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
  }, []);

  // ----- INTRO -----
  const handleStart = async () => {
    await playSingle(INTRO_AUDIO);
    setPhase("find");
    sequenceCounting();
  };

  // ----- FIND: sequence 1..10 with short pauses; kid taps numbers -----
  const sequenceCounting = useCallback(async () => {
    if (isSequencing) return;
    setIsSequencing(true);
    try {
      for (let i = 0; i < TOYS.length; i++) {
        await playSingle(TOYS[i].audio); // plays each item audio
        await new Promise((res) => {
          const id = setTimeout(() => res(), 1000); // ~1s pause
          timeoutsRef.current.push(id);
        });
      }
    } finally {
      setIsSequencing(false);
    }
  }, [isSequencing, playSingle]);

  const onTapFind = (id) => {
    const t = TOYS.find((x) => x.id === id);
    if (!t) return;
    if (!foundIds.includes(id)) {
      setFoundIds((prev) => [...prev, id]);
      setLastTapped({ en: t.en, uz: t.uz });
    }
    if (foundIds.length + 1 === TOYS.length) {
      const tid = setTimeout(() => {
        setPhase("repeat");
        setLastTapped(null);
      }, 800);
      timeoutsRef.current.push(tid);
    }
  };

  // ----- REPEAT: mic & STT like Unit1 sample -----
  const buttonAudio = TOYS.reduce((acc, t) => {
    acc[t.id] = t.audio;
    return acc;
  }, {});

  const buttonWord = TOYS.reduce((acc, t) => {
    acc[t.id] = t.en;
    return acc;
  }, {});

  const handlePlayButtonAudio = (index) => {
    if (hiddenButtons.includes(index)) return;
    playSingle(buttonAudio[index]);
    setActiveButton(index);
    // Optionally auto-start mic: startRecording();
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      setResultText("");
    } catch {}
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/m4a",
        name: "recording.m4a",
      });

      const res = await fetch("https://stt.soof.uz/stt", {
        method: "POST",
        headers: { accept: "application/json", "accept-language": "en" },
        body: formData,
      });
      const data = await res.json();

      if ((data?.text || data?.transcript) && activeButton) {
        const recognized = (data.text || data.transcript).toLowerCase().trim();
        const correct = buttonWord[activeButton].toLowerCase().trim();

        if (recognized.includes(correct)) {
          setResultText(`✅ To‘g‘ri: ${correct}`);
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 2000);
          setHiddenButtons((prev) => [...prev, activeButton]);
          setActiveButton(null);
        } else {
          setIsError(true);
          setTimeout(() => setIsError(false), 1000);
          setErrorCount((prev) => prev + 1);
          setResultText(`❌ Noto‘g‘ri. To‘g‘ri: ${correct}`);
        }
      } else {
        setResultText("⚠️ Ovoz tanilmadi");
      }
    } catch {}
  };

  const allRepeatDone = hiddenButtons.length === TOYS.length;

  // ----- LEARN data -----
  const flashData = useMemo(
    () =>
      TOYS.map((t) => ({ word: t.en, translation: t.uz, audioUrl: t.audio })),
    []
  );

  // ----- RENDER -----

  const Intro = () => (
    <View style={styles.container}>
      <ThreeButtons
        setShowPointer={() => {}}
        setInfoClick={() => {}}
        infoClick={false}
        clicked={false}
        setClicked={() => {}}
        setDictionary={() => {}}
        audioUrl={INTRO_AUDIO}
      />

      <Image
        source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
        style={styles.bgImg}
      />

      <View style={styles.bottomCtaWrap}>
        <TouchableOpacity style={styles.ctaPrimary} onPress={handleStart}>
          <Text style={styles.ctaText}>▶ Boshlash</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introText}>
          iPal: “Salom! Men o‘yinchoqlarimni sanab chiqmoqchiman, lekin ular
          aralashib ketdi. Menga ularni topishga yordam berasanmi? Keling,
          boshlaymiz!”
        </Text>
      </View>
    </View>
  );

  const Find = () => (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
        style={styles.findImg}
      />
      {/* numbered hotspots, disable after found */}
      {TOYS.map((t) => {
        const found = foundIds.includes(t.id);
        return (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.numberBtn,
              {
                top: t.pos.top,
                left: t.pos.left,
                backgroundColor: found ? "rgba(76,175,80,0.55)" : "#7272728e",
                borderColor: "#fff",
              },
            ]}
            onPress={() => onTapFind(t.id)}
            disabled={found}
          >
            {!found && <Text style={Styles.userNumberText}>{t.id}</Text>}
          </TouchableOpacity>
        );
      })}

      <View style={styles.statusBox}>
        <Text style={styles.statusLine}>
          Tingla va top: “Number one… ten”. Pauza paytida mos rasmga bos.
        </Text>
        <Text style={styles.progress}>
          {foundIds.length} / {TOYS.length}
        </Text>
        <View style={{ height: 8 }} />
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={sequenceCounting}
          disabled={isSequencing}
        >
          <Text style={styles.smallBtnText}>
            {isSequencing ? "▶ O‘qilmoqda..." : "🔊 Qayta tinglash"}
          </Text>
        </TouchableOpacity>

        {lastTapped && (
          <>
            <View style={{ height: 8 }} />
            <Text style={styles.bigWord}>
              {lastTapped.en} — {lastTapped.uz}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  const Repeat = () => (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
        style={styles.bgImg}
      />
      {/* show numbers for words still to practice */}
      {TOYS.map((t) => {
        if (hiddenButtons.includes(t.id)) return null;
        return (
          <TouchableOpacity
            key={t.id}
            style={[styles.userNumber, styles["userNumber" + t.id] || {}]}
            onPress={() => handlePlayButtonAudio(t.id)}
          >
            <Text style={Styles.userNumberText}>{t.id}</Text>
          </TouchableOpacity>
        );
      })}

      {activeButton && (
        <View style={styles.micWrapper}>
          <TouchableOpacity
            style={styles.micButton}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Animated.View
              style={{ transform: [{ scale: isRecording ? pulse : 1 }] }}
            >
              <Ionicons
                name={isRecording ? "stop-circle" : "mic"}
                size={50}
                color={isRecording ? "red" : "black"}
              />
            </Animated.View>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, color: "white" }}>
            {isRecording ? "Speaking..." : "Tap to stop & check"}
          </Text>
        </View>
      )}

      {resultText !== "" && <Text style={styles.resultText}>{resultText}</Text>}

      {(allRepeatDone || errorCount >= 3) && (
        <TouchableOpacity
          style={Styles.NextButton}
          onPress={() => setPhase("learn")}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const Learn = () => <FlashCards setDictionary={() => {}} data={flashData} />;

  return (
    <>
      {phase === "intro" && <Intro />}
      {phase === "find" && <Find />}
      {phase === "repeat" && <Repeat />}
      {phase === "learn" && <Learn />}

      {isSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
};

const BTN = {
  size: 40,
  radius: 50,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    height: "90%",
    backgroundColor: "#eee",
    marginBottom: 95,
  },
  bgImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  findImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "75%",
    resizeMode: "stretch",
  },

  // FIND phase number buttons
  numberBtn: {
    width: BTN.size,
    height: BTN.size,
    borderRadius: BTN.radius,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 1,
  },

  statusBox: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusLine: { fontSize: 14, color: "#444", textAlign: "center" },
  progress: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "bold",
    color: "#C200F3",
    textAlign: "center",
  },
  bigWord: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // INTRO
  bottomCtaWrap: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  ctaPrimary: {
    backgroundColor: "#FF6B35",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  ctaText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  introCard: {
    position: "absolute",
    bottom: 130,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 12,
    padding: 12,
  },
  introText: { fontWeight: "600", color: "#333", textAlign: "center" },

  // REPEAT (mic) — reuse positions similar to your Unit1 layout; tweak as needed:
  userNumber: {
    width: BTN.size,
    height: BTN.size,
    borderRadius: BTN.radius,
    backgroundColor: "#7272728e",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 1,
    borderColor: "#fff",
  },
  // Adjust these to match your Unit-3 background exactly
  userNumber1: { top: "40%", left: "0%" },
  userNumber2: { top: "25%", left: "40%" },
  userNumber3: { top: "27%", right: "5%" },
  userNumber4: { bottom: "35%", left: "10%" },
  userNumber5: { bottom: "33%", left: "40%" },
  userNumber6: { bottom: "35%", right: "32%" },
  userNumber7: { bottom: "27%", left: "42%" },
  userNumber8: { bottom: "27%", right: "27%" },
  userNumber9: { bottom: "27%", right: "10%" },
  userNumber10: { bottom: "17%", right: "16%" },

  micWrapper: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    alignItems: "center",
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  resultText: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#d3d3d3ff",
  },
  nextButtonText: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Small replay button in Find status (style reused)
  smallBtn: {
    alignSelf: "center",
    backgroundColor: "#C200F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  smallBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default U3Step2;
