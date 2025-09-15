import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ErrorOverlay from '../../../components/Utils/OnError';
import ConfettiEffect from '../../../components/Utils/Success';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

const { width } = Dimensions.get('window');

const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const AudioImageGame = () => {
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [gameData, setGameData] = useState([]);
  const [usedAnswers, setUsedAnswers] = useState([]);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [IsSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [infoClick, setInfoClick] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [dictionary, setDictionary] = useState(false)

  const localImages = [
    require('../../../assets/images/unit-3/cd50.jpg'),
    require('../../../assets/images/unit-3/cd501.jpg'),
    require('../../../assets/images/unit-3/cd502.jpg'),
    require('../../../assets/images/unit-3/cd503.jpg'),
    require('../../../assets/images/unit-3/cd504.jpg'),
    require('../../../assets/images/unit-3/cd505.jpg'),
  ];

  const audioFiles = [
    'https://ukkibackend.soof.uz/media/audio/CD1-50-1.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-50-2.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-50-3.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-50-4.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-50-5.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-50-6.mp3',
  ];

  useEffect(() => {
    initializeGame();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const initializeGame = () => {
    // ✅ To‘g‘ri mapping (0-based index)
    const correctMappings = [3, 1, 5, 4, 0, 2];
    // 1->4, 2->2, 3->6, 4->5, 5->1, 6->3

    const gameSetup = audioFiles.map((audio, index) => ({
      audioUrl: audio,
      correctImageIndex: correctMappings[index],
      audioIndex: index
    }));

    setGameData(gameSetup);
    setCurrentAudioIndex(0);
    setUsedAnswers([]);
    setGameFinished(false);
    setScore(0);
    setFeedback(null);
  };

  const playAudio = async (index = currentAudioIndex) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: gameData[index]?.audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Audio yuklanmadi:', error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const handleImageSelect = (selectedImageIndex) => {
    if (usedAnswers.includes(selectedImageIndex + 1)) {
      return;
    }

    const currentGame = gameData[currentAudioIndex];
    const isCorrect = selectedImageIndex === currentGame.correctImageIndex;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
    }

    setUsedAnswers(prev => [...prev, selectedImageIndex + 1]);

    if (currentAudioIndex < gameData.length - 1) {
      const nextIndex = currentAudioIndex + 1;
      setCurrentAudioIndex(nextIndex);

      setTimeout(() => {
        playAudio(nextIndex);
      }, 700);
    } else {
      setGameFinished(true);
    }
  };

  const renderImages = () => {
    return (
      <View style={styles.imagesContainer}>
        {[0, 1].map(row => (
          <View key={row} style={styles.imageRow}>
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              return (
                <View key={index} style={styles.imageWrapper}>
                  <Text style={styles.imageNumber}>{index + 1}</Text>
                  <Image
                    source={localImages[index]}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderAnswerButtons = () => {
    let availableNumbers = [1, 2, 3, 4, 5, 6].filter(num => !usedAnswers.includes(num));

    // 🔀 Har safar aralashtirib chiqaramiz
    availableNumbers = shuffleArray(availableNumbers);

    return (
      <View style={styles.answerButtonsContainer}>
        {availableNumbers.map(num => (
          <TouchableOpacity
            key={num}
            style={styles.answerButton}
            onPress={() => handleImageSelect(num - 1)}
          >
            <Text style={styles.answerButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderGameFinished = () => {
    return (
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedTitle}>O'yin tugadi!</Text>
        <Text style={styles.scoreText}>Natija: {score}/6</Text>
        <View style={styles.finishedButtons}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              initializeGame();
            }}
          >
            <Text style={styles.buttonText}>Qaytadan o'ynash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => {
              // chiqish joyi
            }}
          >
            <Text style={styles.buttonText}>Tugatish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (gameFinished) {
    return (
      <View style={styles.container}>
        {renderGameFinished()}
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <ThreeButtons
          audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, audioni tingla va rasmlar ketma-ketligini belgila.mp3"
          setDictionary={setDictionary}
          infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} />
        <View style={styles.header}>
          <Text style={styles.title}>Qaysi rasm to'g'ri?</Text>
          <Text style={styles.progress}>{currentAudioIndex + 1}/6</Text>
        </View>
        {renderImages()}
        <View style={styles.audioContainer}>
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playingButton]}
            onPress={isPlaying ? stopAudio : () => playAudio(currentAudioIndex)}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? 'To\'xtatish' : 'Audio tinglash'}
            </Text>
          </TouchableOpacity>
        </View>

        {renderAnswerButtons()}
      </ScrollView>
      {IsSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  progress: { fontSize: 18, color: '#666' },
  imagesContainer: { paddingHorizontal: 10, marginVertical: 20 },
  imageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  imageWrapper: { position: 'relative', width: (width - 40) / 3, height: (width - 40) / 3 },
  imageNumber: { position: 'absolute', top: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  image: { width: '100%', height: '100%', borderRadius: 10, borderWidth: 2, borderColor: '#ddd' },
  audioContainer: { alignItems: 'center', marginVertical: 20 },
  playButton: { backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, elevation: 3 },
  playingButton: { backgroundColor: '#f44336' },
  playButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  answerButtonsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  answerButton: { backgroundColor: '#2196F3', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', margin: 10, elevation: 3 },
  answerButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  finishedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  finishedTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  scoreText: { fontSize: 24, color: '#4CAF50', marginBottom: 40, fontWeight: 'bold' },
  finishedButtons: { width: '100%' },
  restartButton: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  exitButton: { backgroundColor: '#f44336', paddingVertical: 15, borderRadius: 10, elevation: 3 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },

  // ✅ Feedback style
  feedbackContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  correctFeedback: { backgroundColor: '#4CAF50' },
  wrongFeedback: { backgroundColor: '#f44336' },
  feedbackText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default AudioImageGame;
