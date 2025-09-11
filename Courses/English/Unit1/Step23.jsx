import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step23({next}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);
    const soundRef = useRef(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [nextBtn, setNextBtn] = useState(false)
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)

    const audios = [
        { url: "https://ukkibackend.soof.uz/media/audio/CD1-20-1.mp3", answer: "red" },
        { url: "https://ukkibackend.soof.uz/media/audio/CD1-20-2.mp3", answer: "yellow" },
        { url: "https://ukkibackend.soof.uz/media/audio/CD1-20-3.mp3", answer: "blue" },
        { url: "https://ukkibackend.soof.uz/media/audio/CD1-20-4.mp3", answer: "orange" },
        { url: "https://ukkibackend.soof.uz/media/audio/CD1-20-5.mp3", answer: "green" },
        { url: "https://ukkibackend.soof.uz/media/audio/CD1-20-6.mp3", answer: "purple" },
    ];

    const playAudio = async (index = currentIndex) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync({ uri: audios[index].url });
            soundRef.current = sound;
            await sound.playAsync();
        } catch (e) {
            console.log("Audio error:", e);
        }
    };

    const checkAnswer = async (color) => {
        const correct = audios[currentIndex].answer;

        if (color === correct) {
            setMessage("✅ To‘g‘ri!");
            setStatus("success");
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false)
            }, 2000)

            const nextIndex = currentIndex + 1;
            if (nextIndex < audios.length) {
                setCurrentIndex(nextIndex);
                setTimeout(() => playAudio(nextIndex), 1000);
            } else {
                setNextBtn(true)
                setMessage("🎉 Barcha ranglarni topdingiz!");
            }
        } else {
            setMessage("❌ Noto‘g‘ri, qaytadan eshiting!");
            setStatus("error");
            playAudio(currentIndex);
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 1000)
        }
    };

    return (
        <>
            <View style={Styles.stepContainer}>
                <ThreeButtons setDictionary={setDictionary}
                    infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick}
                    audioUrl="https://ukkibackend.soof.uz/media/audio/809023d9-a33d-43a5-aefe-17d6884117e0.mp3" />

                <TouchableOpacity style={styles.listenBtn} onPress={() => playAudio(currentIndex)}>
                    <Text style={Styles.listenText}>▶ Play </Text>
                </TouchableOpacity>

                <Image style={styles.backImg} source={require("../../../assets/images/nature.jpg")} />

                {message ? (
                    <Text
                        style={[
                            styles.message,
                            status === "success" ? styles.success : styles.error,
                        ]}
                    >
                        {message}
                    </Text>
                ) : null}
                {nextBtn && (
                    <TouchableOpacity onPress={next} style={styles.nextBtn}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.colors}>
                    {[
                        { color: "purple" },
                        { color: "orange" },
                        { color: "green" },
                        { color: "yellow" },
                        { color: "red" },
                        { color: "blue" },
                    ].map((item, index) => (
                        <View key={index} style={styles.colorBlock}>
                            <TouchableOpacity
                                style={[styles.colorBtn, { backgroundColor: item.color }]}
                                onPress={() => checkAnswer(item.color)}
                            />
                        </View>
                    ))}
                </View>
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
  backImg: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  colors: {
    width: "100%",
    height: 150,
    backgroundColor: "#3d3c7e9f",
    position: "absolute",
    bottom: 60,
    left: 0,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  colorBlock: {
    width: 70,
    height: 70,
    backgroundColor: "#e9e9e9ff",
    alignItems: "center",
    justifyContent: "center",
    margin: 1,
  },
  colorBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  message: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  success: {
    color: "limegreen",
  },
  error: {
    color: "red",
  },
  nextBtn: {
    backgroundColor: "#FFD93D",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    alignItems: "center",
    position: "absolute",
    bottom: "30%",
    right: 20,
  },
  listenBtn: {
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "#f7e013ff",
    borderRadius: 12,
    position: "absolute",
    top: "35%",
    left: "40%",
    zIndex: 10,
  },
});
