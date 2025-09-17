import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ThreeButtons from "./Utils/ThreeButtons";

const { width } = Dimensions.get("window");

const colors = [
  "#fa0000",
  "#f7ef02",
  "#008000",
  "#0000FF",
  "#FFC0CB",
  "#FFA500",
  "#800080",
];

const FlashCards = ({ data, onFinish, setDictionary }) => {
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const translateX = useRef(new Animated.Value(width)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [pointer, setPointer] = useState(false);
  const pointerScale = useRef(new Animated.Value(1)).current;
  const pointerOpacity = useRef(new Animated.Value(1)).current;

  const currentItem = data[index];

  // Karta kirishi
  useEffect(() => {
    if (!finished) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [index, finished, translateX]);

  // Pointer animatsiyasi
  useEffect(() => {
    if (pointer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pointerScale, {
            toValue: 1.2,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pointerScale, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [pointer, pointerScale]);

  // Audio o‘ynash
  const playAudio = async (url) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (url) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            nextCard();
          }
        });
      } else {
        console.log("Audio URL topilmadi!");
      }
    } catch (err) {
      console.log("Audio error:", err);
    }
  };

  // Kartani aylantirish
  const flipCard = () => {
    if (!pointer && !finished) {
      console.log("flipCard chaqirildi, index:", index);
      setPointer(false);
      Animated.timing(rotateY, {
        toValue: 180,
        duration: 500,
        useNativeDriver: true,
      }).start();
      playAudio(currentItem.audioUrl);
    }
  };

  // Keyingi kartaga o‘tish
  const nextCard = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      rotateY.setValue(0);
      if (index + 1 >= data.length) {
        setFinished(true);
      } else {
        setIndex((prev) => prev + 1);
        translateX.setValue(width);
      }
    });
  };

  // Restart qilish
  const restart = () => {
    setIndex(0);
    setFinished(false);
    rotateY.setValue(0);
    translateX.setValue(width);
  };

  // Rotate interpolations
  const frontInterpolate = rotateY.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = rotateY.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.doneText}>🎉 Barcha so‘zlarni tugatdingiz!</Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
            onPress={restart}
          >
            <Text style={styles.buttonText}>Qaytadan ko‘rish</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#f44336" }]}
            onPress={() => setDictionary(false)}
          >
            <Text style={styles.buttonText}>Tugatish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThreeButtons
        setDictionary={setDictionary}
        setPointer={setPointer}
        audioUrl="https://ukkibackend.soof.uz/media/audio/e4ee6793-0df5-4696-91d7-670b825d3c17.mp3"
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
      />

      {/* FRONT SIDE */}
      <TouchableOpacity
        style={styles.touchableCard}
        onPress={flipCard}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors[index % colors.length],
              transform: [{ translateX }, { rotateY: frontInterpolate }],
            },
          ]}
        >
          <View style={styles.inner}>
            <Text style={styles.frontText}>Tap to Flip</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* BACK SIDE */}
      <TouchableOpacity
        style={styles.touchableCard}
        onPress={flipCard}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              backgroundColor: colors[index % colors.length],
              transform: [{ translateX }, { rotateY: backInterpolate }],
            },
          ]}
        >
          <View style={styles.inner}>
            <Text style={styles.text}>
              {currentItem.word} - {currentItem.translation}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      {pointer && (
        <Animated.Image
          style={[
            styles.handImage,
            { transform: [{ scale: pointerScale }], opacity: pointerOpacity },
          ]}
          source={require("../assets/images/hand2.png")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableCard: {
    position: "absolute",
    width: 280,
    height: 180,
    borderRadius: 20,
  },
  card: {
    width: 280,
    height: 180,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    position: "absolute",
  },
  cardBack: {
    transform: [{ rotateY: "180deg" }],
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  frontText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  doneText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  handImage: {
    width: 50,
    height: 70,
    position: "absolute",
    right: "40%",
    bottom: "40%",
    zIndex: 2,
  },
});

export default FlashCards;
