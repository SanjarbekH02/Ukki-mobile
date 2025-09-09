import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const pictures = [
  require("../../../assets/images/unit-3/unit-2-step-5-1.jpg"), // Picture 1 (active / tappable)
  require("../../../assets/images/unit-3/unit-2-step-5-2.jpg"), // Picture 2 (reference)
];

// 🔵 Configure your 5 differences on Picture 1 (positions are % of the image box)
const HOTSPOTS = [
  {
    id: "yellow-ball",
    top: "22%",
    left: "18%",
    size: 64, // tweak to match your art
    sentence: "It is a yellow ball.",
    cheer: "Great! That’s the first difference!",
  },
  {
    id: "art-set",
    top: "58%",
    left: "62%",
    size: 72,
    sentence: "It is an art set.",
    cheer: "Awesome! That’s the second difference!",
  },
  {
    id: "red-ball",
    top: "30%",
    left: "73%",
    size: 58,
    sentence: "It is a red ball.",
    cheer: "Well done! That’s the third difference!",
  },
  {
    id: "orange-bike",
    top: "66%",
    left: "28%",
    size: 80,
    sentence: "It is an orange bike.",
    cheer: "Super! That’s the fourth difference!",
  },
  {
    id: "blue-box",
    top: "72%",
    left: "82%",
    size: 70,
    sentence: "It is a blue box.",
    cheer: "Excellent! That’s the last difference!",
  },
];

export default function U3Step5({ next }) {
  const [foundIds, setFoundIds] = useState([]); // ids of found hotspots
  const [messages, setMessages] = useState([]); // running list of “It is a …”
  const [cheer, setCheer] = useState(""); // transient praise text
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // optional top controls (dictionary/info bar)
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false); // not used here, kept for consistency

  const handleHotspotPress = (spot) => {
    if (foundIds.includes(spot.id)) return; // already found; ignore
    const nextIndex = foundIds.length; // 0..4 as they find items
    const correctOrderId = HOTSPOTS[nextIndex].id;

    // If you require strict order, uncomment next 4 lines:
    // if (spot.id !== correctOrderId) {
    //   setShowError(true);
    //   return setTimeout(() => setShowError(false), 900);
    // }

    // Accept in any order:
    setFoundIds((prev) => [...prev, spot.id]);
    setMessages((prev) => [...prev, spot.sentence]);

    setCheer(spot.cheer);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1100);
    setTimeout(() => setCheer(""), 1400);
  };

  const allDone = foundIds.length === HOTSPOTS.length;

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      {/* Top helper bar with instruction audio if you have it */}
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
        audioUrl="https://ukkibackend.soof.uz/media/audio/Ikki rasmni solishtiring va 5 ta farqni toping.mp3"
        playBtn={true}
      />

      {/* Pictures area */}
      <View style={styles.picturesWrap}>
        {/* Picture 1: interactive */}
        <View style={styles.pictureBox}>
          <Image source={pictures[0]} style={styles.image} />
          {/* Hotspots (tap areas) */}
          {HOTSPOTS.map((hs) => {
            const found = foundIds.includes(hs.id);
            return (
              <TouchableOpacity
                key={hs.id}
                style={[
                  styles.hotspot,
                  {
                    top: hs.top,
                    left: hs.left,
                    width: hs.size,
                    height: hs.size,
                    marginLeft: -hs.size / 2,
                    marginTop: -hs.size / 2,
                    borderColor: found ? "#22c55e" : "#ffffffcc",
                    backgroundColor: found
                      ? "rgba(34,197,94,0.25)"
                      : "rgba(255,255,255,0.25)",
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => handleHotspotPress(hs)}
              />
            );
          })}

          {/* Draw permanent circles for found items (slightly thicker) */}
          {HOTSPOTS.filter((h) => foundIds.includes(h.id)).map((hs) => (
            <View
              key={`${hs.id}-ring`}
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
          ))}
        </View>

        {/* Picture 2: reference only */}
        <View style={styles.pictureBox}>
          <Image source={pictures[1]} style={styles.image} />
        </View>
      </View>

      {/* Running messages: what the child has identified */}
      <View style={styles.feedbackCard}>
        <Text style={styles.title}>Topilgan farqlar:</Text>
        {messages.length === 0 ? (
          <Text style={styles.hint}>
            Rasmlarni solishtiring va farqlarni bosing.
          </Text>
        ) : (
          <ScrollView style={{ maxHeight: 120 }}>
            {messages.map((m, idx) => (
              <Text key={idx} style={styles.msgLine}>
                {idx + 1}. {m}
              </Text>
            ))}
          </ScrollView>
        )}
        {cheer !== "" && <Text style={styles.cheer}>{cheer}</Text>}
      </View>

      {/* Next button when finished */}
      {allDone && (
        <TouchableOpacity style={Styles.NextButton} onPress={next}>
          <Text style={Styles.listenText}>Next</Text>
        </TouchableOpacity>
      )}

      {showSuccess && <ConfettiEffect />}
      {showError && <ErrorOverlay message="Yana urinib ko‘ring / Try again" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    borderWidth: 3,
    borderRadius: 999,
  },
  foundRing: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#22c55e",
    borderRadius: 999,
  },
  feedbackCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 90,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    color: "#333",
  },
  hint: { color: "#666", fontStyle: "italic" },
  msgLine: { fontSize: 15, color: "#222", marginBottom: 4 },
  cheer: {
    marginTop: 8,
    textAlign: "center",
    fontWeight: "700",
    color: "#16a34a",
  },
});
