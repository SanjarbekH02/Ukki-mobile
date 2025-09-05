import { Audio } from 'expo-av'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Styles from '../../../Styles/Styles'
import ThreeButtons from '../../../components/Utils/ThreeButtons'

export default function Step17() {
    const [visible, setVisible] = useState(false)
    const [activeImg, setActiveImg] = useState(null)
    const [sound, setSound] = useState(null)
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)
    const [showPointer, setShowPointer] = useState(false)
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const audios = {
        audio1: 'https://ukkibackend.soof.uz/media/audio/CD1-15-1.mp3',
        audio2: 'https://ukkibackend.soof.uz/media/audio/CD1-15-2.mp3',
        audio3: 'https://ukkibackend.soof.uz/media/audio/CD1-15-3.mp3',
        audio4: 'https://ukkibackend.soof.uz/media/audio/CD1-15-4.mp3',
        audio5: 'https://ukkibackend.soof.uz/media/audio/CD1-15-5.mp3',
        audio6: 'https://ukkibackend.soof.uz/media/audio/CD1-15-6.mp3',
    }

    const images = {
        img1: require('../../../assets/images/rasm1.png'),
        img2: require('../../../assets/images/rasm2.png'),
        img3: require('../../../assets/images/rasm3.png'),
        img4: require('../../../assets/images/rasm4.png'),
        img5: require('../../../assets/images/rasm5.png'),
        img6: require('../../../assets/images/rasm6.png'),
    }

    useEffect(() => {
        if (showPointer) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
                ])
            ).start();
        } else {
            scaleAnim.setValue(1);
        }
    }, [showPointer]);

    async function playAudio(audioUrl, img) {
        try {
            // eski audio bo‘lsa stop qilamiz
            if (sound) {
                await sound.stopAsync()
                await sound.unloadAsync()
            }

            setActiveImg(img)
            setVisible(true)

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl })
            setSound(newSound)
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setVisible(false)
                    setActiveImg(null)
                }
            })

            await newSound.playAsync()
        } catch (error) {
            console.log('Audio error:', error)
        }
    }

    return (
        <View style={Styles.container}>
            <ThreeButtons
                setShowPointer={setShowPointer}
                audioUrl="https://ukkibackend.soof.uz/media/audio/2b1701bb-9edd-47fe-9141-daf814b22458.mp3"
                setDictionary={setDictionary}
                infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} />
            <View style={styles.imgBlock}>

                <TouchableOpacity onPress={() => {playAudio(audios.audio1, images.img1); setShowPointer(false)}} style={styles.imgBtn}>
                    {showPointer && (
                        <Animated.Image
                            source={require("../../../assets/images/hand2.png")}
                            style={[
                                styles.pointer,
                                { transform: [{ scale: scaleAnim }] }
                            ]}
                        />
                    )}
                    <View style={styles.imgNumber}>
                        <Text style={{ color: '#fff' }}>1</Text>
                    </View>
                    <Image style={styles.image} source={images.img1} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => playAudio(audios.audio2, images.img2)} style={styles.imgBtn}>
                    <View style={styles.imgNumber}>
                        <Text style={{ color: '#fff' }}>2</Text>
                    </View>
                    <Image style={styles.image} source={images.img2} />
                </TouchableOpacity>
            </View>
            <View style={styles.imgBlock}>

                <TouchableOpacity onPress={() => playAudio(audios.audio3, images.img3)} style={styles.imgBtn}>
                    <View style={styles.imgNumber}>
                        <Text style={{ color: '#fff' }}>3</Text>
                    </View>
                    <Image style={styles.image} source={images.img3} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => playAudio(audios.audio4, images.img4)} style={styles.imgBtn}>
                    <View style={styles.imgNumber}>
                        <Text style={{ color: '#fff' }}>4</Text>
                    </View>
                    <Image style={styles.image} source={images.img4} />
                </TouchableOpacity>
            </View>
            <View style={styles.imgBlock}>

                <TouchableOpacity onPress={() => playAudio(audios.audio5, images.img5)} style={styles.imgBtn}>
                    <View style={styles.imgNumber}>
                        <Text style={{ color: '#fff' }}>5</Text>
                    </View>
                    <Image style={styles.image} source={images.img5} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => playAudio(audios.audio6, images.img6)} style={styles.imgBtn}>
                    <View style={styles.imgNumber}>
                        <Text style={{ color: '#fff' }}>6</Text>
                    </View>
                    <Image style={styles.image} source={images.img6} />
                </TouchableOpacity>
            </View>

            {/* kattalashtirilgan rasm */}
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    {activeImg && (
                        <Image source={activeImg} style={styles.bigImage} />
                    )}
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: '100%', height: '90%', alignItems: "center", justifyContent: 'center', backgroundColor: '#00a6f3ff' },
    imgBlock: { width: '100%', height: '33%', flexDirection: 'row', gap: 5, marginBottom: 5, },
    imgBtn: { width: "50%", height: '100%', position: 'relative' },
    image: { width: '100%', height: '100%', resizeMode: "stretch" },

    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
    bigImage: { width: '80%', height: '50%', resizeMode: 'contain', borderRadius: 10 },
    imgNumber: {
        width: 30, height: 30, borderRadius: 50, color: 'white', borderWidth: 1, borderColor: "white", alignItems: 'center', justifyContent: 'center', backgroundColor: '#7e7e7eff',
        position: 'absolute', top: 10, left: 10, zIndex: 10
    },
    pointer: {
        position: "absolute",
        left: '40%',
        top: '40%',
        width: 90,
        height: 90,
        resizeMode: "contain",
        zIndex: 10,
    },
})
