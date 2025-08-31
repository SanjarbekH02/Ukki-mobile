import { Ionicons } from "@expo/vector-icons"; 
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from '../../../Styles/Styles';
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step25({ next }) {
  const questions = [
    {
      q: "Red + Yellow",
      answer: "orange",
      left: require("../../../assets/images/qizilchotka.png"),
      right: require("../../../assets/images/sariqchotka.png"),
    },
    {
      q: "Blue + Yellow",
      answer: "green",
      left: require("../../../assets/images/kokchotka.png"),
      right: require("../../../assets/images/sariqchotka.png"),
    },
    {
      q: "Blue + Red",
      answer: "purple",
      left: require("../../../assets/images/sariqchotka.png"),
      right: require("../../../assets/images/qizilchotka.png"),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [recording, setRecording] = useState(null);
  const [result, setResult] = useState("");
  const [answer, setAnswer] = useState("");
  const [borderColor, setBorderColor] = useState("#fff");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);
  const [infoClick, setInfoClick] = useState(false);

  const startRecording = async () => {
    try {
      console.log("Recording start...");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Microphone permission required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
      setResult("");
      setAnswer("");
      setBorderColor("#ffcc00");
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = async () => {
    console.log("Recording stop...");
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        const text = await sendToSTT(uri);
        setResult(text);

        if (text?.toLowerCase().includes(questions[currentIndex].answer)) {
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false)
          }, 2000)
          setAnswer("✅ To‘g‘ri");
          setBorderColor("green");

          setTimeout(() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex(currentIndex + 1);
              setAnswer("");
              setResult("");
              setBorderColor("#fff");
            } else {
              setNextBtn(true)
              setAnswer("🎉 Barcha savollarga javob berding!");
            }
          }, 1500);
        } else {
          setIsError(true);
          setTimeout(() => {
            setIsError(false)
          }, 1000)
          setAnswer("❌ Noto‘g‘ri, qaytadan urinib ko‘r");
          setBorderColor("red");
        }
      }
    } catch (err) {
      console.error("Stop error:", err);
    }
  };

  const sendToSTT = async (fileUri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "audio/m4a",
        name: "recording.m4a",
      });

      const sttResponse = await fetch("https://stt.soof.uz/stt", {
        method: "POST",
        headers: {
          accept: "application/json",
          "accept-language": "en",
        },
        body: formData,
      });

      if (!sttResponse.ok) {
        throw new Error(`STT error: ${sttResponse.status}`);
      }

      const text = await sttResponse.text();
      console.log("STT natija:", text);
      return text;
    } catch (err) {
      console.error("STT error:", err);
      return "";
    }
  };

  return (
    <LinearGradient style={styles.container} colors={["blue", "green"]}>
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
        audioUrl="https://ukkibackend.soof.uz/media/audio/e2cc6e11-6038-4a12-8701-4f18bf821c60.mp3" />
      <View style={[styles.colorsBlock, { borderColor }]}>
        <Image style={styles.colorImg} source={questions[currentIndex].left} />
        <Text style={{ fontSize: 22 }}>+</Text>
        <Image style={styles.colorImg} source={questions[currentIndex].right} />
        <Text style={{ fontSize: 22 }}>=</Text>
        <Text style={{ fontSize: 32, color: "#c7c7c7ff" }}>?</Text>
      </View>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: 'white' }}>{answer}</Text>
      <TouchableOpacity
        style={styles.micButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Ionicons
          name="mic"
          size={40}
          color={recording ? "red" : "black"}
        />
      </TouchableOpacity>
      {nextBtn && (
        <TouchableOpacity onPress={next} style={Styles.NextButton}>
          <Text>Next</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  colorsBlock: {
    width: "90%",
    height: 100,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 50,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 12,
  },
  colorImg: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginTop: 70
  },
});
