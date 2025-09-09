import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";

// --- keep your original pictures ---
const pictures = [
  require("../../../assets/images/unit-3/unit-2-step-4-1.jpg"),
  require("../../../assets/images/unit-3/unit-2-step-4-2.jpg"),
  require("../../../assets/images/unit-3/unit-2-step-4-3.jpg"),
];

export default function U3Step4({ next }) {
  // Top controls (consistent with your other steps)
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);

  // Audio & karaoke state
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(1); // avoid div by zero
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  // UX
  const [isSucces, setIsSucces] = useState(false);
  const [isError, setIsError] = useState(false);
  const [finished, setFinished] = useState(false);

  // --- AUDIO SOURCE (swap to your exact file if different) ---
  const songUrl =
    "https://ukkibackend.soof.uz/media/audio/CD1-41-toys-song.mp3";

  // --- TIMED LYRICS (seconds) ---
  // Tip: If your timing differs, just tweak start/end; karaoke will sync automatically.
  const LYRICS = [
    // Verse 1 - Chorus
    {
      start: 0.0,
      end: 3.5,
      en: "Toys, toys, girls and boys,",
      uz: "O‘yinchoqlar, o‘yinchoqlar, qizlar va bolalar,",
    },
    {
      start: 3.5,
      end: 6.5,
      en: "What’s your favorite toy?",
      uz: "Sening sevimli o‘yinchog‘ing nima?",
    },
    // Verse 1 - Kite
    {
      start: 7.0,
      end: 9.0,
      en: "My kite. My kite. My red and yellow kite.",
      uz: "Mening varragim. Mening varragim. Mening qizil va sariq varragim.",
    },
    {
      start: 9.0,
      end: 13.0,
      en: "My favorite toy’s my red and yellow kite.",
      uz: "Mening sevimli o‘yinchog‘im mening qizil va sariq varragim.",
    },
    // Chorus
    {
      start: 13.2,
      end: 16.7,
      en: "Toys, toys, girls and boys,",
      uz: "O‘yinchoqlar, o‘yinchoqlar, qizlar va bolalar,",
    },
    {
      start: 16.7,
      end: 19.7,
      en: "What’s your favorite toy?",
      uz: "Sening sevimli o‘yinchog‘ing nima?",
    },
    // Verse 2 - Robot
    {
      start: 20.0,
      end: 23.0,
      en: "My robot. My robot. My blue and orange robot.",
      uz: "Mening robotim. Mening robotim. Mening ko‘k va zarg‘aldoq robotim.",
    },
    {
      start: 23.0,
      end: 27.0,
      en: "My favorite toy’s my blue and orange robot.",
      uz: "Mening sevimli o‘yinchog‘im mening ko‘k va zarg‘aldoq robotim.",
    },
    // Chorus
    {
      start: 27.2,
      end: 30.7,
      en: "Toys, toys, girls and boys,",
      uz: "O‘yinchoqlar, o‘yinchoqlar, qizlar va bolalar,",
    },
    {
      start: 30.7,
      end: 33.7,
      en: "What’s your favorite toy?",
      uz: "Sening sevimli o‘yinchog‘ing nima?",
    },
    // Verse 3 - Teddy
    {
      start: 34.0,
      end: 37.0,
      en: "My teddy. My teddy. My green teddy bear.",
      uz: "Mening teddym. Mening teddym. Mening yashil yumshoq ayiqcham.",
    },
    {
      start: 37.0,
      end: 41.0,
      en: "My favorite toy’s my green teddy bear.",
      uz: "Mening sevimli o‘yinchog‘im mening yashil yumshoq ayiqcham.",
    },
  ];

  // Vocabulary for FlashCards (with audio where available in your backend)
  const VOCAB = [
    {
      word: "Toys",
      translation: "O‘yinchoqlar",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/oyinchoqlar.mp3",
    },
    {
      word: "Girls",
      translation: "Qizlar",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/qizlar.mp3",
    },
    {
      word: "Boys",
      translation: "Bolalar",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/bolalar.mp3",
    },
    {
      word: "What’s",
      translation: "Nima? (What is)",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/whats.mp3",
    },
    {
      word: "Your",
      translation: "Sening",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/sening.mp3",
    },
    {
      word: "Favorite",
      translation: "Sevimli",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/sevimli.mp3",
    },
    {
      word: "Toy",
      translation: "O‘yinchoq",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/oyinchoq.mp3",
    },
    {
      word: "My",
      translation: "Mening",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/mening.mp3",
    },
    {
      word: "Kite",
      translation: "Varrak",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
    },
    {
      word: "Red",
      translation: "Qizil",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/qizil.mp3",
    },
    {
      word: "And",
      translation: "Va",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/va.mp3",
    },
    {
      word: "Yellow",
      translation: "Sariq",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/sariq.mp3",
    },
    {
      word: "Robot",
      translation: "Robot",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/robot.mp3",
    },
    {
      word: "Blue",
      translation: "Ko‘k",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/kok.mp3",
    },
    {
      word: "Orange",
      translation: "Zarg‘aldoq",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/zargaldoq.mp3",
    },
    {
      word: "Teddy",
      translation: "Yumshoq ayiqcha",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/yumshoq_ayiqcha.mp3",
    },
    {
      word: "Teddy bear",
      translation: "Yumshoq ayiqcha",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/yumshoq_ayiqcha.mp3",
    },
    {
      word: "Green",
      translation: "Yashil",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/yashil.mp3",
    },
  ];

  // load & watch audio status
  useEffect(() => {
    let interval;
    (async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: songUrl },
          { shouldPlay: false }
        );
        soundRef.current = sound;

        // read duration once loaded
        const st = await sound.getStatusAsync();
        if (st.isLoaded) {
          setDurationMs(st.durationMillis ?? 1);
        }

        // polling for current position to drive karaoke
        interval = setInterval(async () => {
          if (!soundRef.current) return;
          const status = await soundRef.current.getStatusAsync();
          if (!status.isLoaded) return;

          setPositionMs(status.positionMillis ?? 0);
          setDurationMs(status.durationMillis ?? 1);
          setIsPlaying(status.isPlaying);

          // advance karaoke line based on current time
          const t = (status.positionMillis ?? 0) / 1000;
          const idx = LYRICS.findIndex((ln) => t >= ln.start && t < ln.end);
          if (idx !== -1 && idx !== currentLineIdx) {
            setCurrentLineIdx(idx);
          }

          // handle finish
          if (status.didJustFinish) {
            setIsPlaying(false);
            setFinished(true);
            setCurrentLineIdx(LYRICS.length - 1);
            setIsSucces(true);
            setTimeout(() => setIsSucces(false), 1500);
          }
        }, 120); // smooth-enough karaoke
      } catch (e) {
        console.log("Audio init error:", e);
        setIsError(true);
        setTimeout(() => setIsError(false), 1000);
      }
    })();

    return () => {
      if (interval) clearInterval(interval);
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songUrl]);

  const togglePlay = async () => {
    try {
      if (!soundRef.current) return;
      const st = await soundRef.current.getStatusAsync();
      if (!st.isLoaded) return;

      if (st.isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        if (finished) {
          // replay from start
          await soundRef.current.setPositionAsync(0);
          setFinished(false);
          setCurrentLineIdx(0);
        }
        await soundRef.current.playAsync();
      }
    } catch (e) {
      console.log("toggle play error:", e);
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
    }
  };

  const progress = Math.min(1, positionMs / Math.max(1, durationMs));

  return (
    <>
      {dictionary ? (
        <FlashCards setDictionary={setDictionary} data={VOCAB} />
      ) : (
        <View style={[Styles.container, { backgroundColor: "#fff" }]}>
          {/* KEEP: your three pictures horizontally */}
          <View style={styles.picturesRow}>
            {pictures.map((picture, index) => (
              <Image key={index} source={picture} style={styles.image} />
            ))}
          </View>

          {/* Karaoke card */}
          <View style={styles.karaokeCard}>
            <Text style={styles.karaokeTitle}>🎵 Toys Song — Karaoke</Text>

            {/* Lines: highlight current; show EN + UZ */}
            <View style={styles.linesWrap}>
              {LYRICS.map((ln, i) => {
                const active = i === currentLineIdx;
                return (
                  <View
                    key={`${ln.start}-${ln.end}`}
                    style={[styles.line, active && styles.lineActive]}
                  >
                    <Text style={[styles.en, active && styles.enActive]}>
                      {ln.en}
                    </Text>
                    <Text style={[styles.uz, active && styles.uzActive]}>
                      {ln.uz}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
                <Text style={styles.playText}>
                  {isPlaying ? "⏸ Pause" : finished ? "↻ Replay" : "▶ Play"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Next after finish */}
          {finished && (
            <TouchableOpacity style={Styles.NextButton} onPress={next}>
              <Text style={Styles.listenText}>Next</Text>
            </TouchableOpacity>
          )}

          {/* Top utility bar like other steps */}
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Yangi so‘zlarni ko‘rib chiqing va qo‘shiqni birga kuylang.mp3"
            playBtn={true}
          />

          {isSucces && <ConfettiEffect />}
          {isError && <ErrorOverlay />}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // keep content look: three images row
  picturesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "38%",
    paddingHorizontal: 8,
    gap: 8,
  },
  image: {
    flex: 1,
    height: "100%",
    resizeMode: "contain",
  },

  karaokeCard: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 90,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  karaokeTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  linesWrap: {
    flex: 1,
    gap: 6,
    paddingVertical: 6,
  },
  line: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  lineActive: {
    backgroundColor: "rgba(255, 235, 59, 0.35)", // soft highlight
  },
  en: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  enActive: { color: "#111" },
  uz: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  uzActive: { color: "#333" },

  progressTrack: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B35",
  },
  controls: {
    alignItems: "center",
    marginTop: 12,
  },
  playBtn: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 22,
    elevation: 4,
  },
  playText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
