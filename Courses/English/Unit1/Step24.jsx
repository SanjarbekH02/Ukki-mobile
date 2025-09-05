import { Audio, Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

export default function Step24({next}) {
    const video = useRef(null);
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
        });
    }, []);

    return (
        <View style={styles.container}>
            <ThreeButtons
                setDictionary={setDictionary}
                infoClick={infoClick}
                clicked={clicked}
                setClicked={setClicked}
                setInfoClick={setInfoClick}
                audioUrl="https://ukkibackend.soof.uz/media/audio/3f1db8dd-f552-4fd7-a4b4-4b522a8a2878.mp3"
            />

            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: "https://ukkibackend.soof.uz/media/video/6ea4c31d-0890-4acc-a51f-c10f0651e96c.mp4",
                }}
                useNativeControls
                resizeMode="contain"
                isLooping={false} 
                shouldPlay={false}
                onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                        setIsFinished(true);
                    }
                }}
            />

            {isFinished && (
                <TouchableOpacity onPress={next} style={Styles.NextButton}>
                    <Text>Next</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    video: {
        width: "100%",
        height: 300,
    },
    nextBtn: {
        marginTop: 20,
    },
});
