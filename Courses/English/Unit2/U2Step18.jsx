import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Styles from '../../../Styles/Styles'
import ThreeButtons from '../../../components/Utils/ThreeButtons'

export default function U2Step18({ next }) {
    const [sound, setSound] = useState(null)
    const [showNext, setShowNext] = useState(false)
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)

    const audioUrl = "https://ukkibackend.soof.uz/media/audio/94ca040f-5745-4163-b156-01c96bf4b441.mp3"

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            )
            setSound(sound)
        } catch (error) {
            console.log("Audio error:", error)
        }
    }

    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            setShowNext(true)
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync()
            }
            : undefined
    }, [sound])

    return (
        <View style={Styles.stepContainer}>
            <ThreeButtons
                audioUrl="https://ukkibackend.soof.uz/media/audio/ad9c2f34-e973-422c-8641-024bc5db66e9.mp3"
                setDictionary={setDictionary}
                infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} />
            {!showNext && (
                <TouchableOpacity onPress={playSound} style={styles.play}>
                    <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>▶ Suhbatni Tinglash</Text>
                </TouchableOpacity>
            )}

            <Image style={styles.image} source={require('../../../assets/images/cd35.jpg')} />

            <View style={{ width: '100%' }}>
                <Text style={styles.text}>
                    <Text style={styles.en}>Hello. My name’s Ravi. </Text>
                    <Text style={styles.uz}>— Salom. Mening ismim Ravi.</Text>
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.en}>Hello. Nice to meet you. </Text>
                    <Text style={styles.uz}>— Salom. Siz bilan tanishganimdan xursandman.</Text>
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.en}>And you. </Text>
                    <Text style={styles.uz}>— Men ham (xursandman).</Text>
                </Text>
            </View>

            {showNext && (
                <TouchableOpacity onPress={next} style={styles.nextBtn}>
                    <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>Next ➡</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 400,
        resizeMode: "contain",
    },
    play: {
        backgroundColor: "#4CAF50",
        paddingVertical: 20,
        paddingHorizontal: 50,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        padding: 8,
        lineHeight: 26
    },
    en: {
        color: "#2196F3",
        fontWeight: "600",
    },
    uz: {
        color: "#4CAF50",
        fontStyle: "italic",
    },
    nextBtn: {
        backgroundColor: "#2196F3",
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    }
})
