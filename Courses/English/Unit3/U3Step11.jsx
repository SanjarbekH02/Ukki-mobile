import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step17({ next }) {
  const [sound, setSound] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [playStarted, setPlayStarted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const audios = [
    "https://ukkibackend.soof.uz/media/audio/CD1-41-3.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-41-6.mp3",
    "https://ukkibackend.soof.uz/media/audio/kitob.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-41-7.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-41-5.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-41-10.mp3",
  ];

  const images = [
    require("../../../assets/images/unit-3/c2.jpg"),
    require("../../../assets/images/unit-3/c3.jpg"),
    require("../../../assets/images/unit-3/c5.jpg"),
    require("../../../assets/images/unit-3/c4.jpg"),
    require("../../../assets/images/unit-3/c6.jpg"),
    require("../../../assets/images/unit-3/c1.jpg"),
  ];

  const correctIndexes = [5, 0, 1, 3, 2, 4]; // to‘g‘ri rasm indekslari

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const playAudio = async (index) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audios[index],
    });
    setSound(newSound);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setQuestionVisible(true);
      }
    });

    await newSound.playAsync();
  };

  const handlePlayButton = () => {
    setPlayStarted(true);
    playAudio(currentIndex);
  };

  const handleImagePress = async (index) => {
    if (!playStarted) return; // Play bosilmaguncha rasmni bosishni bloklash

    if (correctIndexes[currentIndex] === index) {
      setFeedback("To‘g‘ri!");
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      setQuestionVisible(false);

      const nextIndex = currentIndex + 1;
      if (nextIndex < audios.length) {
        setCurrentIndex(nextIndex);
        setTimeout(() => {
          setFeedback("");
          playAudio(nextIndex);
        }, 1000);
      } else {
        setAllCorrect(true);
      }
    } else {
      setFeedback("Noto‘g‘ri!");
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      setTimeout(() => {
        setFeedback("");
        playAudio(currentIndex);
      }, 1000);
    }
  };

  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [, setDictionary] = useState(false);

  return (
    <>
      <View style={Styles.container}>
        <ThreeButtons
          audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, kerakli rasmni tanla_1.mp3"
          setDictionary={setDictionary}
          infoClick={infoClick}
          clicked={clicked}
          setClicked={setClicked}
          setInfoClick={setInfoClick}
        />

        {playStarted && questionVisible && (
          <Text style={styles.question}>Qaysi rasm?</Text>
        )}

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        <View style={styles.imgGrid}>
          {images.map((img, i) => (
            <TouchableOpacity
              key={i}
              style={styles.imgBox}
              onPress={() => handleImagePress(i)}
              disabled={!playStarted} // Play bosilmaguncha rasmni bosishni o‘chirish
            >
              <Image source={img} style={styles.image} />
            </TouchableOpacity>
          ))}

          {!playStarted && (
            <TouchableOpacity style={styles.playBtn} onPress={handlePlayButton}>
              <Text style={styles.playText}>▶ Play</Text>
            </TouchableOpacity>
          )}
        </View>

        {allCorrect && (
          <TouchableOpacity style={Styles.NextButton} onPress={next}>
            <Text style={styles.nextText}>Keyingi ➜</Text>
          </TouchableOpacity>
        )}
      </View>
      {isSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  imgGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 50, 
    position: "relative",
  },
  imgBox: {
    width: "48%",
    aspectRatio: 1,
    marginVertical: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
    borderRadius: 10,
  },
  playBtn: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }], 
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "#ff9800",
    borderRadius: 15,
    zIndex: 10,
  },
  playText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  nextBtn: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    alignSelf: "center",
  },
  nextText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  question: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  feedback: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    color: "orange",
    fontWeight: "bold",
  },
});
