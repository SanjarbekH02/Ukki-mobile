import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const { width } = Dimensions.get("window");

const AudioPlayerScreen = ({ next }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sizning audio fayllaringiz
  const audioList = [
    "https://ukkibackend.soof.uz/media/audio/CD1-54-1.mp3",
    "https://ukkibackend.soof.uz/media/audio/CD1-54-2.mp3",
  ];

  // Audio sozlamalari
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function playSound(index = currentIndex) {
    try {
      setIsLoading(true);

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      console.log("Audio yuklanmoqda:", audioList[index]);

      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioList[index],
      });

      setSound(newSound);
      console.log("Audio ijro etilmoqda...");

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);

          if (status.didJustFinish && !status.isLooping) {
            console.log("Audio tugadi:", audioList[index]);

            if (index < audioList.length - 1) {
              // Agar keyingi audio bor bo‘lsa avtomatik ijro et
              setCurrentIndex(index + 1);
              playSound(index + 1);
            } else {
              // Barcha audio tugadi
              setHasFinished(true);
              setIsPlaying(false);
            }
          }
        }
      });

      await newSound.playAsync();
      setIsPlaying(true);
      setHasFinished(false);
    } catch (error) {
      console.log("Audio xatosi:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function pauseSound() {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log("Pause xatosi:", error);
    }
  }

  async function resumeSound() {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Resume xatosi:", error);
    }
  }

  async function stopSound() {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setHasFinished(false);
      }
    } catch (error) {
      console.log("Stop xatosi:", error);
    }
  }

  const handlePlayPress = () => {
    if (!sound) {
      playSound();
    } else if (isPlaying) {
      pauseSound();
    } else {
      resumeSound();
    }
  };

  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [, setDictionary] = useState(false);

  return (
    <View style={styles.container}>
      <ThreeButtons
        audioUrl="https://ukkibackend.soof.uz/media/audio/ad9c2f34-e973-422c-8641-024bc5db66e9.mp3"
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
      />
      {/* Rasm */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/images/unit-3/image.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Control tugmalari */}
      <View style={styles.controlsContainer}>
        {!hasFinished ? (
          <TouchableOpacity
            style={[styles.playButton, isLoading && styles.disabledButton]}
            onPress={handlePlayPress}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading
                ? "Yuklanmoqda..."
                : isPlaying
                ? "⏸️ Pauza"
                : "▶️ Play"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.finishedContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                setCurrentIndex(0);
                playSound(0);
              }}
            >
              <Text style={styles.buttonText}>🔄 Qayta ijro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={next}>
              <Text style={styles.buttonText}>⏭️ Keyingi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8 * 0.6,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
  },
  controlsContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 160,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  nextButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 160,
    alignItems: "center",
  },
  finishedContainer: {
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AudioPlayerScreen;
