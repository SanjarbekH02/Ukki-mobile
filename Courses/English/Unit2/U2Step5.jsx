import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";

export default function U2Step5({ next }) {
  const [foundDiffs, setFoundDiffs] = useState([]);

  // Farq bo'lgan tugmalar
  const differences = ["imgBtn2", "imgBtn6", "imgBtn8", "imgBtn11", "imgBtn12"];

  const handlePress = (name) => {
    if (differences.includes(name) && !foundDiffs.includes(name)) {
      setFoundDiffs([...foundDiffs, name]);
    }
  };

  const allFound = foundDiffs.length === differences.length;

  // Next tugmasi bosilganda
  const handleNext = () => {
    if (allFound && next) {
      next();
    }
  };

  return (
    <View style={Styles.stepContainer}>
      {/* Chap rasm */}
      <View style={styles.imgBlock}>
        <Image
          style={styles.imgBack}
          source={require("../../../assets/images/backImg.jpg")}
        />

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn1]}
          onPress={() => handlePress("imgBtn1")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/sabzi.png")}
          />
          {foundDiffs.includes("imgBtn1") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn2]}
          onPress={() => handlePress("imgBtn2")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/deraza.png")}
          />
          {foundDiffs.includes("imgBtn2") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn4]}
          onPress={() => handlePress("imgBtn4")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/daraxtrasmi.png")}
          />
          {foundDiffs.includes("imgBtn4") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn5]}
          onPress={() => handlePress("imgBtn5")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/quyoshrasmi.png")}
          />
          {foundDiffs.includes("imgBtn5") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn6]}
          onPress={() => handlePress("imgBtn6")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/qizilKitob.png")}
          />
          {foundDiffs.includes("imgBtn6") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn7]}
          onPress={() => handlePress("imgBtn7")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/qogoz.png")}
          />
          {foundDiffs.includes("imgBtn7") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn8]}
          onPress={() => handlePress("imgBtn8")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/yashilqalam.png")}
          />
          {foundDiffs.includes("imgBtn8") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn9]}
          onPress={() => handlePress("imgBtn9")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/pushtiqalam.png")}
          />
          {foundDiffs.includes("imgBtn9") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn10]}
          onPress={() => handlePress("imgBtn10")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/kitoblar.png")}
          />
          {foundDiffs.includes("imgBtn10") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn11]}
          onPress={() => handlePress("imgBtn11")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/zargaldoqqalam.png")}
          />
          {foundDiffs.includes("imgBtn11") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn12]}
          onPress={() => handlePress("imgBtn12")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/qalamBack.png")}
          />
          {foundDiffs.includes("imgBtn12") && <View style={styles.circle} />}
        </TouchableOpacity>
      </View>

      {/* O'ng rasm */}
      <View style={styles.imgBlock}>
        <Image
          style={styles.imgBack}
          source={require("../../../assets/images/backImg.jpg")}
        />

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn1]}
          onPress={() => handlePress("imgBtn1")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/sabzi.png")}
          />
          {foundDiffs.includes("imgBtn1") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn3]}
          onPress={() => handlePress("imgBtn2")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/eshik.png")}
          />
          {foundDiffs.includes("imgBtn2") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn4]}
          onPress={() => handlePress("imgBtn4")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/daraxtrasmi.png")}
          />
          {foundDiffs.includes("imgBtn4") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn5]}
          onPress={() => handlePress("imgBtn5")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/quyoshrasmi.png")}
          />
          {foundDiffs.includes("imgBtn5") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn6]}
          onPress={() => handlePress("imgBtn6")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/kashalok.png")}
          />
          {foundDiffs.includes("imgBtn6") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn7]}
          onPress={() => handlePress("imgBtn7")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/qogoz.png")}
          />
          {foundDiffs.includes("imgBtn7") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn8]}
          onPress={() => handlePress("imgBtn8")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/yashilochirgich.png")}
          />
          {foundDiffs.includes("imgBtn8") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn9]}
          onPress={() => handlePress("imgBtn9")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/pushtiqalam.png")}
          />
          {foundDiffs.includes("imgBtn9") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn10]}
          onPress={() => handlePress("imgBtn10")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/kitoblar.png")}
          />
          {foundDiffs.includes("imgBtn10") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn11]}
          onPress={() => handlePress("imgBtn11")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/ruchkaBack.png")}
          />
          {foundDiffs.includes("imgBtn11") && <View style={styles.circle} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imgBtn, styles.imgBtn12]}
          onPress={() => handlePress("imgBtn12")}
        >
          <Image
            style={styles.imgBackChild}
            source={require("../../../assets/images/sariqochirgish.png")}
          />
          {foundDiffs.includes("imgBtn12") && <View style={styles.circle} />}
        </TouchableOpacity>
      </View>

      {/* NEXT tugmasi */}
      {allFound && (
        <TouchableOpacity style={Styles.NextButton} onPress={handleNext}>
          <Text style={Styles.listenText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imgBlock: {
    width: "100%",
    height: "50%",
    position: "relative",
    marginBottom: 10,
  },
  imgBack: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  imgBtn: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  imgBtn1: { width: "40%", height: "40%", top: "3%", left: -20 },
  imgBtn2: { width: "40%", height: "40%", top: "2%", left: "33%" },
  imgBtn3: { width: "50%", height: "60%", top: "3%", left: "28%" },
  imgBtn4: { width: "20%", height: "20%", top: "2%", right: "4%" },
  imgBtn5: { width: "20%", height: "20%", top: "22%", right: "9%" },
  imgBtn6: { width: "20%", height: "20%", bottom: "25%", left: "17%" },
  imgBtn7: { width: "25%", height: "25%", bottom: "5%", left: "43%" },
  imgBtn8: { width: "10%", height: "10%", bottom: "9%", left: "20%" },
  imgBtn9: { width: "10%", height: "10%", bottom: "4%", left: "40%" },
  imgBtn10: { width: "35%", height: "35%", bottom: "18%", left: "35%" },
  imgBtn11: { width: "17%", height: "17%", bottom: "38%", left: "50%" },
  imgBtn12: { width: "13%", height: "13%", bottom: "38%", right: "20%" },
  imgBackChild: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  circle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "red",
  },
});
