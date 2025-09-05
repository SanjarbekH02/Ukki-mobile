import { Audio } from "expo-av"; // audio uchun
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step13({next}) {
  const [result, setResult] = useState("");
  const [blocks, setBlocks] = useState({});
  const [placedNames, setPlacedNames] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showNext, setShowNext] = useState(false); // faqat audio tugaganda true bo‘ladi

  const blockRefs = useRef({});
  const audioRef = useRef(null);

  const correctMapping = {
    dragBlock1: "Olivia",
    dragBlock2: "David",
    dragBlock3: "Tina",
  };

  const panOlivia = useRef(new Animated.ValueXY()).current;
  const panDavid = useRef(new Animated.ValueXY()).current;
  const panTina = useRef(new Animated.ValueXY()).current;

  const onBlockLayout = (key) => {
    blockRefs.current[key]?.measure((fx, fy, width, height, px, py) => {
      setBlocks((prev) => ({
        ...prev,
        [key]: { x: px, y: py, width, height },
      }));
    });
  };

  const createPanResponder = (name, pan) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        let dropped = false;

        const dropX = gesture.x0 + gesture.dx;
        const dropY = gesture.y0 + gesture.dy;

        for (let key in blocks) {
          const b = blocks[key];
          if (
            dropX > b.x &&
            dropX < b.x + b.width &&
            dropY > b.y &&
            dropY < b.y + b.height
          ) {
            dropped = true;
            if (correctMapping[key] === name) {
              setResult('');
              setIsSuccess(true);
              setTimeout(() => {
                setIsSuccess(false);
              }, 2000);
              setPlacedNames((prev) => [...prev, name]);
              Animated.spring(pan, {
                toValue: { x: b.x - 40, y: b.y - 400 },
                useNativeDriver: false,
              }).start();
            } else {
              setResult(`❌ ${name} boshqa joyda`);
              setIsError(true);
              setTimeout(() => {
                setIsError(false);
              }, 1000);
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
              }).start();
            }
            break;
          }
        }

        if (!dropped) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    });

  const oliviaResponder = createPanResponder("Olivia", panOlivia);
  const davidResponder = createPanResponder("David", panDavid);
  const tinaResponder = createPanResponder("Tina", panTina);

  const allPlaced =
    placedNames.includes("Olivia") &&
    placedNames.includes("David") &&
    placedNames.includes("Tina");

  // 🎵 hamma joyiga qo‘yilganda audio avtomatik o‘ynaydi
  useEffect(() => {
    if (allPlaced) {
      playCompletionAudio();
    }
  }, [allPlaced]);

  const playCompletionAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: "https://ukkibackend.soof.uz/media/audio/d69bc1ad-d5da-450a-93a8-ebea3b7971ab.mp3",
      });
      audioRef.current = sound;

      // audio tugaganda NEXT ko‘rsatamiz
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setShowNext(true);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.log("Audio play error:", error);
    }
  };

  // komponent unmount bo‘lganda audio ni tozalash
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <>
      <View style={Styles.stepContainer}>
        <TouchableOpacity style={Styles.listenBtn}>
          <Text style={Styles.listenNumber}>10</Text>
          <Text style={Styles.listenText}>Sing the song</Text>
        </TouchableOpacity>

        <ThreeButtons audioUrl="https://ukkibackend.soof.uz/media/audio/bf086184-230f-40c1-a06b-7479f695edc9.mp3" />

        <View style={styles.imgBlock}>
          <Image
            style={styles.image}
            source={require("../../../assets/images/listen10.jpg")}
          />
          <View
            ref={(ref) => (blockRefs.current["dragBlock1"] = ref)}
            style={[styles.dragBlock, styles.dragBlock1]}
            onLayout={() => onBlockLayout("dragBlock1")}
          />
          <View
            ref={(ref) => (blockRefs.current["dragBlock2"] = ref)}
            style={[styles.dragBlock, styles.dragBlock2]}
            onLayout={() => onBlockLayout("dragBlock2")}
          />
          <View
            ref={(ref) => (blockRefs.current["dragBlock3"] = ref)}
            style={[styles.dragBlock, styles.dragBlock3]}
            onLayout={() => onBlockLayout("dragBlock3")}
          />
        </View>

        {/* ismlar */}
        <View style={styles.namesRow}>
          {!placedNames.includes("Tina") && (
            <Animated.View
              style={[panTina.getLayout(), styles.draggable]}
              {...tinaResponder.panHandlers}
            >
              <Text>Tina</Text>
            </Animated.View>
          )}








          {!placedNames.includes("Olivia") && (
            <Animated.View
              style={[panOlivia.getLayout(), styles.draggable]}
              {...oliviaResponder.panHandlers}
            >
              <Text>Olivia</Text>
            </Animated.View>
          )}

          {!placedNames.includes("David") && (
            <Animated.View
              style={[panDavid.getLayout(), styles.draggable]}
              {...davidResponder.panHandlers}
            >
              <Text>David</Text>
            </Animated.View>
          )}
        </View>

        {result ? <Text style={styles.result}>{result}</Text> : null}

        {showNext && (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={next}
          >
            <Text style={styles.nextText}>Play</Text>
          </TouchableOpacity>
        )}
      </View>
      {isSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  imgBlock: { width: "100%", height: "40%", backgroundColor: "red" },
  image: { width: "100%", height: "100%", resizeMode: "stretch" },
  dragBlock: {
    width: "13%",
    height: "50%",
    zIndex: 10,
    position: "absolute",
  },
  dragBlock1: { bottom: "9%", left: "4%" },
  dragBlock2: { bottom: "9%", left: "37%" },
  dragBlock3: { bottom: "9%", right: "4%" },

  namesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 50,
  },
  draggable: {
    width: 80,
    height: 80,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  result: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
  },
  nextBtn: {
    backgroundColor: "green",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 40,
    alignSelf: "center",
  },
  nextText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
