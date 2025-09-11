import { useEffect, useState, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import Styles from "../../../Styles/Styles";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";
import WordPractice from "../../../components/Utils/Talaffuz";
import WordGameAssist from "../../../components/Utils/WordGame";

export default function Step12({ next }) {
  const [activeBtns, setActiveBtns] = useState(Array(7).fill(false));
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false);
  const [playTriggered, setPlayTriggered] = useState(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false); 
  const soundRef = useRef(null);

  const audioLinks = [
    "https://ukkibackend.soof.uz/media/audio/CD1-12-1.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-12-2.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-12-3.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-12-4.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-12-5.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-12-6.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-12-7.mp3",
  ];

  const colors = [
    "#FF0000",
    "#FFFF00",
    "#008000",
    "#0000FF",
    "#FFC0CB",
    "#FFA500",
    "#800080",
  ];

  const buttonPositions = [
    styles.colorBtn1,
    styles.colorBtn2,
    styles.colorBtn3,
    styles.colorBtn4,
    styles.colorBtn7,
    styles.colorBtn6,
    styles.colorBtn5,
  ];

  const audioPlay = async (url) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
      return sound;
    } catch (error) {
      console.log("Audio play error:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const playSequentially = async () => {
      setIsPlayingSequence(true); 
      for (
        let currentIndex = 0;
        currentIndex < audioLinks.length;
        currentIndex++
      ) {
        if (!isMounted) break;
        setCurrentPlayingIndex(currentIndex);
        await audioPlay(audioLinks[currentIndex]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setCurrentPlayingIndex(-1);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      if (isMounted) {
        setPlayTriggered(false);
        setIsPlayingSequence(false); 
      }
    };

    if (playTriggered) {
      playSequentially();
    }

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [playTriggered]);

  const handlePressIn = async (index) => {
    const newBtns = [...activeBtns];
    newBtns[index] = true;
    setActiveBtns(newBtns);
    setCurrentPlayingIndex(index);
    await audioPlay(audioLinks[index]);
  };

  const handlePressOut = (index) => {
    const newBtns = [...activeBtns];
    newBtns[index] = false;
    setActiveBtns(newBtns);
    if (currentPlayingIndex === index) {
      setTimeout(() => setCurrentPlayingIndex(-1), 2000);
    }
  };

  const handlePlayButton = async () => {
    if (isPlayingSequence) {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setCurrentPlayingIndex(-1);
      setPlayTriggered(false);
      setIsPlayingSequence(false);
    }
    setPlayTriggered(true);
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
                  word: "red",
                  translation: "qizil",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/qizil.mp3",
                },
                {
                  word: "yellow",
                  translation: "sariq",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/sariq.mp3",
                },
                {
                  word: "green",
                  translation: "yashil",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yashil.mp3",
                },
                {
                  word: "blue",
                  translation: "ko'k",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/ko'k.mp3",
                },
                {
                  word: "pink",
                  translation: "pushti",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/pushti.mp3",
                },
                {
                  word: "orange",
                  translation: "olov rang",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/olovrang.mp3",
                },
                {
                  word: "purple",
                  translation: "binafsha",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/binafsha.mp3",
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
                  text: "red",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/qizil.mp3",
                },
                {
                  text: "yellow",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/sariq.mp3",
                },
                {
                  text: "green",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yashil.mp3",
                },
                {
                  text: "blue",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/ko'k.mp3",
                },
                {
                  text: "pink",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/pushti.mp3",
                },
                {
                  text: "orange",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/olovrang.mp3",
                },
                {
                  text: "purple",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/binafsha.mp3",
                },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={[
                "red",
                "yellow",
                "green",
                "blue",
                "pink",
                "orange",
                "purple",
              ]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/qizil.mp3",
                "https://ukkibackend.soof.uz/media/audio/sariq.mp3",
                "https://ukkibackend.soof.uz/media/audio/yashil.mp3",
                "https://ukkibackend.soof.uz/media/audio/ko'k.mp3",
                "https://ukkibackend.soof.uz/media/audio/pushti.mp3",
                "https://ukkibackend.soof.uz/media/audio/olovrang.mp3",
                "https://ukkibackend.soof.uz/media/audio/binafsha.mp3",
              ]}
            />
          )}
        </>
      ) : (
        <View style={Styles.stepContainer}>
          <TouchableOpacity
            onPress={handlePlayButton}
            style={[
              styles.playButton,
              isPlayingSequence && styles.disabledPlayButton, 
            ]}
            disabled={isPlayingSequence} 
          >
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
          />
          <TouchableOpacity style={Styles.listenBtn}>
            <Text style={Styles.listenNumber}>9</Text>
            <Text style={Styles.listenText}>Listen. Point and say</Text>
          </TouchableOpacity>
          <View style={styles.colorsBlock}>
            <Image
              style={styles.colorImg}
              source={require("../../../assets/images/colors.jpg")}
            />
            {buttonPositions.map((posStyle, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={async () => {
                    setCurrentPlayingIndex(index);
                    await audioPlay(audioLinks[index]);
                    setTimeout(() => setCurrentPlayingIndex(-1), 2000);
                  }}
                  onPressIn={() => handlePressIn(index)}
                  onPressOut={() => handlePressOut(index)}
                  style={[
                    styles.colorBtn,
                    posStyle,
                    activeBtns[index] && styles.activeBtn,
                    currentPlayingIndex === index && [
                      styles.playingBtn,
                      { backgroundColor: colors[index] + "40" },
                    ],
                  ]}
                />
                {currentPlayingIndex === index && (
                  <View
                    style={[
                      styles.colorIndicator,
                      posStyle,
                      { backgroundColor: colors[index] },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={next} style={Styles.NextButton}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  colorsBlock: { width: "100%", height: "30%", marginBottom: 100 },
  colorImg: { width: "100%", height: "100%", resizeMode: "stretch" },
  colorBtn: { width: "8%", height: "60%", position: "absolute" },
  colorBtn1: { top: "15%", left: "8%" },
  colorBtn2: { top: "15%", left: "18%" },
  colorBtn3: { top: "16%", left: "29%" },
  colorBtn4: { top: "16%", left: "41%" },
  colorBtn5: { top: "16%", right: "18%" },
  colorBtn6: { top: "16%", right: "29%" },
  colorBtn7: { top: "16%", right: "40%" },
  activeBtn: { backgroundColor: "#ffffff79" },
  playingBtn: {
    transform: [{ scale: 1.2 }],
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  colorIndicator: {
    width: "6%",
    height: 10,
    borderRadius: 100,
    position: "absolute",
    transform: [{ translateX: "25%" }, { translateY: "120%" }],
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  playButton: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledPlayButton: {
    backgroundColor: "#A0A0A0", 
    opacity: 0.6, 
  },
  playButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
