import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const images = [
  { id: "1", uri: require("./assets/img1.png"), isToy: true },
  { id: "2", uri: require("./assets/img2.png"), isToy: false },
  { id: "3", uri: require("./assets/img3.png"), isToy: true },
  { id: "4", uri: require("./assets/img4.png"), isToy: false },
  { id: "5", uri: require("./assets/img5.png"), isToy: true },
  { id: "6", uri: require("./assets/img6.png"), isToy: false },
  { id: "7", uri: require("./assets/img7.png"), isToy: true },
];

export default function GameScreen() {
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const toggleSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }) => {
    let borderColor = "#ccc"; // default kulrang
    if (selected[item.id]) borderColor = "blue"; // vaqtincha tanlaganda ko‘k
    if (checked && selected[item.id]) {
      borderColor = item.isToy ? "green" : "red"; // checkdan keyin yashil/qizil
    }

    return (
      <TouchableOpacity onPress={() => toggleSelect(item.id)} style={[styles.imageWrapper, { borderColor }]}>
        <Image source={item.uri} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity style={styles.checkBtn} onPress={() => setChecked(true)}>
        <Text style={styles.checkText}>Check</Text>
      </TouchableOpacity>
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
    margin: "2.5%",
    borderWidth: 4,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
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
