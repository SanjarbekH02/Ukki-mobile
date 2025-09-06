import { Audio } from 'expo-av'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Styles from '../../../Styles/Styles'
import ThreeButtons from '../../../components/Utils/ThreeButtons'

export default function U2Step15({ next }) {
    const [visible, setVisible] = useState(false)
    const [activeItem, setActiveItem] = useState(null)
    const [sound, setSound] = useState(null)
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)
    const [showPointer, setShowPointer] = useState(false)
     const [playedItems, setPlayedItems] = useState([]);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const items = [
        { id: 1, audio: 'https://ukkibackend.soof.uz/media/audio/CD1-33-1.mp3', img: require('../../../assets/images/cd330.png'), text: "  Look! It's a robot! - Qara! Bu robot! \n Pick it up, David. Look! - Uni ol, David. Qara!" },
        { id: 2, audio: 'https://ukkibackend.soof.uz/media/audio/CD1-33-2.mp3', img: require('../../../assets/images/cd331.png'), text: "1, 2, 3, magic tree. Clap your hands and come with me. - 1, 2, 3, sehrli daraxt. Qarsak chal va men bilan yur. \n Clap your hands! -  Qarsak chal!" },
        { id: 3, audio: 'https://ukkibackend.soof.uz/media/audio/CD1-33-3.mp3', img: require('../../../assets/images/cd332.png'), text: "Wow! We're at school! - Voy! Biz maktabdamiz! \n Hello, Miss Berry! - Salom, Miss Berry! \n Hello! - Salom \n Hello! My name's iPal! Nice to meet you. -  Salom! Mening ismim iPal! Tanishganimdan xursandman" },
        { id: 4, audio: 'https://ukkibackend.soof.uz/media/audio/CD1-33-4.mp3', img: require('../../../assets/images/cd333.png'), text: "A red pen, a blue pen, count with me. How many pens can you see? - Qizil ruchka, koʻk ruchka, men bilan san. Nechta ruchka koʻrayapsan? \n Four pens - Toʻrtta ruchka." },
        { id: 5, audio: 'https://ukkibackend.soof.uz/media/audio/CD1-33-5.mp3', img: require('../../../assets/images/cd334.png'), text: "3, 2, 1, that was fun. Stamp your feet – the magic's done! - 3, 2, 1, qiziqarli boʻldi. Oyoqlaringni dupillat – sehr tugadi! \n Goodbye, Miss Berry! - Xayr, Miss Berry! " },
        { id: 6, audio: 'https://ukkibackend.soof.uz/media/audio/CD1-33-6.mp3', img: require('../../../assets/images/cd335.png'), text: "Wow! Thanks, iPal. - Voy! Rahmat, iPal. \n iPal? - iPal? \n Look! - Qara! " },
    ]

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

    async function playAudio(item) {
        try {
            if (sound) {
                await sound.stopAsync()
                await sound.unloadAsync()
            }

            setActiveItem(item)
            setVisible(true)

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: item.audio })
            setSound(newSound)
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setVisible(false)
                    setActiveItem(null)

                    setPlayedItems(prev => prev.includes(item.id) ? prev : [...prev, item.id])
                }
            })

            await newSound.playAsync()
        } catch (error) {
            console.log('Audio error:', error)
        }
    }

    console.log(playedItems.length)

    return (
        <View style={Styles.container}>
            <ThreeButtons
                setShowPointer={setShowPointer}
                audioUrl="https://ukkibackend.soof.uz/media/audio/2b1701bb-9edd-47fe-9141-daf814b22458.mp3"
                setDictionary={setDictionary}
                infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} />

            {/** Rasm bloklari */}
            <View style={styles.imgBlock}>
                {items.slice(0, 2).map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => { playAudio(item); if (item.id === 1) setShowPointer(false) }}
                        style={styles.imgBtn}>
                        {showPointer && item.id === 1 && (
                            <Animated.Image
                                source={require("../../../assets/images/hand2.png")}
                                style={[styles.pointer, { transform: [{ scale: scaleAnim }] }]}
                            />
                        )}
                        <View style={styles.imgNumber}>
                            <Text style={{ color: '#fff' }}>{item.id}</Text>
                        </View>
                        <Image style={styles.image} source={item.img} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.imgBlock}>
                {items.slice(2, 4).map(item => (
                    <TouchableOpacity key={item.id} onPress={() => playAudio(item)} style={styles.imgBtn}>
                        <View style={styles.imgNumber}>
                            <Text style={{ color: '#fff' }}>{item.id}</Text>
                        </View>
                        <Image style={styles.image} source={item.img} />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.imgBlock}>
                {items.slice(4, 6).map(item => (
                    <TouchableOpacity key={item.id} onPress={() => playAudio(item)} style={styles.imgBtn}>
                        <View style={styles.imgNumber}>
                            <Text style={{ color: '#fff' }}>{item.id}</Text>
                        </View>
                        <Image style={styles.image} source={item.img} />
                    </TouchableOpacity>
                ))}
            </View>

            {/** Modal */}
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    {activeItem && (
                        <View style={styles.modalContent}>
                            <Image
                                source={activeItem?.img}
                                style={styles.bigImage}
                                resizeMode="contain"
                            />

                            <Text style={styles.modalText}>{activeItem.text}</Text>
                        </View>
                    )}
                </View>
            </Modal>
            {playedItems.length >= 6 && (
                <TouchableOpacity style={Styles.NextButton} onPress={next}>
                    <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: '100%', height: '90%', alignItems: "center", justifyContent: 'center', backgroundColor: '#00a6f3ff' },
    imgBlock: { width: '100%', height: '33%', flexDirection: 'row', gap: 5, marginBottom: 5 },
    imgBtn: { width: "50%", height: '100%', position: 'relative' },
    image: { width: '100%', height: '100%', resizeMode: "stretch" },

    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
    modalContent: { alignItems: 'center', justifyContent: 'center' },
    bigImage: { width: 300, height: 300, borderRadius: 10, },
    modalText: { marginTop: 15, fontSize: 18, color: '#fff', textAlign: 'center', paddingHorizontal: 10 },

    imgNumber: {
        width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "white",
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#7e7e7eff',
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
    nextBtn: {
        marginTop: 15,
        paddingHorizontal: 25,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        zIndex: 1000,
    },
    nextText: {
        color: '#00a6f3',
        fontSize: 18,
        fontWeight: 'bold',
    }
})