import { Audio } from "expo-av";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const AudioImageGame = () => {
  // Rasmlar LOCAL (require), audio esa URL (Asset.fromModule orqali)
  const images = [
    {
      id: 1,
      source: require("../../../assets/images/unit-3/cd501.jpg"),
      audio: { uri: "https://ukkibackend.soof.uz/media/audio/CD1-50-1.mp3" },
    },
    {
      id: 2,
      source: require("../../../assets/images/unit-3/cd501.jpg"),
      audio: { uri: "https://ukkibackend.soof.uz/media/audio/CD1-50-2.mp3" },
    },
    {
      id: 3,
      source: require("../../../assets/images/unit-3/cd501.jpg"),
      audio: { uri: "https://ukkibackend.soof.uz/media/audio/CD1-50-3.mp3" },
    },
    {
      id: 4,
      source: require("../../../assets/images/unit-3/cd501.jpg"),
      audio: { uri: "https://ukkibackend.soof.uz/media/audio/CD1-50-4.mp3" },
    },
    {
      id: 5,
      source: require("../../../assets/images/unit-3/cd501.jpg"),
      audio: { uri: "https://ukkibackend.soof.uz/media/audio/CD1-50-5.mp3" },
    },
    {
      id: 6,
      source: require("../../../assets/images/unit-3/cd501.jpg"),
      audio: { uri: "https://ukkibackend.soof.uz/media/audio/CD1-50-6.mp3" },
    },
  ];

  const correctAnswers = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };

  const shuffledNumbers = [3, 1, 5, 2, 6, 4];

  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [draggedNumber, setDraggedNumber] = useState(null);
  const [dropZones, setDropZones] = useState({});
  const [currentPlayingAudio, setCurrentPlayingAudio] = useState(1);

  // Audio o'ynash
  const playAudio = async (audioFile, audioId) => {
    try {
      if (currentAudio) {
        await currentAudio.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(audioFile);
      setCurrentAudio(sound);
      setCurrentPlayingAudio(audioId);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setCurrentAudio(null);
          setCurrentPlayingAudio(null);
        }
      });
    } catch (error) {
      console.error("Audio o'ynashda xatolik:", error);
      Alert.alert("Xatolik", "Audio faylini o'ynab bo'lmadi");
    }
  };

  // Keyingi audioni avtomatik o'ynash
  const playNextAudio = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < images.length) {
      const nextAudioIndex = answeredCount + 1;
      const nextImage = images.find(img => img.id === nextAudioIndex);
      if (nextImage) {
        setTimeout(() => {
          playAudio(nextImage.audio, nextImage.id);
        }, 500);
      }
    }
  };

  // Birinchi audioni boshlash
  const startFirstAudio = () => {
    if (Object.keys(userAnswers).length === 0) {
      playAudio(images[0].audio, images[0].id);
    }
  };

  const setDropZone = (imageId, layout) => {
    setDropZones((prev) => {
      const existing = prev[imageId];
      if (!existing || 
          existing.x !== layout.x || 
          existing.y !== layout.y || 
          existing.width !== layout.width || 
          existing.height !== layout.height) {
        return {
          ...prev,
          [imageId]: {
            x: layout.x,
            y: layout.y,
            width: layout.width,
            height: layout.height
          }
        };
      }
      return prev;
    });
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetGame = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentPlayingAudio(1);
    if (currentAudio) {
      currentAudio.unloadAsync();
      setCurrentAudio(null);
    }
  };

  // Joylashtirilgan raqamni topish
  const getPlacedNumber = (imageId) => {
    return Object.keys(userAnswers).find(
      (key) => userAnswers[key] === imageId.toString()
    );
  };

  const ImageCard = ({ image }) => (
    <View style={styles.imageContainer}>
      <View
        style={styles.imageWrapper}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          const imageIdStr = image.id.toString();
          const existing = dropZones[imageIdStr];
          if (!existing || 
              Math.abs(existing.x - x) > 1 || 
              Math.abs(existing.y - y) > 1 || 
              Math.abs(existing.width - width) > 1 || 
              Math.abs(existing.height - height) > 1) {
            setDropZone(imageIdStr, { x, y, width, height });
          }
        }}
      >
        {/* Play tugmasi tepada */}
        <TouchableOpacity
          style={[
            styles.audioButton,
            { backgroundColor: currentPlayingAudio === image.id ? "#4CAF50" : "rgba(0,0,0,0.7)" }
          ]}
          onPress={() => playAudio(image.audio, image.id)}
        >
          <Text style={styles.audioButtonText}>
            {currentPlayingAudio === image.id ? "⏸" : "▶"}
          </Text>
        </TouchableOpacity>

        {/* Rasm */}
        <Image source={image.source} style={styles.image} />

        {/* Rasm tagidagi raqam joyi */}
        <View style={styles.dropZone}>
          {showResults ? (
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: correctAnswers[parseInt(getPlacedNumber(image.id)) || 0] === image.id
                    ? "#4CAF50"
                    : "#F44336",
                },
              ]}
            >
              <Text style={styles.resultText}>
                {correctAnswers[parseInt(getPlacedNumber(image.id)) || 0] === image.id ? "✓" : "✗"}
              </Text>
            </View>
          ) : (
            getPlacedNumber(image.id) && (
              <View style={styles.placedNumber}>
                <Text style={styles.placedNumberText}>
                  {getPlacedNumber(image.id)}
                </Text>
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );

  const DraggableNumber = ({ number }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !Object.values(userAnswers).includes(number.toString()),
        onMoveShouldSetPanResponder: () => !Object.values(userAnswers).includes(number.toString()),

        onPanResponderGrant: () => {
          setDraggedNumber(number);
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        },

        onPanResponderMove: Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        ),

        onPanResponderRelease: (evt) => {
          pan.flattenOffset();

          const dropX = evt.nativeEvent.pageX;
          const dropY = evt.nativeEvent.pageY;

          let droppedOnImage = null;
          Object.keys(dropZones).forEach((imageId) => {
            const zone = dropZones[imageId];
            if (zone && 
                dropX >= zone.x &&
                dropX <= zone.x + zone.width &&
                dropY >= zone.y &&
                dropY <= zone.y + zone.height
            ) {
              droppedOnImage = imageId;
            }
          });

          if (droppedOnImage) {
            const newAnswers = { ...userAnswers };
            Object.keys(newAnswers).forEach(key => {
              if (newAnswers[key] === droppedOnImage) {
                delete newAnswers[key];
              }
            });
            
            newAnswers[number] = droppedOnImage;
            setUserAnswers(newAnswers);
            
            playNextAudio();
          }

          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();

          setDraggedNumber(null);
        },
      })
    ).current;

    const isUsed = Object.values(userAnswers).includes(number.toString());

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          pan.getLayout(),
          styles.numberBox,
          {
            opacity: isUsed ? 0.3 : 1,
            backgroundColor: draggedNumber === number ? "#2196F3" : "#FFC107",
          },
        ]}
      >
        <Text style={styles.numberText}>{number}</Text>
      </Animated.View>
    );
  };

  const allAnswersProvided = Object.keys(userAnswers).length === 6;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Audio va Rasm Moslashtirish O'yini</Text>

      {/* Boshlash tugmasi */}
      {Object.keys(userAnswers).length === 0 && (
        <TouchableOpacity style={styles.startButton} onPress={startFirstAudio}>
          <Text style={styles.startButtonText}>O'yinni Boshlash</Text>
        </TouchableOpacity>
      )}

      <View style={styles.imagesGrid}>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </View>

      <View style={styles.numbersContainer}>
        <Text style={styles.instructionText}>
          Raqamlarni rasmlar tagidagi joylarga sudrab oling:
        </Text>
        <View style={styles.numbersGrid}>
          {shuffledNumbers.map((number) => (
            <DraggableNumber key={number} number={number} />
          ))}
        </View>
      </View>

      {allAnswersProvided && !showResults && (
        <TouchableOpacity style={styles.checkButton} onPress={checkAnswers}>
          <Text style={styles.checkButtonText}>Tekshirish</Text>
        </TouchableOpacity>
      )}

      {showResults && (
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>Qayta Boshlash</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  imageContainer: {
    width: "48%",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  audioButton: {
    position: "absolute",
    top: 15,
    right: 15,
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  audioButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  dropZone: {
    marginTop: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  placedNumber: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placedNumberText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultBox: {
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  numbersContainer: {
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
  },
  numbersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  numberBox: {
    backgroundColor: "#FFC107",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  numberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  checkButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AudioImageGame;