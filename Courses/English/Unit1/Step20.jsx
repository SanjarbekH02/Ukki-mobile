import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";
import WordPractice from "../../../components/Utils/Talaffuz";
import WordGameAssist from "../../../components/Utils/WordGame"; 


export default function Step20({ next }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false);
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(false);


  const correct = "chumchuq";

  const handlePress = (option) => {
    if (option === correct) {
      setSelected(option);
      setResult("✅ To‘g‘ri!");
      setNextBtn(true);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } else {
      setSelected(null);
      setResult("❌ Notog‘ri!");
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 1000);
    }
  };

  return (
    <>
      {dictionary ? (
        <>
          {wordgame ? (
            <FlashCards
              setDictionary={setWordgame}
              data={[
                {
                  word: "nest",
                  translation: "uya",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/uya .mp3", 
                },
                {
                  word: "bird",
                  translation: "qush",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/qush.mp3",
                },
                {
                  word: "fish",
                  translation: "baliq",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/baliq.mp3",
                },
                {
                  word: "cat",
                  translation: "mushuk",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/mushuk.mp3",
                },
                {
                  word: "missing",
                  translation: "yo‘qolgan",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yoqolgan.mp3",
                },
                {
                  word: "draw",
                  translation: "chizmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/chizmoq.mp3",
                },
                {
                  word: "stick",
                  translation: "yopishtirmoq",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yopishtirmoq.mp3",
                },
              ]}
            />
          ) : talaffuz ? (
            <WordPractice
              setWordgame={setWordgame}
              setDictionary={setDictionary}
              setTalaffuz={setTalaffuz}
              words={[
                {
                  text: "nest",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/uya .mp3", 
                },
                {
                  text: "bird",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/qush.mp3",
                },
                {
                  text: "fish",
                  audioUrl: "https://ukkibackend.soof.uz/media/audio/baliq.mp3",
                },
                {
                  text: "cat",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/mushuk.mp3",
                },
                {
                  text: "missing",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yoqolgan.mp3",
                },
                {
                  text: "draw",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/chizmoq.mp3",
                },
                {
                  text: "stick",
                  audioUrl:
                    "https://ukkibackend.soof.uz/media/audio/yopishtirmoq.mp3",
                },
              ]}
            />
          ) : (
            <WordGameAssist
              setDictionary={setTalaffuz}
              words={[
                "nest",
                "bird",
                "fish",
                "cat",
                "missing",
                "draw",
                "stick",
              ]}
              audios={[
                "https://ukkibackend.soof.uz/media/audio/uya .mp3",
                "https://ukkibackend.soof.uz/media/audio/qush.mp3",
                "https://ukkibackend.soof.uz/media/audio/baliq.mp3",
                "https://ukkibackend.soof.uz/media/audio/mushuk.mp3",
                "https://ukkibackend.soof.uz/media/audio/yoqolgan.mp3",
                "https://ukkibackend.soof.uz/media/audio/chizmoq.mp3",
                "https://ukkibackend.soof.uz/media/audio/yopishtirmoq.mp3",
              ]}
            />
          )}
        </>
      ) : (
        <View style={Styles.stepContainer}>
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/4afacf03-8c3b-4477-971a-1125121da03b.mp3"
          />

          <View style={styles.imageBlock}>
            <Image
              style={styles.Image}
              source={require("../../../assets/images/uya.jpg")}
            />

            {/* faqat to‘g‘ri bo‘lsa ko‘rsatiladi */}
            {selected === correct && (
              <Image
                source={require("../../../assets/images/chumchuq.png")}
                style={[styles.imgOption, styles.in]}
              />
            )}
            <View style={styles.in} pointerEvents="none" />
          </View>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.imgBtn}
              onPress={() => handlePress("baliq")}
            >
              <Image
                style={styles.imgOption}
                source={require("../../../assets/images/baliq.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imgBtn}
              onPress={() => handlePress("mushuk")}
            >
              <Image
                style={styles.imgOption}
                source={require("../../../assets/images/mushuk.png")}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imgBtn}
              onPress={() => handlePress("chumchuq")}
            >
              <Image
                style={styles.imgOption}
                source={require("../../../assets/images/chumchuq.png")}
              />
            </TouchableOpacity>
          </View>

          {result !== "" && (
            <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
              {result}
            </Text>
          )}
          {nextBtn && (
            <TouchableOpacity onPress={next} style={Styles.NextButton}>
              <Text style={{ fontWeight: "700" }}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {isSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  imageBlock: {
    width: "100%",
    height: "40%",
    marginBottom: 40,
    position: "relative",
  },
  Image: { width: "100%", height: "100%", resizeMode: "stretch" },
  in: {
    width: 80,
    height: 80,
    position: "absolute",
    bottom: "13%",
    left: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  options: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  imgBtn: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  imgOption: {
    width: 100,
    height: 100,
    resizeMode: "stretch",
  },
});
