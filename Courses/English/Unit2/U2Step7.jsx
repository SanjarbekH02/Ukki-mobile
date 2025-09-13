import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const topImages = [
  { id: 1, src: require("../../../assets/images/selectstol.jpg"), answer: "b" },
  { id: 2, src: require("../../../assets/images/selectstul.jpg"), answer: "d" },
  { id: 3, src: require("../../../assets/images/selecteshik.jpg"), answer: "a" },
  { id: 4, src: require("../../../assets/images/selectqalam.jpg"), answer: "c" },
];

const bottomImages = [
  { id: "a", src: require("../../../assets/images/selecteshikyarmi.jpg") },
  { id: "b", src: require("../../../assets/images/selectstolyarmi.jpg") },
  { id: "c", src: require("../../../assets/images/selectqalamyarmi.jpg") },
  { id: "d", src: require("../../../assets/images/qizilstol.jpg") },
];

export default function MatchGame({next}) {
  const [selectedTop, setSelectedTop] = useState(null);
  const [matches, setMatches] = useState({});
  const [results, setResults] = useState({});
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);

  const handleTopSelect = (item) => {
    setSelectedTop(item.id);
  };

  const handleBottomSelect = (bottom) => {
    if (!selectedTop) return;

    const topItem = topImages.find((t) => t.id === selectedTop);
    const isCorrect = topItem.answer === bottom.id;

    setMatches({ ...matches, [selectedTop]: bottom.id });
    setResults({ ...results, [selectedTop]: isCorrect });

    setSelectedTop(null);
  };

  const handleReset = () => {
    setMatches({});
    setResults({});
    setSelectedTop(null);
  };

  const allCorrect =
    Object.keys(results).length === topImages.length &&
    Object.values(results).every((val) => val === true);

  return (
    <View style={styles.container}>
      <ThreeButtons
        audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, Rasmlarga qara va ularni moslashtir. .mp3"
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
      />

      <View style={styles.row}>
        {topImages.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleTopSelect(item)}
            style={[
              styles.imgBox,
              selectedTop === item.id && styles.selected,
            ]}
          >
            <Image source={item.src} style={styles.image} resizeMode="contain" />
            {results[item.id] === true && <Text style={styles.correct}>✔️</Text>}
            {results[item.id] === false && <Text style={styles.wrong}>❌</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        {bottomImages.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleBottomSelect(item)}
            style={styles.imgBox}
          >
            <Image source={item.src} style={styles.image} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={{ color: "white", fontSize: 18 }}>🔄 Reset </Text>
      </TouchableOpacity>

      {allCorrect && (
        <TouchableOpacity style={Styles.NextButton} onPress={next}>
          <Text style={{ color: "white", fontSize: 18 }}>➡️ Next </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { flexDirection: "row", margin: 10, flexWrap: "wrap" },
  imgBox: {
    width: 80,
    height: 80,
    margin: 8,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selected: { borderColor: "blue" },
  image: { width: "100%", height: "100%" },
  correct: {
    position: "absolute",
    bottom: -5,
    right: -5,
    fontSize: 22,
  },
  wrong: {
    position: "absolute",
    bottom: -5,
    right: -5,
    fontSize: 22,
  },
  resetBtn: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  nextBtn: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
