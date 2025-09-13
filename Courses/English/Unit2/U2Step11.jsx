import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function ClassroomCountGame({ next }) {
  const objects = [
    {
      id: 1,
      name: "Eshik",
      correct: 2,
      image: require("../../../assets/images/eshik14.jpg"),
    },
    {
      id: 2,
      name: "Doska",
      correct: 3,
      image: require("../../../assets/images/rasm14.jpg"),
    },
    {
      id: 3,
      name: "Stol",
      correct: 6,
      image: require("../../../assets/images/stol14.jpg"),
    },
    {
      id: 4,
      name: "Stul",
      correct: 7,
      image: require("../../../assets/images/stul14.jpg"),
    },
    {
      id: 5,
      name: "Kitob",
      correct: 8,
      image: require("../../../assets/images/kitob14.jpg"),
    },
    {
      id: 6,
      name: "Qalam",
      correct: 8,
      image: require("../../../assets/images/qalam14.jpg"),
    },
  ];

  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [focusedId, setFocusedId] = useState(null);
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);

  const handleChange = (id, value) => {
    console.log(`ID: ${id}, Value: ${value}`);
    setAnswers({ ...answers, [id]: value });
  };

  const checkAnswers = () => {
    let correct = true;
    objects.forEach((obj) => {
      if (parseInt(answers[obj.id]) !== obj.correct) {
        correct = false;
      }
    });

    setChecked(true);
    setAllCorrect(correct);

    if (!correct) {
      Alert.alert(
        "❌ Noto‘g‘ri",
        "Ba’zi javoblar xato, qaytadan urinib ko‘ring!"
      );
    }
  };

  const goNext = () => {
    Alert.alert(
      "➡️ Next",
      "Keyingi sahifaga o‘tish mumkin (bu yerda navigation ishlatiladi)."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <ThreeButtons
          audioUrl="https://ukkibackend.soof.uz/media/audio/Aziz bolajon, suratda ko’rsatilgan narsalarni sana va ularning sonini yoz. .mp3"
          setDictionary={setDictionary}
          infoClick={infoClick}
          clicked={clicked}
          setClicked={setClicked}
          setInfoClick={setInfoClick}
        />
        <Text style={styles.title}>
          {allCorrect ? "✅ Barchasi to‘g‘ri 👏" : "Obyektlarni sanang"}
        </Text>

        <View style={styles.grid}>
          {objects.map((obj) => (
            <View key={obj.id} style={styles.card}>
              <Image
                source={obj.image}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.text}>{obj.name}</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedId === obj.id && styles.inputFocused,
                ]}
                keyboardType="numeric"
                onChangeText={(val) => handleChange(obj.id, val)}
                value={answers[obj.id] || ""}
                placeholder="?"
                placeholderTextColor="#888"
                onFocus={() => setFocusedId(obj.id)}
                onBlur={() => setFocusedId(null)}
                returnKeyType="done"
              />
              {checked && (
                <Text style={{ marginTop: 5 }}>
                  {parseInt(answers[obj.id]) === obj.correct ? "✅" : "❌"}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={{ width: "100%", aspectRatio: 16 / 9 }}>
          <Image
            style={styles.classImg}
            source={require("../../../assets/images/classrom.jpg")}
            resizeMode="stretch"
          />
        </View>

        {!allCorrect && (
          <TouchableOpacity style={styles.button} onPress={checkAnswers}>
            <Text style={styles.btnText}>✅ Tekshirish</Text>
          </TouchableOpacity>
        )}

        {allCorrect && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3" }]}
            onPress={next}
          >
            <Text style={styles.btnText}>➡️ Keyingi</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContent: {
    paddingBottom: 30, 
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 50,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    width: "30%", // 3 ustun
    alignItems: "center",
    marginBottom: 20,
  },
  image: { width: 60, height: 60, marginBottom: 5 },
  text: { fontSize: 16, fontWeight: "500", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 20,
    color: "#000",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: { lineHeight: 20 },
      android: { textAlignVertical: "center" },
    }),
  },
  inputFocused: {
    borderColor: "#2196F3",
    backgroundColor: "#f0f0f0",
  },
  classImg: { width: "100%", height: "100%", resizeMode: "stretch" },
  button: {
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    minWidth: 150,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
