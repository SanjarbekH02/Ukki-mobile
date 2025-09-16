import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const images = [
  { id: "1", uri: require("../../../assets/images/unit-3/cd461.jpg"), isToy: false },
  { id: "2", uri: require("../../../assets/images/unit-3/cd462.jpg"), isToy: true },
  { id: "3", uri: require("../../../assets/images/unit-3/cd463.jpg"), isToy: true },
  { id: "4", uri: require("../../../assets/images/unit-3/cd464.jpg"), isToy: false },
  { id: "5", uri: require("../../../assets/images/unit-3/cd465.jpg"), isToy: true },
  { id: "6", uri: require("../../../assets/images/unit-3/cd466.jpg"), isToy: true },
  { id: "7", uri: require("../../../assets/images/unit-3/cd467.jpg"), isToy: false },
];

export default function GameScreen({ next }) {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Faqat to'g'ri rasm tanlanganligini tekshirish
  const isAllCorrect = () => {
    const correctIds = images.filter((img) => img.isToy).map((img) => img.id);
    const selectedIds = Object.keys(selected).filter((id) => selected[id]);

    return (
      selectedIds.length === correctIds.length &&
      correctIds.every((id) => selectedIds.includes(id))
    );
  };

  const renderItem = ({ item }) => {
    let borderColor = "#ccc";
    if (selected[item.id]) borderColor = "blue";
    if (checked && selected[item.id]) {
      borderColor = item.isToy ? "green" : "red";
    }

    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        style={[styles.imageWrapper, { borderColor }]}
      >
        <Image source={item.uri} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [, setDictionary] = useState(false);

  return (
    <View style={styles.container}>
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
        audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, kel o’yinchoqlarni belgilaymiz.mp3"
      />

      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {!checked ? (
        <TouchableOpacity style={styles.checkBtn} onPress={() => setChecked(true)}>
          <Text style={styles.checkText}>Check</Text>
        </TouchableOpacity>
      ) : isAllCorrect() ? (
        <TouchableOpacity onPress={next} style={[styles.checkBtn, { backgroundColor: "green" }]}>
          <Text style={styles.checkText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.checkBtn, { backgroundColor: "red" }]}
          onPress={() => {
            setSelected({}); // tanlanganlarni tozalash
            setChecked(false); // check holatini reset qilish
          }}
        >
          <Text style={styles.checkText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    justifyContent: "center",
  },
  imageWrapper: {
    width: "45%",
    aspectRatio: 1,
    margin: "2%",
    backgroundColor: "#fff",
    borderWidth: 4,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  checkBtn: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
