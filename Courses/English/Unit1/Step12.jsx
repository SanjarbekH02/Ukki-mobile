import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles from '../../../Styles/Styles';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import { audioPlay } from '../../../constants/AudioPlay';

export default function Step12({next}) {
    const [activeBtns, setActiveBtns] = useState(Array(7).fill(false))

    // 7 ta audio url
    const audioLinks = [
        "https://ukkibackend.soof.uz/media/audio/CD1-12-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-3.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-4.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-7.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-6.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-5.mp3",
    ]

    const handlePressIn = (index) => {
        const newBtns = [...activeBtns]
        newBtns[index] = true
        setActiveBtns(newBtns)

        // ✅ tugma bosilganda audio chalinsin
        audioPlay(audioLinks[index])
    }

    const handlePressOut = (index) => {
        const newBtns = [...activeBtns]
        newBtns[index] = false
        setActiveBtns(newBtns)
    }

    return (
        <View style={Styles.stepContainer}>
            <ThreeButtons />
            <TouchableOpacity
                style={Styles.listenBtn}
               
            >
                <Text style={Styles.listenNumber}>9</Text>
                <Text style={Styles.listenText}>Listen. Point and say</Text>
            </TouchableOpacity>
            <View style={styles.colorsBlock}>
                <Image style={styles.colorImg} source={require('../../../assets/images/colors.jpg')} />

                {[styles.colorBtn1, styles.colorBtn2, styles.colorBtn3, styles.colorBtn4, styles.colorBtn5, styles.colorBtn6, styles.colorBtn7].map((posStyle, index) => (
                    <TouchableOpacity
                        key={index}
                        onPressIn={() => handlePressIn(index)}
                        onPressOut={() => handlePressOut(index)}
                        style={[styles.colorBtn, posStyle, activeBtns[index] && styles.activeBtn]}
                    />
                ))}
            </View>
            <TouchableOpacity onPress={next} style={Styles.NextButton}>
                <Text>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    colorsBlock: { width: "100%", height: '30%', marginBottom: 100 },
    colorImg: { width: '100%', height: "100%", resizeMode: "stretch" },
    colorBtn: { width: '8%', height: '60%', position: 'absolute' },
    colorBtn1: { top: '15%', left: '8%' },
    colorBtn2: { top: '15%', left: '18%' },
    colorBtn3: { top: '16%', left: '29%' },
    colorBtn4: { top: '16%', left: '41%' },
    colorBtn5: { top: '16%', right: '18%' },
    colorBtn6: { top: '16%', right: '29%' },
    colorBtn7: { top: '16%', right: '40%' },
    activeBtn: { backgroundColor: '#ffffff79' }
})
