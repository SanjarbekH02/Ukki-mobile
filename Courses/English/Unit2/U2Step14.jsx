import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WordPractice from "../../../components/Utils/Talaffuz";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import WordGameAssist from "../../../components/Utils/WordGame";
import FlashCards from "../../../components/YangiSozlar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ConfettiEffect from "../../../components/Utils/Success"; 

const questions = [
  {
    id: 1,
    image: require("../../../assets/images/wochmoq.jpg"),
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-1.mp3",
  },
  {
    id: 2,
    image: require("../../../assets/images/wotirmoq.jpg"),
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-2.mp3",
  },
  {
    id: 3,
    image: require("../../../assets/images/wolmoq.jpg"),
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-3.mp3",
  },
  {
    id: 4,
    image: require("../../../assets/images/wturmoq.jpg"),
    audio: "https://ukkibackend.soof.uz/media/audio/CD1-32-4.mp3",
  },
];

export default function AudioQuiz({ next }) {
  const [sound, setSound] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);
  const [selectedBtns, setSelectedBtns] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dictionary, setDictionary] = useState(false);
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false);
  const [finished, setFinished] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false);

  const playAudio = async (index) => {
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: questions[index].audio,
      });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Audio oynatishda xato:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const handleStart = () => {
    setStarted(true);
    playAudio(current);
  };

  const handleSelect = (imgId) => {
    setSelected({ ...selected, [current]: imgId });
    if (!selectedBtns.includes(imgId)) {
      setSelectedBtns([...selectedBtns, imgId]);
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      playAudio(current + 1);
    }
  };

  const handleCheck = () => {
    setChecked(true);
    if (isAllCorrect()) {
      setFinished(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    }
  };

  const handleTryAgain = () => {
    setSelectedBtns([]);
    setSelected({});
    setChecked(false);
    setCurrent(0);
    setStarted(false);
    setFinished(false); 
    setLoading(false);
    if (sound) sound.unloadAsync();
  };

  const isAllCorrect = () => {
    return questions.every((q, i) => {
      return selected.hasOwnProperty(i) && selected[i] === q.id;
    });
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
                  word: "Different",
                  translation: "Boshqacha",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3",
                },
                {
                  word: "The same",
                  translation: "Bir xil",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/bir xil.mp3",
                },
                {
                  word: "Circle",
                  translation: "Aylana",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/aylana.mp3",
                },
                {
                  word: "Stand",
                  translation: "Tik turmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3",
                },
                {
                  word: "Sit",
                  translation: "O‘tirmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3",
                },
                {
                  word: "Read",
                  translation: "O‘qimoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3",
                },
                {
                  word: "Bend down",
                  translation: "Egilmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3",
                },
                {
                  word: "Boy",
                  translation: "O‘g‘il bola",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3",
                },
                {
                  word: "Girl",
                  translation: "Qiz bola",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/qizbola.mp3",
                },
                {
                  word: "Look",
                  translation: "Qaramoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3",
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
                  text: "Different",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3",
                },
                {
                  text: "The same",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/bir xil.mp3",
                },
                {
                  text: "Circle",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/aylana.mp3",
                },
                {
                  text: "Stand",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3",
                },
                {
                  text: "Sit",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3",
                },
                {
                  text: "Read",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3",
                },
                {
                  text: "Bend down",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3",
                },
                {
                  text: "Boy",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3",
                },
                {
                  text: "Girl",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/qizbola.mp3",
                },
                {
                  text: "Look",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3",
                },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={[
                "Different",
                "The same",
                "Circle",
                "Stand",
                "Sit",
                "Read",
                "Bend down",
                "Boy",
                "Girl",
                "Look",
              ]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3",
                "https://ukkibackend.soof.uz/media/audio/bir xil.mp3",
                "https://ukkibackend.soof.uz/media/audio/aylana.mp3",
                "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3",
                "https://ukkibackend.soof.uz/media/audio/qizbola.mp3",
                "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3",
              ]}
            />
          )}
            {dictionary ? (
                <>

                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[
                                { word: "Different ", translation: "Boshqacha", audioUrl: "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3" },
                                { word: "The same", translation: "Bir xil", audioUrl: "https://ukkibackend.soof.uz/media/audio/bir xil.mp3" },
                                { word: "Circle", translation: "Aylana", audioUrl: "https://ukkibackend.soof.uz/media/audio/aylana.mp3" },
                                { word: "Stand", translation: "Tik turmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3" },
                                { word: "Sit", translation: "O‘tirmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3" },
                                { word: "Read", translation: "O‘qimoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3" },
                                { word: "Bend down", translation: "Egilmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3" },
                                { word: "Boy", translation: "O‘g‘il bola", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3" },
                                { word: "Girl", translation: "Qiz bola", audioUrl: "https://ukkibackend.soof.uz/media/audio /qizbola.mp3" },
                                { word: "Look", translation: "Qaramoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3" },
                            ]}
                        />

                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                { text: "Different", audioUrl: "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3" },
                                { text: "The same", audioUrl: "https://ukkibackend.soof.uz/media/audio/bir xil.mp3" },
                                { text: "Circle", audioUrl: "https://ukkibackend.soof.uz/media/audio/aylana.mp3" },
                                { text: "Stand", audioUrl: "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3" },
                                { text: "Sit", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3" },
                                { text: "Read", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3" },
                                { text: "Bend down", audioUrl: "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3" },
                                { text: "Boy", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3" },
                                { text: "Girl", audioUrl: "https://ukkibackend.soof.uz/media/audio/qizbola.mp3" },
                                { text: "Look", audioUrl: "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3" },
                            ]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={["Different", "The same", "Circle", "Stand", "Sit", "Read", "Bend down", "Boy", "Girl", "Look"]}
                            audios={
                                [
                                    "https://ukkibackend.soof.uz/media/audio/boshqacha.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/bir xil.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/aylana.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/tik turmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/o'tirmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/o'qimoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/egilmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/o'g'il bola.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/qizbola.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3",

                                ]
                            }
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
                        audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila. .mp3"
                    />

                    {!started ? (
                        <TouchableOpacity style={styles.playBtn} onPress={handleStart}>
                            <Text style={styles.playText}>▶ Play</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <View style={styles.imagesRow}>
                                {questions.map((q, index) => (
                                    <View key={q.id} style={styles.card}>
                                        <Image source={q.image} style={styles.img} />
                                        <TouchableOpacity
                                            style={[
                                                styles.box,
                                                selectedBtns.includes(q.id) && styles.selectedBox,
                                            ]}
                                            onPress={() => handleSelect(q.id)}
                                            disabled={checked}
                                        >
                                            {checked && selected[index] === q.id ? (
                                                <Text style={styles.correct}>✔</Text>
                                            ) : checked && selected[index] && selected[index] !== q.id ? (
                                                <Text style={styles.incorrect}>✘</Text>
                                            ) : null}
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            {!checked ? (
                                <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
                                    <Text style={styles.btnText}>Check</Text>
                                </TouchableOpacity>
                            ) : isAllCorrect() ? (
                                <TouchableOpacity onPress={next} style={styles.nextBtn}>
                                    <Text style={styles.btnText}>Next</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.tryBtn} onPress={handleTryAgain}>
                                    <Text style={styles.btnText}>Try Again</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            )}
        </>
      ) : (
        <View style={styles.innerContainer}>
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, suhbatlarni tingla va to’gri javobni belgila. .mp3"
          />

          {!started ? (
            <TouchableOpacity
              style={styles.playBtn}
              onPress={handleStart}
              disabled={loading}
            >
              <LinearGradient
                colors={["#ff6b6b", "#ff8e53"]}
                style={styles.playBtnGradient}
              >
                <Ionicons name="play" size={28} color="#fff" />
                <Text style={styles.playText}>Play</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.imagesRow}>
                {questions.map((q, index) => {
                  const isSelected = selected[index] === q.id;
                  const hasSelection = selected[index] !== undefined;
                  return (
                    <View key={q.id} style={styles.card}>
                      <Image source={q.image} style={styles.img} />
                      <TouchableOpacity
                        style={[
                          styles.box,
                          selectedBtns.includes(q.id) && styles.selectedBox,
                          checked && isSelected && styles.correctBox,
                          checked &&
                            hasSelection &&
                            !isSelected &&
                            styles.incorrectBox,
                        ]}
                        onPress={() => handleSelect(q.id)}
                        disabled={checked}
                      >
                        {checked && isSelected ? (
                          <Ionicons name="checkmark" size={24} color="#fff" />
                        ) : checked && hasSelection && !isSelected ? (
                          <Ionicons name="close" size={24} color="#fff" />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {!checked ? (
                <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
                  <Text style={styles.btnText}>Check</Text>
                </TouchableOpacity>
              ) : !isAllCorrect() ? (
                <TouchableOpacity
                  style={styles.tryBtn}
                  onPress={handleTryAgain}
                >
                  <Text style={styles.btnText}>Restart</Text>
                </TouchableOpacity>
              ) : finished ? (
                <>
                  <TouchableOpacity style={styles.nextBtn} onPress={next}>
                    <Text style={styles.btnText}>Next</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </>
          )}
          {isSuccess && <ConfettiEffect />}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imagesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  card: {
    margin: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  img: {
    width: 120,
    height: 100,
    resizeMode: "contain",
    borderRadius: 8,
  },
  box: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  selectedBox: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
  },
  correctBox: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF50",
  },
  incorrectBox: {
    borderColor: "#f44336",
    backgroundColor: "#f44336",
  },
  checkBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  tryBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
  },
  nextBtn: {
    backgroundColor: "#009400ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  playBtn: {
    borderRadius: 50,
    overflow: "hidden",
  },
  playBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  playText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  result: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "black",
    textAlign: "center",
  },
});
