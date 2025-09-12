import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const pictures = [
  require("../../../assets/images/unit-3/unit-2-step-5-1.jpg"), // Picture 1
  require("../../../assets/images/unit-3/unit-2-step-5-2.jpg"), // Picture 2
];

// 🔵 Birinchi rasm uchun farqlar (to'liq ma'lumotlar bilan)
const HOTSPOTS_IMAGE1 = [
  {
    id: "yellow-camera",
    top: "22%",
    left: "10%",
    size: 64,
    sentence: "It is a yellow ball.",
    cheer: "Great! That's the first difference!",
  },
  {
    id: "art-set",
    top: "78%",
    left: "72%",
    size: 72,
    sentence: "It is an art set.",
    cheer: "Awesome! That's the second difference!",
  },
  {
    id: "Yellow-ball",
    top: "50%",
    left: "78%",
    size: 58,
    sentence: "It is a red ball.",
    cheer: "Well done! That's the third difference!",
  },
  {
    id: "orange-bike",
    top: "15%",
    left: "58%",
    size: 80,
    sentence: "It is an orange bike.",
    cheer: "Super! That's the fourth difference!",
  },
  {
    id: "purple-camera",
    top: "47%",
    left: "42%",
    size: 70,
    sentence: "It is a blue box.",
    cheer: "Excellent! That's the last difference!",
  },
];

// 🔵 Ikkinchi rasm uchun farqlar (pozitsiya ma'lumotlari)
const HOTSPOTS_IMAGE2 = [
  {
    id: "yellow-camera",
    top: "22%",
    left: "9%",
    size: 64,
  },
  {
    id: "art-set",
    top: "78%",
    left: "72%",
    size: 72,
  },
  {
    id: "red-ball",
    top: "50%",
    left: "78%",
    size: 58,
  },
  {
    id: "orange-bike",
    top: "15%",
    left: "58%",
    size: 80,
  },
  {
    id: "purple-camera",
    top: "52%",
    left: "42%",
    size: 70,
  },
];

export default function U3Step5({ next }) {
  const [foundIds, setFoundIds] = useState([]); // topilgan farqlarning id lari
  const [currentMessage, setCurrentMessage] = useState("Rasmlarni solishtiring va farqlarni bosing."); // joriy xabar
  const [cheer, setCheer] = useState(""); // maqtov matni
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // yuqoridagi boshqaruv tugmalari
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);

  const handleHotspotPress = (spot) => {
    if (foundIds.includes(spot.id)) return; // allaqachon topilgan, e'tibor bermaslik

    // HOTSPOTS_IMAGE1 dan to'liq ma'lumotlarni olish
    const spotData = HOTSPOTS_IMAGE1.find(h => h.id === spot.id) || spot;

    // istalgan tartibda qabul qilish
    setFoundIds((prev) => [...prev, spot.id]);
    setCurrentMessage(spotData.sentence); // yangi xabarni ko'rsatish

    setCheer(spotData.cheer);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1100);
    setTimeout(() => setCheer(""), 1400);
  };

  const allDone = foundIds.length === HOTSPOTS_IMAGE1.length;

  const renderHotspots = (hotspots, imageIndex) => {
    return hotspots.map((hs) => {
      const found = foundIds.includes(hs.id);
      return (
        <TouchableOpacity
          key={`${hs.id}-img${imageIndex}`}
          style={[
            styles.hotspot,
            {
              top: hs.top,
              left: hs.left,
              width: hs.size,
              height: hs.size,
              marginLeft: -hs.size / 2,
              marginTop: -hs.size / 2,
              borderColor: found ? "#22c55e" : "",
              backgroundColor: found
                ? "rgba(34,197,94,0.25)"
                : "",
            },
          ]}
          activeOpacity={0.85}
          onPress={() => handleHotspotPress(hs)} // ikkala rasmdagi tugmalar ham ishlaydi
        />
      );
    });
  };

  const renderFoundRings = (hotspots, imageIndex) => {
    return hotspots
      .filter((h) => foundIds.includes(h.id))
      .map((hs) => (
        <View
          key={`${hs.id}-ring-img${imageIndex}`}
          pointerEvents="none"
          style={[
            styles.foundRing,
            {
              top: hs.top,
              left: hs.left,
              width: hs.size + 10,
              height: hs.size + 10,
              marginLeft: -(hs.size + 10) / 2,
              marginTop: -(hs.size + 10) / 2,
            },
          ]}
        />
      ));
  };

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      {/* Yuqoridagi yordam tugmalari */}
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
        audioUrl="https://ukkibackend.soof.uz/media/audio/Zukko bolajon, rasmlardan qaysi biri farq qilayotganini top..mp3"
      />

      {/* Rasmlar maydoni */}
      <View style={styles.picturesWrap}>
        {/* Birinchi rasm: interaktiv */}
        <View style={styles.pictureBox}>
          <Image source={pictures[0]} style={styles.image} />
          {/* Birinchi rasm uchun tugmalar */}
          {renderHotspots(HOTSPOTS_IMAGE1, 1)}
          {/* Topilgan elementlar uchun yashil dumaloqlar */}
          {renderFoundRings(HOTSPOTS_IMAGE1, 1)}
        </View>

        {/* Ikkinchi rasm: ham interaktiv */}
        <View style={styles.pictureBox}>
          <Image source={pictures[1]} style={styles.image} />
          {/* Ikkinchi rasm uchun tugmalar */}
          {renderHotspots(HOTSPOTS_IMAGE2, 2)}
          {/* Topilgan elementlar uchun yashil dumaloqlar */}
          {renderFoundRings(HOTSPOTS_IMAGE2, 2)}
        </View>
      </View>

      {/* Joriy xabar - katta va oddiy */}
      <View style={styles.messageArea}>
        <Text style={styles.currentMessage}>
          {currentMessage}
        </Text>
        {cheer !== "" && <Text style={styles.cheer}>{cheer}</Text>}
      </View>

      {/* Tugaganda keyingi tugma */}
      {allDone && (
        <TouchableOpacity style={Styles.NextButton} onPress={next}>
          <Text style={Styles.listenText}>Next</Text>
        </TouchableOpacity>
      )}

      {showSuccess && <ConfettiEffect />}
      {showError && <ErrorOverlay message="Yana urinib ko'ring / Try again" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  picturesWrap: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 10,
  },
  pictureBox: {
    width: "85%",
    height: "42%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#fafafa",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  hotspot: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  foundRing: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#22c55e",
    borderRadius: 999,
  },
  messageArea: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  currentMessage: {
    fontSize: 22,
    fontWeight: "600",
    color: "#16a34a",
    textAlign: "center",
    lineHeight: 28,
  },
  cheer: {
    marginTop: 8,
    textAlign: "center",
    fontWeight: "700",
    color: "#16a34a",
  },
});