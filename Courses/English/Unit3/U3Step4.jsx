import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const imagesLeft = [
  { src: require("../../../assets/images/unit-3/cd421.jpg"), label: "Button 1", style: { top: '12%', left: 0 }, pair: 8 },
  { src: require("../../../assets/images/unit-3/cd422.jpg"), label: "Button 2", style: { top: '28%', left: '23%', zIndex: 2 },  pair: 9 },
  { src: require("../../../assets/images/unit-3/cd423.jpg"), label: "Button 3", style: { top: '41%', left: 0 },  pair: 10 },
  { src: require("../../../assets/images/unit-3/cd424.jpg"), label: "Button 4", style: { top: '53%', left: '23%' }, pair: 7 },
];

const imagesRight = [
  { src: require("../../../assets/images/unit-3/cd425.jpg"), label: "Button 7", style: { top: '12%', right: '23%' }, id: 7 },
  { src: require("../../../assets/images/unit-3/cd426.jpg"), label: "Button 8", style: { top: '28%', right: 0 }, id: 8 },
  { src: require("../../../assets/images/unit-3/cd427.jpg"), label: "Button 9", style: { top: '41%', right: '23%' }, id: 9 },
  { src: require("../../../assets/images/unit-3/cd428.jpg"), label: "Button 10", style: { top: '53%', right: 0 }, id: 10 },
];

const U3Step4 = ({next}) => {
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [message, setMessage] = useState("");
  const soundRef = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false)
  const [showNext, setShowNext] = useState(false);

  // Barcha juftliklar to'g'ri bog'langanini tekshirish
  const isAllMatched = matched.length === imagesLeft.length * 2;

  const handleLeftPress = (item, idx) => {
    setSelectedLeft(idx);
    setMessage("");
  };

  const handleRightPress = (item) => {
    if (selectedLeft !== null) {
      const leftItem = imagesLeft[selectedLeft];
      if (leftItem.pair === item.id) {
        const newMatched = [...matched, leftItem.label, item.label];
        setMessage("✅ To'g'ri!");
        setIsSuccess(true)
        setTimeout(() => {
          setIsSuccess(false)
        }, 2000)
        setMatched(newMatched);
        setSelectedLeft(null);
        
        // Barcha elementlar bog'langanda next tugmasini ko'rsatish
        if (newMatched.length === imagesLeft.length * 2) {
          setTimeout(() => {
            setShowNext(true);
          }, 2000);
        }
      } else {
        setMessage("❌ Xato, qayta urinib ko'ring!");
        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 1000)
        setSelectedLeft(null);
      }
    }
  };

  const handleNext = () => {
    // Bu yerda keyingi sahifaga o'tish logikasini yozing
    console.log("Keyingi sahifaga o'tish");
    // Masalan: navigation.navigate('NextScreen');
  };

  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true)
  const [talaffuz, setTalaffuz] = useState(false)

  return (
    <>
      <View style={styles.container}>
        <ThreeButtons setDictionary={setDictionary}
          infoClick={infoClick}
          clicked={clicked}
          setClicked={setClicked}
          setInfoClick={setInfoClick}
          audioUrl="https://ukkibackend.soof.uz/media/audio/Bilag’on bolajon, Rasmlarga qara va ularni moslashtir. .mp3" />
        
        {imagesLeft.map((item, idx) => {
          if (matched.includes(item.label)) return null;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.button,
                item.style,
                selectedLeft === idx && { borderWidth: 3, borderColor: "blue" }
              ]}
              onPress={() => handleLeftPress(item, idx)}
            >
              <Image source={item.src} style={styles.image} />
            </TouchableOpacity>
          );
        })}

        <View style={styles.centerLine}></View>

        {imagesRight.map((item, idx) => {
          if (matched.includes(item.label)) return null;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.button, item.style]}
              onPress={() => handleRightPress(item)}
            >
              <Image source={item.src} style={styles.image} />
            </TouchableOpacity>
          );
        })}

        {message !== "" && (
          <View style={styles.messageBox}>
            <Text style={[styles.message, message.includes("Xato") && { color: "red" }]}>
              {message}
            </Text>
          </View>
        )}

        {showNext && (
          <TouchableOpacity style={styles.nextButton} onPress={next}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSuccess && <ConfettiEffect />}
      {isError && <ErrorOverlay />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#f9f9f9",
  },
  button: {
    position: "absolute",
    alignItems: "center",
    width: "25%",
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: "contain",
  },
  centerLine: {
    width: 2,
    height: '100%',
    backgroundColor: "#b4b4b4ff",
    position: 'absolute',
    top: 0,
    left: '50%'
  },
  messageBox: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  message: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green"
  },
  nextButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default U3Step4;