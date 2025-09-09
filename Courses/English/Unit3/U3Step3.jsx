import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OnError from "../../../components/Utils/OnError";
import Success from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";
import Styles from "../../../Styles/Styles";

export default function U3Step3({ next }) {
  const soundRef = useRef(null);

  // top bar controls like your U3Step1
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);

  // game state
  const [currentIndex, setCurrentIndex] = useState(0); // which word is being asked (0..9)
  const [foundNumbers, setFoundNumbers] = useState([]); // hide numbers that are solved
  const [finished, setFinished] = useState(false);

  // feedback
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [label, setLabel] = useState(""); // EN — UZ text after a correct tap

  // teacher-book fixed order (with your backend audio)
  const audioList = [
    "https://ukkibackend.soof.uz/media/audio/CD1-23-1.mp3", // art set
    "https://ukkibackend.soof.uz/media/audio/CD1-23-2.mp3", // camera
    "https://ukkibackend.soof.uz/media/audio/CD1-23-3.mp3", // ball
    "https://ukkibackend.soof.uz/media/audio/CD1-23-4.mp3", // doll
    "https://ukkibackend.soof.uz/media/audio/CD1-23-5.mp3", // computer
    "https://ukkibackend.soof.uz/media/audio/CD1-23-6.mp3", // computer game
    "https://ukkibackend.soof.uz/media/audio/CD1-23-7.mp3", // teddy bear
    "https://ukkibackend.soof.uz/media/audio/CD1-23-8.mp3", // kite
    "https://ukkibackend.soof.uz/media/audio/CD1-23-9.mp3", // bike
    "https://ukkibackend.soof.uz/media/audio/CD1-23-10.mp3", // robot
  ];

  // numbers → indices in audioList
  const numberToIndex = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
  };

  // EN—UZ labels shown after correct taps
  const labels = [
    "art set — rasm chizish to‘plami",
    "camera — kamera",
    "ball — koptok",
    "doll — qo‘g‘irchoq",
    "computer — kompyuter",
    "computer game — kompyuter o‘yini",
    "teddy bear — yumshoq ayiqcha",
    "kite — varrak",
    "bike — velosiped",
    "robot — robot",
  ];

  const playCurrent = async () => {
    try {
      if (soundRef.current) await soundRef.current.unloadAsync();
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioList[currentIndex] },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (e) {
      console.log("Audio play error:", e);
    }
  };

  // auto-play the current prompt
  useEffect(() => {
    if (currentIndex < audioList.length) {
      playCurrent();
    } else {
      setFinished(true);
    }
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleNumberPress = async (n) => {
    const expected = currentIndex;
    const tapped = numberToIndex[n];

    if (tapped === expected) {
      // correct
      setLabel(labels[expected]);
      setShowSuccess(true);
      setFoundNumbers((prev) => [...prev, n]);

      // short glow/pause, then next word
      setTimeout(() => setShowSuccess(false), 1000);
      setTimeout(() => {
        setLabel("");
        setCurrentIndex((p) => p + 1);
      }, 900);
    } else {
      // wrong
      setShowError(true);
      setTimeout(() => setShowError(false), 800);
      setTimeout(() => {
        setLabel("");
        playCurrent(); // replay same word after brief pause
      }, 700);
    }
  };

  return (
    <>
      {dictionary ? (
        <FlashCards
          setDictionary={setDictionary}
          data={[
            {
              word: "art set",
              translation: "rasm chizish to‘plami",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/rasmchizish toplami.mp3",
            },
            {
              word: "camera",
              translation: "kamera",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/kamera.mp3",
            },
            {
              word: "ball",
              translation: "koptok",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
            },
            {
              word: "doll",
              translation: "qo‘g‘irchoq",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3",
            },
            {
              word: "computer",
              translation: "kompyuter",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/komputer.mp3",
            },
            {
              word: "computer game",
              translation: "kompyuter o‘yini",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/oyin.mp3",
            },
            {
              word: "teddy bear",
              translation: "yumshoq ayiqcha",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/yumshoq_ayiqcha.mp3",
            },
            {
              word: "kite",
              translation: "varrak",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
            },
            {
              word: "bike",
              translation: "velosiped",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
            },
            {
              word: "robot",
              translation: "robot",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/robot.mp3",
            },
          ]}
        />
      ) : (
        <View style={Styles.container}>
          {/* same image path/style as in your U3Step1 snippet */}
          <Image
            style={[Styles.ImgFull, { height: "75%" }]}
            source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
          />

          {/* number chips 1..10 placed over the image (adjust positions to your art) */}
          <View style={s.overlay}>
            {[...Array(10).keys()].map((i) => {
              const n = i + 1;
              if (foundNumbers.includes(n)) return null;
              return (
                <TouchableOpacity
                  key={n}
                  style={[s.num, s[`num${n}`]]}
                  onPress={() => handleNumberPress(n)}
                  activeOpacity={0.85}
                >
                  <Text style={Styles.userNumberText}>{n}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* EN—UZ label */}
          {label !== "" && (
            <View style={s.labelWrap}>
              <Text style={s.labelText}>{label}</Text>
            </View>
          )}

          {/* Next after finished */}
          {finished && (
            <TouchableOpacity style={Styles.NextButton} onPress={next}>
              <Text style={Styles.listenText}>Next</Text>
            </TouchableOpacity>
          )}

          {/* same control bar pattern as U3Step1 */}
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            // teacher/instruction audio (adjust if you have a specific intro)
            audioUrl="https://ukkibackend.soof.uz/media/audio/Aziz-bolajon,-tingla-va-top-(1-10)-o'yin.mp3"
            playBtn={true}
          />

          {showSuccess && <Success />}
          {showError && <OnError message="Yana urinib ko‘r / Try again" />}
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "75%",
  },
  num: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#7272728e",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 1,
    borderColor: "#fff",
  },
  // 👉 tweak these to match the toy locations on your artwork
  num1: { top: "40%", left: "0%" },
  num2: { top: "25%", left: "40%" },
  num3: { top: "27%", right: "5%" },
  num4: { bottom: "35%", left: "10%" },
  num5: { bottom: "33%", left: "40%" },
  num6: { bottom: "35%", right: "32%" },
  num7: { bottom: "27%", left: "42%" },
  num8: { bottom: "27%", right: "27%" },
  num9: { bottom: "27%", right: "10%" },
  num10: { bottom: "17%", right: "16%" },

  labelWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 80,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});
