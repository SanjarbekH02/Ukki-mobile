import { Audio } from "expo-av";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

export default function U2Step21({ next }) {
  const [infoClick, setInfoClick] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dictionary, setDictionary] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinishedPlaying, setHasFinishedPlaying] = useState(false);

  const audioUrl =
    "https://ukkibackend.soof.uz/media/audio/ed785a1f-bb12-4a93-bb1b-b2ba6289184a.mp3";

  const handlePlay = async () => {
    if (isPlaying && sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setHasFinishedPlaying(true);
      }
    });
  };

  return (
    <View style={Styles.stepContainer}>
      <ThreeButtons
        setDictionary={setDictionary}
        infoClick={infoClick}
        clicked={clicked}
        setClicked={setClicked}
        setInfoClick={setInfoClick}
        audioUrl="https://ukkibackend.soof.uz/media/audio/3543cc8b-4839-4c07-93d8-a371e90dbaa9.mp3"
      />

      <View style={styles.imgBlock}>
        <Image
          style={styles.image}
          source={require("../../../assets/images/cd36.jpg")}
        />
      </View>

      <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
        <Text style={{ color: "white", fontSize: 16 }}>
          {isPlaying ? "Stop " : "Play "}
        </Text>
      </TouchableOpacity>

      {hasFinishedPlaying && (
        <TouchableOpacity onPress={next} style={Styles.NextButton}>
          <Text>Next </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imgBlock: { width: "100%", height: "40%" },
  image: { width: "100%", height: "100%", resizeMode: "stretch" },
  playButton: {
    backgroundColor: "blue",
    width: 100,
    padding: 12,
    marginTop: 20,
    borderRadius: 50,
    alignItems: "center",
  },
});
