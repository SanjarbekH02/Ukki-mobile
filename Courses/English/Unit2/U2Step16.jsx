import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import WordPractice from "../../../components/Utils/Talaffuz";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import WordGameAssist from "../../../components/Utils/WordGame";
import FlashCards from "../../../components/YangiSozlar";
import Styles from "../../../Styles/Styles";

const imagesLeft = [
  {
    src: require("../../../assets/images/cd341.jpg"),
    label: "Button 1",
    style: { top: "12%", left: 0 },
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-34-1.mp3",
    pair: 8,
  },
  {
    src: require("../../../assets/images/cd342.jpg"),
    label: "Button 2",
    style: { top: "22%", left: "23%", zIndex: 2 },
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-34-2.mp3",
    pair: 10,
  },
  {
    src: require("../../../assets/images/cd343.jpg"),
    label: "Button 3",
    style: { top: "35%", left: 0 },
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-34-3.mp3",
    pair: 11,
  },
  {
    src: require("../../../assets/images/cd344.jpg"),
    label: "Button 4",
    style: { top: "47%", left: "23%" },
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-34-4.mp3",
    pair: 9,
  },
  {
    src: require("../../../assets/images/cd345.jpg"),
    label: "Button 5",
    style: { top: "59%", left: 0 },
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-34-5.mp3",
    pair: 7,
  },
  {
    src: require("../../../assets/images/cd346.jpg"),
    label: "Button 6",
    style: { bottom: "8%", left: "23%" },
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-34-6.mp3",
    pair: 12,
  },
];

const imagesRight = [
  {
    src: require("../../../assets/images/cd347.jpg"),
    label: "Button 7",
    style: { top: "12%", right: "23%" },
    id: 7,
  },
  {
    src: require("../../../assets/images/cd348.jpg"),
    label: "Button 8",
    style: { top: "22%", right: 0 },
    id: 8,
  },
  {
    src: require("../../../assets/images/cd349.jpg"),
    label: "Button 9",
    style: { top: "35%", right: "23%" },
    id: 9,
  },
  {
    src: require("../../../assets/images/cd3410.jpg"),
    label: "Button 10",
    style: { top: "47%", right: 0 },
    id: 10,
  },
  {
    src: require("../../../assets/images/cd3411.jpg"),
    label: "Button 11",
    style: { top: "59%", right: "23%" },
    id: 11,
  },
  {
    src: require("../../../assets/images/cd3412.jpg"),
    label: "Button 12",
    style: { bottom: "8%", right: 0 },
    id: 12,
  },
];

const U2Step16 = ({ next }) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const soundRef = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false);

  const playAudio = async (uri) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.log("Audio error:", error);
    }
  };

  const handleLeftPress = (item, idx) => {
    playAudio(item.audio);
    setSelectedLeft(idx);
    setMessage("");
  };

  const handleRightPress = (item) => {
    if (selectedLeft !== null) {
      const leftItem = imagesLeft[selectedLeft];
      if (leftItem.pair === item.id) {
        setMessage("✅ To‘g‘ri!");
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
        const newMatched = [...matched, leftItem.label, item.label];
        setMatched(newMatched);
        setSelectedLeft(null);
        if (newMatched.length === imagesLeft.length + imagesRight.length) {
          setMessage("🎉 O‘yin tugadi!");
          setFinished(true);
        }
      } else {
        setMessage("❌ Xato, qayta urinib ko‘ring!");
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 1000);
        setSelectedLeft(null);
      }
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
                  word: "Robot",
                  translation: "Robot",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/robot.mp3",
                },
                {
                  word: "Paint",
                  translation: "Bo‘yamoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/bo'yamoq.mp3",
                },
                {
                  word: "Cook",
                  translation: "ovqat pishirmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/ovqat pishirmoq.mp3",
                },
                {
                  word: "Talk",
                  translation: "gaplashmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/gaplashmoq.mp3",
                },
                {
                  word: "Family",
                  translation: "oila",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/oila.mp3",
                },
                {
                  word: "Children",
                  translation: "bolalar",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/bolalar.mp3",
                },
                {
                  word: "Kitchen",
                  translation: "oshxona",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/oshxona.mp3",
                },
                {
                  word: "Food",
                  translation: "ovqat",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/ovqat.mp3",
                },
                {
                  word: "Brush",
                  translation: "cho‘tka",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/cho'tka.mp3",
                },
                {
                  word: "Together",
                  translation: "birga",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/birga.mp3",
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
                  text: "Robot",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/robot.mp3",
                },
                {
                  text: "Paint",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/bo'yamoq.mp3",
                },
                {
                  text: "Cook",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/ovqat pishirmoq.mp3",
                },
                {
                  text: "Talk",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/gaplashmoq.mp3",
                },
                {
                  text: "Family",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/oila.mp3",
                },
                {
                  text: "Children",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/bolalar.mp3",
                },
                {
                  text: "Kitchen",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/oshxona.mp3",
                },
                {
                  text: "Food",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/ovqat.mp3",
                },
                {
                  text: "Brush",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/cho'tka.mp3",
                },
                {
                  text: "Together",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/birga.mp3",
                },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={[
                "Robot",
                "Paint",
                "Cook",
                "Talk",
                "Family",
                "Children",
                "Kitchen",
                "Food",
                "Brush",
                "Together",
              ]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/robot.mp3",
                "https://ukkibackend.soof.uz/media/audio/bo'yamoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/ovqat pishirmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/gaplashmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/oila.mp3",
                "https://ukkibackend.soof.uz/media/audio/bolalar.mp3",
                "https://ukkibackend.soof.uz/media/audio/oshxona.mp3",
                "https://ukkibackend.soof.uz/media/audio/ovqat.mp3",
                "https://ukkibackend.soof.uz/media/audio/cho'tka.mp3",
                "https://ukkibackend.soof.uz/media/audio/birga.mp3",
              ]}
            />
          )}
        </>
      ) : (
        <View style={styles.container}>
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, Rasmlarga qara va ularni moslashtir. .mp3"
          />
          {imagesLeft.map((item, idx) => {
            if (matched.includes(item.label)) return null;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.button,
                  item.style,
                  selectedLeft === idx && {
                    borderWidth: 3,
                    borderColor: "blue",
                  },
                ]}
                onPress={() => handleLeftPress(item, idx)}
              >
                <Image source={item.src} style={styles.image} />
              </TouchableOpacity>
            );
          })}

          <View style={styles.centerLine}></View>

          {imagesRight.map((item, idx) => {
            if (matched.includes(item.label)) return null;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.button, item.style]}
                onPress={() => handleRightPress(item)}
              >
                <Image source={item.src} style={styles.image} />
              </TouchableOpacity>
            );
          })}

          {message !== "" && (
            <View style={styles.messageBox}>
              <Text
                style={[
                  styles.message,
                  message.includes("Xato") && { color: "red" },
                ]}
              >
                {message}
              </Text>
            </View>
          )}
          {finished && (
            <TouchableOpacity style={Styles.NextButton} onPress={next}>
              <Text style={Styles.listenText}>Next </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {isSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  button: {
    position: "absolute",
    alignItems: "center",
    width: "25%",
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  centerLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#b4b4b4ff",
    position: "absolute",
    top: 0,
    left: "50%",
  },
  messageBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 0,
    alignItems: "flex-start",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
});

export default U2Step16;
