import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import Styles from '../../../Styles/Styles';

const Step2 = ({ next }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const soundRef = useRef(null);
  const [listen2, setListen2] = useState(false);
  const [showPointer, setShowPointer] = useState(false);
  const [showPointer2, setShowPointer2] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const audioList = [
    "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-03-3.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-03-4.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-03-5.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-03-6.mp3",
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

  // audio player
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
    1: "https://ukkibackend.soof.uz/media/audio/cd659513-0efb-45ac-bc55-207460a2805d.mp3",
    2: "https://ukkibackend.soof.uz/media/audio/cd659513-0efb-45ac-bc55-207460a2805d.mp3",
    3: "https://ukkibackend.soof.uz/media/audio/cd659513-0efb-45ac-bc55-207460a2805d.mp3",
    4: "https://ukkibackend.soof.uz/media/audio/CD1-03-5.mp3",
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

      <View style={{ height: "100%", justifyContent: "center" }}>
        <View style={styles.container}>
          <ThreeButtons setShowPointer={setShowPointer} audioUrl="https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" />
          <TouchableOpacity
            style={Styles.listenBtn}
            onPress={() => playAudio(0)}
          >
            <Text style={Styles.listenNumber}>1</Text>
            <Text style={Styles.listenText}>Listen. Who's speaking?</Text>
            {showPointer && (
              <Animated.Image
                source={require("../../../assets/images/hand2.png")} 
                style={[
                  styles.pointer,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              />
            )}

          </TouchableOpacity>

          <TouchableOpacity onPress={() => { next(); hidePointer(); }} style={[Styles.listenBtn, Styles.listenBtn2]} 
          //  disabled={!showPointer2}
           >
            <Text style={Styles.listenNumber}>2</Text>
            <Text style={Styles.listenText}>Listen. point, and say.</Text>
            {showPointer2 && (
              <Animated.Image
                source={require("../../../assets/images/hand2.png")} // qo‘lcha rasmi
                style={[
                  styles.pointer,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              />
            )}
          </TouchableOpacity>

          <Image
            source={require('../../../assets/images/step2.jpg')}
            style={styles.step2Img}
          />

          {/* Button 1 */}
          <TouchableOpacity style={[Styles.userNumber, Styles.userNumber1, mapping[currentIndex] === 1 && { borderWidth: 0, backgroundColor: 'inherit' }]}>
            {mapping[currentIndex] === 1 ? (
              <LottieView
                source={require('../../../assets/images/vois.json')}
                autoPlay
                loop
                style={Styles.userNumberImage}
              />
            ) : (
              <Text style={Styles.userNumberText}>1</Text>
            )}
          </TouchableOpacity>

          {/* Button 2 */}
          <TouchableOpacity style={[Styles.userNumber, Styles.userNumber2, mapping[currentIndex] === 2 && { borderWidth: 0, backgroundColor: 'inherit' }]}>
            {mapping[currentIndex] === 2 ? (
              <LottieView
                source={require('../../../assets/images/vois.json')}
                autoPlay
                loop
                style={Styles.userNumberImage}
              />
            ) : (
              <Text style={Styles.userNumberText}>2</Text>
            )}
          </TouchableOpacity>

          {/* Button 3 */}
          <TouchableOpacity style={[Styles.userNumber, Styles.userNumber3, mapping[currentIndex] === 3 && { borderWidth: 0, backgroundColor: 'inherit' }]}>
            {mapping[currentIndex] === 3 ? (
              <LottieView
                source={require('../../../assets/images/vois.json')}
                autoPlay
                loop
                style={Styles.userNumberImage}
              />
            ) : (
              <Text style={Styles.userNumberText}>3</Text>
            )}
          </TouchableOpacity>

          {/* Button 4 */}
          <TouchableOpacity style={[Styles.userNumber, Styles.userNumber4, mapping[currentIndex] === 4 && { borderWidth: 0, backgroundColor: 'inherit' }]}>
            {mapping[currentIndex] === 4 ? (
              <LottieView
                source={require('../../../assets/images/vois.json')}
                autoPlay
                loop
                style={Styles.userNumberImage}
              />
            ) : (
              <Text style={Styles.userNumberText}>4</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={[Styles.listenBtn3]}>
            <Text style={Styles.listenNumber}>3</Text>
            <Text style={Styles.listenText}>Listen and find.</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    height: '100%',
    resizeMode: 'stretch',
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
});

export default Step2;
