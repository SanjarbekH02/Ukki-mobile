  import { Audio } from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ComponentTop from "./ComponentTop";
import ErrorOverlay from "./OnError";
import ConfettiEffect from "./Success";

  export default function WordPractice({
    words = [
      { text: "hello", audioUrl: "https://ukkibackend.soof.uz/media/audio/4cf823e3-4e9c-4182-91dd-4027395781d8.mp3" },
      { text: "how", audioUrl: "https://ukkibackend.soof.uz/media/audio/4cf823e3-4e9c-4182-91dd-4027395781d8.mp3" },
    ],
    onFinish
  }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [recording, setRecording] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const timeOutRef = useRef(null);

    const soundRef = useRef(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      playAudio();
      return () => {
        if (soundRef.current) {
          soundRef.current.unloadAsync();
        }
      };
    }, [currentIndex]);

    const setPlayMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
      });
    };

    const setRecordMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    };

    const playAudio = async () => {
      try {
        setIsPlaying(true);
        setStatusText("");

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        await setPlayMode();
        const { sound } = await Audio.Sound.createAsync({ uri: words[currentIndex].audioUrl });
        soundRef.current = sound;
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            startRecording();
          }
        });
      } catch (err) {
        console.error("Audio play error:", err);
      }
    };

    const startRecording = async () => {
  try {
    const perm = await Audio.requestPermissionsAsync();
    if (perm.status !== "granted") return;

    // Eski recording bo‘lsa, tozalab yuboramiz
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (e) {
        // recording hali start bo‘lmagan bo‘lsa, xatoni ignorda qoldiramiz
      }
      setRecording(null);
    }

    await setRecordMode();
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(newRecording);
    setIsRecording(true);
    startPulse();
  } catch (err) {
    console.error("Recording error:", err);
  }
};


    const stopRecording = async () => {
      if (!isRecording) return;
      try {
        setIsRecording(false);
        stopPulse();
        await recording.stopAndUnloadAsync();
        await setPlayMode();

        const uri = recording.getURI();

        const formData = new FormData();
        formData.append("file", {
          uri,
          name: "audio.mp3",
          type: "audio/mpeg",
        });

        const sttResponse = await fetch("https://stt.soof.uz/stt", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "accept-language": "en",
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const sttData = await sttResponse.json();
        // console.log("STT javobi:", sttData);

        const userSaid = (sttData.transcript || "").toLowerCase().trim();
        const correctWord = words[currentIndex].text.split("-")[0].toLowerCase().trim();

        if (userSaid === correctWord) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
          setRetryCount(0);
          setTimeout(nextWord, 1000);
        } else {
          if (retryCount < 2) {

            setError(true);
            setTimeout(() => setError(false), 3000);
            setRetryCount(retryCount + 1);
            setTimeout(playAudio, 1500);
          } else {
            setStatusText(`❌ Noto‘g‘ri! To‘g‘ri javob: "${correctWord}"`);
            setRetryCount(0);
            setTimeout(nextWord, 2000);
          }
        }
      } catch (err) {
        console.error("Stop recording error:", err);
      }
    };

    const nextWord = () => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsCompleted(true);
        if (onFinish) onFinish();
      }
    };

    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.2, duration: 600, useNativeDriver: true, easing: Easing.linear }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.linear }),
        ])
      ).start();
    };

    const stopPulse = () => {
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);
    };

    return (
      <LinearGradient
        colors={['#f2f2fe', '#f9eaef', '#fef3ee']}
        style={{ flex: 1 }}
      >
        {success && <ConfettiEffect />}
        {error && <ErrorOverlay />}
        <ComponentTop class="transparent" text="Eshit va takrorla" />

        <View style={styles.container}>
          {!isCompleted ? (
            <>
              <Text style={styles.word}>{words[currentIndex].text}</Text>

              <TouchableOpacity onPress={isRecording ? stopRecording : undefined} activeOpacity={0.7}>
                <Animated.View style={[styles.micWrapper, { transform: [{ scale: scaleAnim }] }]}>
                  <View style={styles.micCircle}>
                    {isRecording ? (
                      <Image source={require("../../assets/images/recording.gif")} style={styles.micIcon} />
                    ) : (
                      <Image source={require("../../assets/images/mic.png")} style={styles.micIcon} />
                    )}
                  </View>
                </Animated.View>
              </TouchableOpacity>


            </>
          ) : (
            <TouchableOpacity style={styles.doneText}>
              <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    );
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 80
    },
    word: {
      fontSize: 36, fontWeight: "bold", marginBottom: 60,
    },
    micWrapper: {
      justifyContent: "center", alignItems: "center",
      width: 120, height: 120, borderRadius: 60, backgroundColor: "#f0e6ff",
    },
    micCircle: {
      width: 80, height: 80, borderRadius: 40,
      justifyContent: "center", alignItems: "center",
    },
    micIcon: {
      width: 60, height: 60, resizeMode: "contain"
    },
    status: {
      marginTop: 20, fontSize: 18, fontWeight: "500",
    },
    doneText: {
      backgroundColor: "#0059FF", padding: 15, borderRadius: 8, width: "60%", textAlign: "center",
      fontSize: 20, color: "white",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
    },
  });
