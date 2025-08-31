import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function Step19({ next }) {
  const [count, setCount] = useState(5);
  const [showName, setShowName] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const nameAnim = useRef(new Animated.Value(0)).current;

  const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

  useEffect(() => {
    if (count === 0) {
      setShowName(true);

      nameAnim.setValue(0);
      Animated.spring(nameAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();

      return;
    }

    scaleAnim.setValue(0);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 2,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => setCount((prev) => prev - 1));
  }, [count]);

  return (
    <View style={Styles.stepContainer}>
      <ThreeButtons />  
      {!showName ? (
        <Text style={styles.title}>Bu jonzotning ismi nima?</Text>
      ) : (
        <Animated.Text
          style={[styles.name, { transform: [{ scale: nameAnim }] }]}
        >
          🦎 Lizard (Leo)
        </Animated.Text>
      )}

      <Image
        style={styles.image}
        source={require("../../../assets/images/listen13.png")}
      />

      {count > 0 && (
        <Animated.Text
          style={[
            styles.countdown,
            { color: colors[count - 1], transform: [{ scale: scaleAnim }] },
          ]}
        >
          {count}
        </Animated.Text>
      )}

      {showName && (
        <TouchableOpacity style={Styles.NextButton} onPress={next}>
          <Text style={styles.buttonText}>Next ➡️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: "200%",
    height: "40%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  countdown: {
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#16A34A",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});
