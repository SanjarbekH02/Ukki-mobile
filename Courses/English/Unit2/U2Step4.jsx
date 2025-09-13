import { Audio } from "expo-av";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";
import WordPractice from "../../../components/Utils/Talaffuz";
import WordGameAssist from "../../../components/Utils/WordGame";

export default function U2Step4({ next }) {
  const [sound, setSound] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [resultText, setResultText] = useState("");
  const [disableBtns, setDisableBtns] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showPointer, setShowPointer] = useState(false);
  const [isSucces, setIsSucces] = useState(false);
  const [isError, setIsError] = useState(false);
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false);
  const [finished, setFinished] = useState(false);

  const audios = [
    {
      url: "https://ukkibackend.soof.uz/media/audio/CD1-15-1.mp3",
      correct: "img1",
    },
    {
      url: "https://ukkibackend.soof.uz/media/audio/CD1-15-2.mp3",
      correct: "img2",
    },
    {
      url: "https://ukkibackend.soof.uz/media/audio/CD1-15-3.mp3",
      correct: "img3",
    },
    {
      url: "https://ukkibackend.soof.uz/media/audio/CD1-15-4.mp3",
      correct: "img4",
    },
    {
      url: "https://ukkibackend.soof.uz/media/audio/CD1-15-5.mp3",
      correct: "img5",
    },
    {
      url: "https://ukkibackend.soof.uz/media/audio/CD1-15-6.mp3",
      correct: "img6",
    },
  ];

  const images = {
    img1: require("../../../assets/images/qalam1.png"),
    img2: require("../../../assets/images/kitob.png"),
    img3: require("../../../assets/images/parta.png"),
    img4: require("../../../assets/images/stol.png"),
    img5: require("../../../assets/images/ochirgich.png"),
    img6: require("../../../assets/images/qalam.png"),
  };

  async function playAudio(audioUrl) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setShowQuestion(true); // audio tugagach "Bu qaysi rasm?" chiqadi
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.log("Audio error:", error);
    }
  }

  const startGame = () => {
    setGameStarted(true);
    setCurrentIndex(0);
    playAudio(audios[0].url);
  };

  const handlePress = async (imgKey) => {
    if (disableBtns || !showQuestion) return;
    setDisableBtns(true);

    const correctKey = audios[currentIndex].correct;
    if (imgKey === correctKey) {
      setResultText("✅ To‘g‘ri!");
      setIsSucces(true);
      setTimeout(() => {
        setIsSucces(false);
      }, 2000);
      setTimeout(() => {
        setShowQuestion(false);
        setResultText("");
        if (currentIndex < audios.length - 1) {
          setCurrentIndex(currentIndex + 1);
          playAudio(audios[currentIndex + 1].url);
        } else {
          setResultText("🎉 O‘yin tugadi!");
          setFinished(true);
        }
        setDisableBtns(false);
      }, 1000);
    } else {
      setResultText("❌ Xato, qaytadan tingla!");
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
      setTimeout(() => {
        setResultText("");
        playAudio(audios[currentIndex].url);
        setDisableBtns(false);
      }, 1200);
    }
  };

  return (
    <>
      {dictionary ? (
        <>
          {wordgame ? (
            <FlashCards
              setDictionary={setWordgame}
              data={[
                {
                  word: "pencil",
                  translation: "qalam",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/qalam.mp3",
                },
                {
                  word: "and",
                  translation: "va",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/va.mp3",
                },
                {
                  word: "desk",
                  translation: "parta",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/parta.mp3",
                },
                {
                  word: "chair",
                  translation: "stul",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/stul.mp3",
                },
                {
                  word: "eraser",
                  translation: "o'chirg'ich",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'chirg'ich.mp3",
                },
                {
                  word: "all again",
                  translation: "hammasini qaytadan",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/hammasini  qaytadan.mp3",
                },
              ]}
            />
          ) : talaffuz ? (
            <WordPractice
              setWordgame={setWordgame}
              setDictionary={setDictionary}
              setTalaffuz={setTalaffuz}
              words={[
                {
                  text: "pencil",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/qalam.mp3",
                },
                {
                  text: "and",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/va.mp3",
                },
                {
                  text: "desk",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/parta.mp3",
                },
                {
                  text: "chair",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/stul.mp3",
                },
                {
                  text: "eraser",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'chirg'ich.mp3",
                },
                {
                  text: "all again",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/hammasini  qaytadan.mp3",
                },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={["pencil", "and", "desk", "chair", "eraser", "all again"]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/qalam.mp3",
                "https://ukkibackend.soof.uz/media/audio/va.mp3",
                "https://ukkibackend.soof.uz/media/audio/parta.mp3",
                "https://ukkibackend.soof.uz/media/audio/stul.mp3",
                "https://ukkibackend.soof.uz/media/audio/o'chirg'ich.mp3",
                "https://ukkibackend.soof.uz/media/audio/hammasini  qaytadan.mp3",
              ]}
            />
          )}
        </>
      ) : (
        <View style={Styles.stepContainer}>
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            setShowPointer={setShowPointer}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila_1.mp3"
          />
          <View style={styles.imgBlock}>
            {Object.entries(images).map(([key, img], index) => (
              <TouchableOpacity
                key={key}
                onPress={() => handlePress(key)}
                style={styles.imgBtn}
                disabled={disableBtns}
              >
                <View style={styles.imgNumber}>
                  <Text style={{ color: "#fff" }}>{index + 1}</Text>
                </View>
                <Image style={styles.image} source={img} />
              </TouchableOpacity>
            ))}
          </View>

          {!gameStarted && (
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.playBtn} onPress={startGame}>
                <Text style={styles.playText}>▶️ Play</Text>
              </TouchableOpacity>
            </View>
          )}

          {showQuestion && (
            <Text style={styles.question}>❓ Bu qaysi rasm?</Text>
          )}
          <Text style={styles.result}>{resultText}</Text>
          {finished && (
            <TouchableOpacity style={Styles.NextButton} onPress={next}>
              <Text style={Styles.listenText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {isSucces && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  playBtn: {
    backgroundColor: "#009400ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
  },
  playText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "black",
    textAlign: "center",
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    color: "white",
    textAlign: "center",
  },
  imgBlock: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "center",
  },
  imgBtn: { width: "45%", height: 170, margin: 5, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "stretch" },
  imgNumber: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7e7e7eff",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
});
