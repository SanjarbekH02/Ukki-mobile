// U3Step6.jsx (plain JS / JSX)
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import OnError from "../../../components/Utils/OnError";
import Success from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";

// Keep your images
const pictures = [
  require("../../../assets/images/unit-3/unit-2-step-6-1.jpg"), // Picture 1 (boy)
  require("../../../assets/images/unit-3/unit-2-step-6-2.jpg"), // Picture 2 (girl)
];

// Audio (swap to your exact URLs if different)
const AUDIO = {
  intro:
    "https://ukkibackend.soof.uz/media/audio/Bugun-tugilgan-kun-iPal-intro.mp3",
  q: "https://ukkibackend.soof.uz/media/audio/whats-in-the-present.mp3",
  a_game: "https://ukkibackend.soof.uz/media/audio/its-a-computer-game.mp3",
  a_art: "https://ukkibackend.soof.uz/media/audio/its-an-art-set.mp3",
};

// Dialog blueprints per picture
const DIALOGS = [
  {
    id: "present_game",
    steps: [
      {
        type: "say",
        en: "What's in the present?",
        uz: "Sovg‘a ichida nima bor?",
        audio: AUDIO.q,
      },
      {
        type: "say",
        en: "It's a computer game.",
        uz: "Bu kompyuter o‘yini.",
        audio: AUDIO.a_game,
      },
      {
        type: "repeat",
        lines: [
          { en: "What's in the present?", uz: "Sovg‘a ichida nima bor?" },
          { en: "It's a computer game.", uz: "Bu kompyuter o‘yini." },
        ],
      },
    ],
  },
  {
    id: "present_art",
    steps: [
      {
        type: "say",
        en: "What's in the present?",
        uz: "Sovg‘a ichida nima bor?",
        audio: AUDIO.q,
      },
      {
        type: "say",
        en: "It's an art set.",
        uz: "Bu rasm chizish to‘plami.",
        audio: AUDIO.a_art,
      },
      {
        type: "repeat",
        lines: [
          { en: "What's in the present?", uz: "Sovg‘a ichida nima bor?" },
          { en: "It's an art set.", uz: "Bu rasm chizish to‘plami." },
        ],
      },
    ],
  },
];

// Vocabulary list shown at the end (optional dictionary)
const VOCAB = [
  {
    word: "present",
    translation: "sovg‘a",
    audioUrl: "https://ukkibackend.soof.uz/media/audio/present.mp3",
  },
  {
    word: "computer game",
    translation: "kompyuter o‘yini",
    audioUrl: "https://ukkibackend.soof.uz/media/audio/kompyuter_oyini.mp3",
  },
  {
    word: "art set",
    translation: "rasm chizish to‘plami",
    audioUrl: "https://ukkibackend.soof.uz/media/audio/rasmchizish_toplami.mp3",
  },
  {
    word: "What's in ...?",
    translation: "... ichida nima bor?",
    audioUrl: "https://ukkibackend.soof.uz/media/audio/whats_in.mp3",
  },
];

export default function U3Step6({ next }) {
  // top controls
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);

  // flow state
  const [phase, setPhase] = useState("intro"); // "intro" | "game" | "done"
  const [activeDialogIdx, setActiveDialogIdx] = useState(null); // 0 | 1 | null
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [subtitle, setSubtitle] = useState(null); // { en, uz } | null
  const [finishedIds, setFinishedIds] = useState([]); // string[]

  // audio play/record
  const soundRef = useRef(null); // will hold Audio.Sound
  const [isPlaying, setIsPlaying] = useState(false);

  const [recording, setRecording] = useState(null); // Audio.Recording
  const [recActive, setRecActive] = useState(false);
  const [recAllowed, setRecAllowed] = useState(null); // boolean | null

  // UX flair
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Ask mic permission once
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setRecAllowed(status === "granted");
      } catch {
        setRecAllowed(false);
      }
    })();
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const cleanupSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
    } catch {}
    soundRef.current = null;
    setIsPlaying(false);
  };

  const playLine = async (audioUrl, en, uz) => {
    setSubtitle({ en, uz });
    await cleanupSound();
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((st) => {
        if (!st.isLoaded) return;
        if (st.didJustFinish) {
          setIsPlaying(false);
          setTimeout(() => {
            goNextStep();
          }, 500);
        }
      });
    } catch (e) {
      setTimeout(() => goNextStep(), 500);
    }
  };

  const goNextStep = () => {
    if (activeDialogIdx === null) return;
    const dialog = DIALOGS[activeDialogIdx];
    const nextIdx = activeStepIdx + 1;
    if (nextIdx < dialog.steps.length) {
      setActiveStepIdx(nextIdx);
    } else {
      // dialog finished
      const doneId = dialog.id;
      setFinishedIds((prev) => [...prev, doneId]);
      setActiveDialogIdx(null);
      setActiveStepIdx(0);
      setSubtitle(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
    }
  };

  // Run current step when it changes
  useEffect(() => {
    if (activeDialogIdx === null) return;
    const dialog = DIALOGS[activeDialogIdx];
    const step = dialog.steps[activeStepIdx];

    if (step.type === "say") {
      playLine(step.audio, step.en, step.uz);
    } else if (step.type === "repeat") {
      setSubtitle(step.lines[0]); // show first line, wait for mic
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDialogIdx, activeStepIdx]);

  const handleStart = async () => {
    await cleanupSound();
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: AUDIO.intro },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((st) => {
        if (!st.isLoaded) return;
        if (st.didJustFinish) {
          setIsPlaying(false);
          setPhase("game");
        }
      });
    } catch {
      setPhase("game");
    }
  };

  const startDialog = (idx) => {
    if (phase !== "game") return;
    const id = DIALOGS[idx].id;
    if (finishedIds.includes(id)) return;
    setActiveDialogIdx(idx);
    setActiveStepIdx(0);
  };

  // Recording
  const startRecording = async () => {
    if (recAllowed === false) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1000);
      return;
    }
    try {
      await cleanupSound();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
      setRecActive(true);

      // auto-stop after ~3s
      setTimeout(() => stopRecording(true), 3000);
    } catch (e) {
      setRecActive(false);
      setRecording(null);
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      setRecActive(false);

      // small praise then advance line/step
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 700);

      if (activeDialogIdx !== null) {
        const step = DIALOGS[activeDialogIdx].steps[activeStepIdx];
        if (step.type === "repeat") {
          const currentLineIdx = step.lines.findIndex(
            (ln) => ln.en === (subtitle ? subtitle.en : "")
          );
          const nextLineIdx = currentLineIdx + 1;
          if (nextLineIdx < step.lines.length) {
            setSubtitle(step.lines[nextLineIdx]);
          } else {
            goNextStep(); // finished repeat block
          }
        }
      }
    } catch (e) {
      setRecActive(false);
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
    } finally {
      setRecording(null);
    }
  };

  const allDone =
    finishedIds.includes(DIALOGS[0].id) && finishedIds.includes(DIALOGS[1].id);

  return (
    <>
      {dictionary ? (
        <FlashCards setDictionary={setDictionary} data={VOCAB} />
      ) : (
        <View style={[styles.container, { backgroundColor: "#fff" }]}>
          {/* Intro overlay */}
          {phase === "intro" && (
            <View style={styles.overlay}>
              {/* Use your iPal image if you have one */}
              <Image
                source={require("../../../assets/images/unit-3/unit-2-step-4-3.jpg")}
                style={styles.ipal}
              />
              <Text style={styles.introText}>
                Bugun tug‘ilgan kun! Sovg‘alarni birga ochamiz. Boshlaymizmi?
              </Text>
              <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
                <Text style={styles.startText}>▶ Boshlash</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Utility bar */}
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl={AUDIO.intro}
            playBtn={true}
          />

          {/* Two pictures stacked */}
          <View style={styles.picsColumn}>
            {[0, 1].map((i) => {
              const done = finishedIds.includes(DIALOGS[i].id);
              const active = activeDialogIdx === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.pictureBox,
                    done && styles.pictureDone,
                    active && styles.pictureActive,
                  ]}
                  activeOpacity={0.9}
                  onPress={() => startDialog(i)}
                >
                  <Image source={pictures[i]} style={styles.image} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {i === 0 ? "🎁 1" : "🎁 2"}
                    </Text>
                  </View>
                  {done && (
                    <View style={styles.doneMark}>
                      <Text style={styles.doneText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Subtitles + Mic when a dialog is active */}
          {activeDialogIdx !== null && (
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>
                {activeDialogIdx === 0
                  ? "Dialog 1 — Computer game"
                  : "Dialog 2 — Art set"}
              </Text>

              <View style={styles.subtitleWrap}>
                {subtitle ? (
                  <>
                    <Text style={styles.en}>{subtitle.en}</Text>
                    <Text style={styles.uz}>{subtitle.uz}</Text>
                  </>
                ) : (
                  <Text style={styles.hint}>
                    Tinglang va takrorlash uchun mikrofon tugmasini bosing.
                  </Text>
                )}
              </View>

              {/* Mic during repeat step */}
              {DIALOGS[activeDialogIdx].steps[activeStepIdx].type ===
                "repeat" && (
                <View style={styles.micRow}>
                  <TouchableOpacity
                    style={[styles.micBtn, recActive && styles.micBtnOn]}
                    onPress={recActive ? stopRecording : startRecording}
                  >
                    <Text style={styles.micText}>
                      {recActive ? "■ Recording..." : "🎤 Repeat"}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.micHint}>
                    {recAllowed === false
                      ? "Mikrofonga ruxsat berilmadi"
                      : recActive
                      ? "3 soniyada yozib olinadi"
                      : "Bosib, gapiring"}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Completion / Next */}
          {allDone && (
            <TouchableOpacity style={Styles.NextButton} onPress={next}>
              <Text style={Styles.listenText}>Next</Text>
            </TouchableOpacity>
          )}

          {showSuccess && <Success />}
          {showError && <OnError />}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Intro overlay
  overlay: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  ipal: { width: 160, height: 160, resizeMode: "contain", marginBottom: 12 },
  introText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  startBtn: {
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 16,
  },
  startText: { color: "#fff", fontSize: 18, fontWeight: "800" },

  // Pictures (original layout)
  picsColumn: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 6,
    alignItems: "center",
    gap: 10,
  },
  pictureBox: {
    height: "42%",
    width: "85%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  pictureActive: { borderColor: "#3b82f6" },
  pictureDone: { borderColor: "#22c55e" },
  doneMark: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "#22c55e",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: { color: "#fff", fontWeight: "800" },

  // Dialog card
  dialogCard: {
    margin: 12,
    marginBottom: 90,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "#eee",
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitleWrap: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  en: { fontSize: 18, fontWeight: "700", color: "#111", textAlign: "center" },
  uz: { fontSize: 14, color: "#444", fontStyle: "italic", textAlign: "center" },
  hint: { color: "#666", textAlign: "center" },

  micRow: { alignItems: "center", marginTop: 10, gap: 6 },
  micBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
  },
  micBtnOn: { backgroundColor: "#dc2626" },
  micText: { color: "#fff", fontWeight: "800" },
  micHint: { fontSize: 12, color: "#666" },
});
