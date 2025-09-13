import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";
import FlashCards from "../../../components/YangiSozlar";
import WordPractice from "../../../components/Utils/Talaffuz";
import WordGameAssist from "../../../components/Utils/WordGame";

const U2Step1 = ({ next }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const soundRef = useRef(null);
  const [listen2, setListen2] = useState(false);
  const [showPointer, setShowPointer] = useState(false);
  const [showPointer2, setShowPointer2] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false);

  const audioList = [
    "https://ukkibackend.soof.uz/media/audio/CD1-23-1.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-2.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-3.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-4.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-5.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-6.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-7.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-8.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-9.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-23-10.mp3",
  ];

  const mapping = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
  };

  useEffect(() => {
    if (showPointer || showPointer2) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [showPointer, showPointer2]);

  const playAudio = async (index) => {
    setShowPointer(false);
    if (index >= audioList.length) {
      setCurrentIndex(null);
      setShowPointer2(true);
      return;
    }

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioList[index] },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playAudio(index + 1);
        }
      });
      setCurrentIndex(index);
    } catch (error) {
      console.log("Audio error:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const [buttonIndex, setButtonIndex] = useState(null);
  const buttonAudios = {
    1: "https://ukkibackend.soof.uz/media/audio/CD1-22-1.mp3",
    2: "https://ukkibackend.soof.uz/media/audio/CD1-22-2.mp3",
    3: "https://ukkibackend.soof.uz/media/audio/CD1-22-3.mp3",
    4: "https://ukkibackend.soof.uz/media/audio/CD1-22-4.mp3",
    5: "https://ukkibackend.soof.uz/media/audio/CD1-22-5.mp3",
    6: "https://ukkibackend.soof.uz/media/audio/CD1-22-6.mp3",
    7: "https://ukkibackend.soof.uz/media/audio/CD1-22-7.mp3",
    8: "https://ukkibackend.soof.uz/media/audio/CD1-22-8.mp3",
    9: "https://ukkibackend.soof.uz/media/audio/CD1-22-9.mp3",
    10: "https://ukkibackend.soof.uz/media/audio/CD1-22-10.mp3",
  };

  const handlePlay = async (btnIndex) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: buttonAudios[btnIndex] },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setButtonIndex(null);
        }
      });

      setButtonIndex(btnIndex);
    } catch (error) {
      console.log("Audio play error:", error);
    }
  };

  const hidePointer = () => {
    setShowPointer(false);
    setShowPointer2(false);
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
                  word: "children",
                  translation: "bolalar",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/children bolalar.mp3",
                },
                {
                  word: "ready?",
                  translation: "tayyormisiz",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/tayyormisz.mp3",
                },
                {
                  word: "yes",
                  translation: "ha",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/ha.mp3",
                },
                {
                  word: "what",
                  translation: "nima",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/nima_1.mp3",
                },
                {
                  word: "white",
                  translation: "oq",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/oq.mp3",
                },
                {
                  word: "board",
                  translation: "doska",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/doska.mp3",
                },
                {
                  word: "door",
                  translation: "eshik",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/eshik.mp3",
                },
                {
                  word: "good",
                  translation: "yaxshi",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yaxshi.mp3",
                },
                {
                  word: "now",
                  translation: "hozir",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/hozir.mp3",
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
                  text: "children",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/children bolalar.mp3",
                },
                {
                  text: "ready?",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/tayyormisz.mp3",
                },
                {
                  text: "yes",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/ha.mp3",
                },
                {
                  text: "what",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/nima.mp3",
                },
                {
                  text: "white",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/oq.mp3",
                },
                {
                  text: "board",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/doska.mp3",
                },
                {
                  text: "door",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/eshik.mp3",
                },
                {
                  text: "good",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yaxshi.mp3",
                },
                {
                  text: "now",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/hozir.mp3",
                },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={[
                "children",
                "ready?",
                "yes",
                "what",
                "white",
                "board",
                "door",
                "good",
                "now",
              ]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/children bolalar.mp3",
                "https://ukkibackend.soof.uz/media/audio/tayyormisz.mp3",
                "https://ukkibackend.soof.uz/media/audio/ha.mp3",
                "https://ukkibackend.soof.uz/media/audio/nima.mp3",
                "https://ukkibackend.soof.uz/media/audio/oq.mp3",
                "https://ukkibackend.soof.uz/media/audio/doska.mp3",
                "https://ukkibackend.soof.uz/media/audio/eshik.mp3",
                "https://ukkibackend.soof.uz/media/audio/yaxshi.mp3",
                "https://ukkibackend.soof.uz/media/audio/hozir.mp3",
              ]}
            />
          )}
        </>
      ) : (
        <View style={{ height: "100%", justifyContent: "center" }}>
          <View style={styles.container}>
            <ThreeButtons
              setDictionary={setDictionary}
              infoClick={infoClick}
              clicked={clicked}
              setClicked={setClicked}
              setInfoClick={setInfoClick}
              setShowPointer={setShowPointer}
              audioUrl="https://ukkibackend.soof.uz/media/audio/e4949dfd-4e72-449a-bba1-70de09457bed.mp3"
            />
            <TouchableOpacity
              style={Styles.listenBtn}
              onPress={() => playAudio(0)}
            >
              <Text style={Styles.listenNumber}>1</Text>
              <Text style={Styles.listenText}>Listen. Who's speaking? </Text>
              {showPointer && (
                <Animated.Image
                  source={require("../../../assets/images/hand2.png")}
                  style={[
                    styles.pointer,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                next();
                hidePointer();
              }}
              style={[Styles.listenBtn, Styles.listenBtn2]}
              //  disabled={!showPointer2}
            >
              <Text style={Styles.listenNumber}>2</Text>
              <Text style={Styles.listenText}>Listen. point, and say. </Text>
              {showPointer2 && (
                <Animated.Image
                  source={require("../../../assets/images/hand2.png")}
                  style={[
                    styles.pointer,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                />
              )}
            </TouchableOpacity>

            <Image
              source={require("../../../assets/images/unit1,1.png")}
              style={styles.step2Img}
            />

            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber1,
                mapping[currentIndex] === 1 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 1 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>1</Text>
              )}
            </TouchableOpacity>

            {/* Button 2 */}
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber2,
                mapping[currentIndex] === 2 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 2 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>2</Text>
              )}
            </TouchableOpacity>

            {/* Button 3 */}
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber3,
                mapping[currentIndex] === 3 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 3 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>3</Text>
              )}
            </TouchableOpacity>

            {/* Button 4 */}
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber4,
                mapping[currentIndex] === 4 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 4 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>4</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber5,
                mapping[currentIndex] === 5 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 5 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>5</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber6,
                mapping[currentIndex] === 6 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 6 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>6</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber7,
                mapping[currentIndex] === 7 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 7 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>7</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber8,
                mapping[currentIndex] === 8 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 8 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>8</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber9,
                mapping[currentIndex] === 9 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 9 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>9</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userNumber,
                styles.userNumber10,
                mapping[currentIndex] === 10 && {
                  borderWidth: 0,
                  backgroundColor: "inherit",
                },
              ]}
            >
              {mapping[currentIndex] === 10 ? (
                <LottieView
                  source={require("../../../assets/images/vois.json")}
                  autoPlay
                  loop
                  style={Styles.userNumberImage}
                />
              ) : (
                <Text style={Styles.userNumberText}>10</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={[Styles.listenBtn3]}>
              <Text style={Styles.listenNumber}>3</Text>
              <Text style={Styles.listenText}>Listen and find. </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    height: "90%",
    backgroundColor: "#eee",
    marginBottom: 95,
  },
  step2Img: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  pointer: {
    position: "absolute",
    left: 70,
    top: "50%",
    width: 40,
    height: 40,
    resizeMode: "contain",
    zIndex: 10,
  },
  userNumber: {
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
  userNumber1: {
    top: "40%",
    left: "0%",
  },
  userNumber2: {
    top: "25%",
    left: "40%",
  },
  userNumber4: {
    bottom: "35%",
    left: "10%",
  },
  userNumber3: {
    top: "27%",
    right: "5%",
  },
  userNumber5: {
    bottom: "33%",
    left: "40%",
  },
  userNumber6: {
    bottom: "35%",
    right: "32%",
  },
  userNumber7: {
    bottom: "27%",
    left: "42%",
  },
  userNumber8: {
    bottom: "27%",
    right: "27%",
  },
  userNumber9: {
    bottom: "27%",
    right: "10%",
  },
  userNumber10: {
    bottom: "17%",
    right: "16%",
  },
});

export default U2Step1;
