import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  Vibration,
} from "react-native";
import { Audio } from "expo-av";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";

const { width, height } = Dimensions.get("window");

const U3Step21 = ({ next }) => {
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [, setDictionary] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [currentSelected, setCurrentSelected] = useState(null);
  const [placedImages, setPlacedImages] = useState([]);
  const [showError, setShowError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const allImages = [
    {
      id: "top1",
      source: require("../../../assets/images/unit-3/ruchka.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/ruchka.mp3",
      position: { top: "69%", left: "43%", zIndex: 15 },
      size: { width: "10%", height: "10%" },
      transform: [{ rotate: "10deg" }],
    },
    {
      id: "top2",
      source: require("../../../assets/images/unit-3/varrak.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
      position: { top: "11%", left: "37%", zIndex: 10 },
      size: { width: "18%", height: "16%" },
      transform: [{ rotate: "-30deg" }],
    },
    {
      id: "top3",
      source: require("../../../assets/images/unit-3/stul21.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/stul.mp3",
      position: { top: "56%", left: "34%", zIndex: 10 },
      size: { width: "28%", height: "37%" },
    },
    {
      id: "top4",
      source: require("../../../assets/images/unit-3/ayiqcha.png"),
      audioUrl:
        "https://ukkibackend.soof.uz/media/audio/yumshoq ayiqchalar.mp3",
      position: { top: "19%", right: "2%", zIndex: 10 },
      size: { width: "13%", height: "18%" },
    },
    {
      id: "bottom1",
      source: require("../../../assets/images/unit-3/qalamdon.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/qalamdon.mp3",
      position: { top: "63%", right: "5%", zIndex: 10 },
      size: { width: "13%", height: "14%" },
    },
    {
      id: "bottom2",
      source: require("../../../assets/images/unit-3/koptok.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
      position: { top: "63%", left: "2.8%", zIndex: 10 },
      size: { width: "20%", height: "22%" },
    },
    {
      id: "bottom3",
      source: require("../../../assets/images/unit-3/eshik21.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/eshik.mp3",
      position: { top: "28%", left: "1%", zIndex: 10 },
      size: { width: "18%", height: "35%" },
    },
    {
      id: "bottom4",
      source: require("../../../assets/images/unit-3/velosiped.png"),
      audioUrl: "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
      position: { top: "43%", left: "16%", zIndex: 10 },
      size: { width: "27%", height: "24%" },
    },
  ];

  const topImages = allImages.slice(0, 4);
  const bottomImages = allImages.slice(4, 8);

  async function playAudio(audioUrl, imageId) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      setIsPlaying(true);
      setCurrentSelected(imageId);
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          await newSound.unloadAsync();
          setSound(null);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.log("Audio o'ynatishda xatolik:", error);
      setIsPlaying(false);
      setCurrentSelected(null);
    }
  }

  const handlePositionPress = async (posId) => {
    if (!currentSelected) return;
    if (placedImages.some((p) => p.id === posId)) return;

    const selectedImage = allImages.find((i) => i.id === currentSelected);

    if (currentSelected === posId) {
      setPlacedImages((prev) => [
        ...prev,
        {
          id: currentSelected,
          source: selectedImage.source,
          position: selectedImage.position,
          size: selectedImage.size,
          transform: selectedImage.transform, 
        },
      ]);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      setCurrentSelected(null);
      setNextBtn(placedImages.length + 1 === allImages.length);
    } else {
      setErrorMessage("Xato javob berdingiz");
      setShowError(true);
      Vibration.vibrate(500);
      setTimeout(async () => {
        setShowError(false);
        setErrorMessage("");
        if (currentSelected) {
          await playAudio(selectedImage.audioUrl, currentSelected);
        }
      }, 2000);
    }
  };

  const handleMainImagePress = async () => {
    if (!currentSelected) return;

    const selectedImage = allImages.find((i) => i.id === currentSelected);
    setErrorMessage("Xato javob berdingiz");
    setShowError(true);
    Vibration.vibrate(500);
    setTimeout(async () => {
      setShowError(false);
      setErrorMessage("");
      if (currentSelected) {
        await playAudio(selectedImage.audioUrl, currentSelected);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Eshitgan so‘zingni rangsiz rasmlar orasidan toping.
      </Text>
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
        audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, Rasmlarga qara va ularni moslashtir. .mp3"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.options, { marginBottom: -80 }]}
      >
        {topImages.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.imgBtn,
              (isPlaying || nextBtn) && styles.disabledBtn,
              currentSelected === image.id && styles.highlightedBtn,
            ]}
            onPress={() =>
              !isPlaying && !nextBtn && playAudio(image.audioUrl, image.id)
            }
            disabled={isPlaying || nextBtn}
          >
            <Image
              style={[styles.imgOption, { transform: image.transform || [] }]}
              source={image.source}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.imageBlock}>
        <TouchableOpacity
          style={styles.mainImageTouchable}
          onPress={handleMainImagePress}
        >
          <Image
            source={{
              uri: "https://ukkibackend.soof.uz/media/photo/f8fc178b-6560-43d7-9a96-19ddfab8eecf.png",
            }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {allImages.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.positionTouchable,
              {
                top: image.position.top,
                left: image.position.left || "auto",
                right: image.position.right || "auto",
                width: image.size.width,
                height: image.size.height,
                zIndex: image.position.zIndex,
              },
            ]}
            onPress={() => handlePositionPress(image.id)}
          />
        ))}
        {placedImages.map((placed) => (
          <Image
            key={placed.id}
            source={placed.source}
            style={{
              position: "absolute",
              width: placed.size.width,
              height: placed.size.height,
              top: placed.position.top,
              left: placed.position.left || "auto",
              right: placed.position.right || "auto",
              zIndex: placed.position.zIndex,
              resizeMode: "contain",
              transform: placed.transform || [],
            }}
            resizeMode="contain"
          />
        ))}
        {showError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <ErrorOverlay />
          </View>
        )}
        {isSuccess && (
          <View style={styles.confettiContainer}>
            <ConfettiEffect />
          </View>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.options, { marginTop: -70 }]}
      >
        {bottomImages.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.imgBtn,
              (isPlaying || nextBtn) && styles.disabledBtn,
              currentSelected === image.id && styles.highlightedBtn,
            ]}
            onPress={() =>
              !isPlaying && !nextBtn && playAudio(image.audioUrl, image.id)
            }
            disabled={isPlaying || nextBtn}
          >
            <Image
              style={styles.imgOption}
              source={image.source}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {nextBtn && (
        <TouchableOpacity onPress={next} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: height * 0.01,
  },
  instructionText: {
    width: "80%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
  },
  imageBlock: {
    width: "100%",
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainImageTouchable: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  positionTouchable: {
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 0,
    zIndex: 15,
  },
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  errorText: {
    color: "red",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 25,
  },
  options: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: height * 0.01,
  },
  imgBtn: {
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginHorizontal: 5,
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  highlightedBtn: {
    borderWidth: 3,
    borderColor: "#4CAF50",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  imgOption: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  nextButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
});

export default U3Step21;
