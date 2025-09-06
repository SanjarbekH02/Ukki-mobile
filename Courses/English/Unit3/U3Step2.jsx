import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WordPractice from '../../../components/Utils/Talaffuz';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import WordGameAssist from '../../../components/Utils/WordGame';
import FlashCards from '../../../components/YangiSozlar';
import Styles from '../../../Styles/Styles';

const U3Step2 = ({ next }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const soundRef = useRef(null);
  const [listen2, setListen2] = useState(false);
  const [showPointer, setShowPointer] = useState(false);
  const [showPointer2, setShowPointer2] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true)
  const [dictionary, setDictionary] = useState(false)
  const [wordgame, setWordgame] = useState(true)
  const [talaffuz, setTalaffuz] = useState(false)

  const audioList = [
    "https://ukkibackend.soof.uz/media/audio/unit2-step2-1.mp3",
    "https://ukkibackend.soof.uz/media/audio/unit2-step2-2.mp3",
    "https://ukkibackend.soof.uz/media/audio/unit2-step2-3.mp3",
    "https://ukkibackend.soof.uz/media/audio/unit2-step2-4.mp3",
    "https://ukkibackend.soof.uz/media/audio/unit2-step2-5.mp3",
    "https://ukkibackend.soof.uz/media/audio/unit2-step2-6.mp3",
  ];

  const mapping = {
    0: 1,
    1: 3,
    2: 2,
    3: 2,
    4: 4,
    5: 3,
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
    setShowPointer(false)
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
    1: "https://ukkibackend.soof.uz/media/audio/unit2-btn1.mp3",
    2: "https://ukkibackend.soof.uz/media/audio/unit2-btn2.mp3",
    3: "https://ukkibackend.soof.uz/media/audio/unit2-btn3.mp3",
    4: "https://ukkibackend.soof.uz/media/audio/unit2-btn4.mp3",
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
                { word: "Point", translation: "Ko'rsatmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/korsatmoq.mp3" },
                { word: "Door", translation: "Eshik", audioUrl: "https://ukkibackend.soof.uz/media/audio/eshik.mp3" },
                { word: "Window", translation: "Deraza", audioUrl: "https://ukkibackend.soof.uz/media/audio/deraza.mp3" },
                { word: "Chair", translation: "Stul", audioUrl: "https://ukkibackend.soof.uz/media/audio/stul.mp3" },
                { word: "Table", translation: "Stol", audioUrl: "https://ukkibackend.soof.uz/media/audio/stol.mp3" },
                { word: "Board", translation: "Doska", audioUrl: "https://ukkibackend.soof.uz/media/audio/doska.mp3" },
                { word: "This is my classroom", translation: "Bu mening sinf xonam", audioUrl: "https://ukkibackend.soof.uz/media/audio/bu_mening_sinf.mp3" },
              ]}
            />
          ) : talaffuz ? (
            <WordPractice
              setWordgame={setWordgame}
              setDictionary={setDictionary}
              setTalaffuz={setTalaffuz}
              words={[
                { text: "point", audioUrl: "https://ukkibackend.soof.uz/media/audio/korsatmoq.mp3" },
                { text: "door", audioUrl: "https://ukkibackend.soof.uz/media/audio/eshik.mp3" },
                { text: "window", audioUrl: "https://ukkibackend.soof.uz/media/audio/deraza.mp3" },
                { text: "chair", audioUrl: "https://ukkibackend.soof.uz/media/audio/stul.mp3" },
                { text: "table", audioUrl: "https://ukkibackend.soof.uz/media/audio/stol.mp3" },
                { text: "board", audioUrl: "https://ukkibackend.soof.uz/media/audio/doska.mp3" },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={["point", "door", "window", "chair", "table", "board"]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/korsatmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/eshik.mp3",
                "https://ukkibackend.soof.uz/media/audio/deraza.mp3",
                "https://ukkibackend.soof.uz/media/audio/stul.mp3",
                "https://ukkibackend.soof.uz/media/audio/stol.mp3",
                "https://ukkibackend.soof.uz/media/audio/doska.mp3",
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
              setShowPointer={setShowPointer} 
              audioUrl="https://ukkibackend.soof.uz/media/audio/unit2-step2-intro.mp3" 
            />
            <Image
              source={require('../../../assets/images/unit-3/unit-2-step-1.png')}
              style={styles.step2Img}
            />
            
            <View style={{
              position: 'absolute',
              bottom: 50,
              left: 0,
              right: 0,
              alignItems: 'center'
            }}>
              <TouchableOpacity 
                style={{
                  backgroundColor: '#FF6B35',
                  paddingVertical: 18,
                  paddingHorizontal: 60,
                  borderRadius: 25,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8
                }}
                onPress={() => playAudio(0)}
              >
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>▶ Play</Text>
              </TouchableOpacity>
            </View>
          </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    height: "90%",
    backgroundColor: '#eee',
    marginBottom: 95
  },
  step2Img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '75%',
    resizeMode: 'stretch',
  },
  pointer: {
    position: "absolute",
    left: 70,
    top: "50%",
    width: 50,
    height: 50,
    resizeMode: "contain",
    zIndex: 10,
  },
});

export default U3Step2;