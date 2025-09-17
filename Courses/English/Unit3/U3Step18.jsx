import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const windowWidth = Dimensions.get("window").width;

export default function U3Step18({ next }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);

  const correct = "bear";

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

  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [, setDictionary] = useState(false);

  return (
    <>
      <View style={Styles.stepContainer}>
        <ThreeButtons
          setDictionary={setDictionary}
          infoClick={infoClick}
          clicked={clicked}
          setClicked={setClicked}
          setInfoClick={setInfoClick}
          audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, kerakli rasmni tanla. .mp3"
        />

        <View style={styles.imageBlock}>
          <Image
            style={styles.Image}
            source={require("../../../assets/images/unit-3/w101.jpg")}
          />

          {selected === correct && (
            <Image
              source={require("../../../assets/images/unit-3/w102.png")}
              style={[styles.imgOption, styles.in]}
            />
          )}
          <View style={styles.in} pointerEvents="none" />
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.imgBtn}
            onPress={() => handlePress("erase")}
          >
            <Image
              style={styles.imgOption}
              source={require("../../../assets/images/unit-3/w103.jpg")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imgBtn}
            onPress={() => handlePress("bear")}
          >
            <Image
              style={styles.imgOption}
              source={require("../../../assets/images/unit-3/w102.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imgBtn}
            onPress={() => handlePress("deraza")}
          >
            <Image
              style={styles.imgOption}
              source={require("../../../assets/images/unit-3/w104.jpg")}
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
  Image: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  in: {
    width: 80,
    height: 80,
    position: "absolute",
    bottom: "7.7%",
    left: "32.5%",
    justifyContent: "center",
    alignItems: "center",
  },
  options: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 15, 
  },
  imgBtn: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 5, 
  },
  imgOption: {
    width: windowWidth * 0.23, 
    height: windowWidth * 0.23, 
    resizeMode: "stretch",
  },
});
