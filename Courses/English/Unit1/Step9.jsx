import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Styles from '../../../Styles/Styles'
import ErrorOverlay from '../../../components/Utils/OnError'
import ConfettiEffect from '../../../components/Utils/Success'
import ThreeButtons from '../../../components/Utils/ThreeButtons'
import { audioPlay } from '../../../constants/AudioPlay'

export default function Step9({next}) {
    const [isSuccess, setIsSucces] = useState(false);
    const [isError, setIsError] = useState(false);
    const audioUrls = [
        "https://ukkibackend.soof.uz/media/audio/CD1-10-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-10-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-10-3.mp3",
    ]

    const children = [
        { name: "Sam", age: 6, correctBtn: "ageBtn3" },
        { name: "Alex", age: 8, correctBtn: "ageBtn1" },
        { name: "Lucy", age: 7, correctBtn: "ageBtn2" },
    ]

    const [selectedChild, setSelectedChild] = useState(null)
    const [showInfo, setShowInfo] = useState(false)
    const [result, setResult] = useState("")

    const handlePlay = async (index) => {
        setShowInfo(false)
        setResult("")
        setSelectedChild(children[index])

        await audioPlay(audioUrls[index], () => {
            setShowInfo(true)
        })
    }

    const checkAnswer = (btnKey) => {
        if (!selectedChild) return
        if (selectedChild.correctBtn === btnKey) {
            setIsSucces(true);
            setTimeout(() => {
                setIsSucces(false)
            }, 2000)
        } else {
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 2000)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <ThreeButtons />
                <TouchableOpacity style={Styles.listenBtn}>
                    <Text style={Styles.listenNumber}>7</Text>
                    <Text style={Styles.listenText}>Look and match</Text>
                </TouchableOpacity>

                {showInfo && selectedChild && (
                    <Text style={styles.infoText}>
                        {selectedChild.name}ning yoshi nechchida?
                    </Text>
                )}

                {result !== "" && (
                    <Text style={styles.resultText}>{result}</Text>
                )}

                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={require('../../../assets/images/listen7.png')} />

                    {/* Audio tugmalari */}
                    <TouchableOpacity
                        style={[styles.numberBtn, styles.numberBtn1]}
                        onPress={() => handlePlay(0)}
                    />
                    <TouchableOpacity
                        style={[styles.numberBtn, styles.numberBtn2]}
                        onPress={() => handlePlay(1)}
                    />
                    <TouchableOpacity
                        style={[styles.numberBtn, styles.numberBtn3]}
                        onPress={() => handlePlay(2)}
                    />

                    {/* Yosh tugmalari */}
                    <TouchableOpacity
                        style={[styles.numberBtn, styles.ageBtn1]}
                        onPress={() => checkAnswer("ageBtn1")}
                    />
                    <TouchableOpacity
                        style={[styles.numberBtn, styles.ageBtn2]}
                        onPress={() => checkAnswer("ageBtn2")}
                    />
                    <TouchableOpacity
                        style={[styles.numberBtn, styles.ageBtn3]}
                        onPress={() => checkAnswer("ageBtn3")}
                    />
                </View>
                <TouchableOpacity onPress={next} style={Styles.NextButton}>
                    <Text>Next</Text>
                </TouchableOpacity>
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageContainer: { position: 'relative', width: '100%', height: 260, padding: 10 },
    image: { width: '100%', height: '100%', resizeMode: 'stretch' },
    numberBtn: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    numberBtn1: { top: 20, left: '5%' },
    numberBtn2: { top: 20, left: "40%" },
    numberBtn3: { top: 20, right: '5%' },
    ageBtn1: { borderWidth: 1, borderColor: '#000', width: 80, height: 80, bottom: 16, left: '11%' },
    ageBtn2: { borderWidth: 1, borderColor: '#000', width: 80, height: 80, bottom: 16, left: '45%' },
    ageBtn3: { borderWidth: 1, borderColor: '#000', width: 80, height: 80, bottom: 16, right: '5%' },

    infoText: { fontSize: 18, marginVertical: 10, fontWeight: '600', color: '#001affff' },
    resultText: { fontSize: 20, fontWeight: '700', marginVertical: 5 }
})
