import { Audio } from 'expo-av'
import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Styles from '../../../Styles/Styles'
import ThreeButtons from '../../../components/Utils/ThreeButtons'

export default function U3Step15({ next }) {
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
        { id: 1, audio: "https://ukkibackend.soof.uz/media/audio/CD1-52-1.mp3", img: require('../../../assets/images/unit-3/cd520.png'), text: "Olivia: What’s this? \n Tina: Oh! A present! David: Look! “To Oscar.” It’s Oscar’s birthday today. \n All:  1, 2, 3, magic tree. Clap your hands and come with me." },
        { id: 2, audio: "https://ukkibackend.soof.uz/media/audio/CD1-52-2.mp3", img: require('../../../assets/images/unit-3/cd521.png'), text: "Oscar: Hello! \n David:  Hello, Oscar! This is iPal \n  iPal: Nice to meet you, Oscar. " },
        { id: 3, audio: "https://ukkibackend.soof.uz/media/audio/CD1-52-3.mp3", img: require('../../../assets/images/unit-3/cd522.png'), text: "Tina: Here you go, Oscar. This is for you. \n All: Happy birthday! \n Oscar: Thank you. Is it a computer game?" },
        { id: 4, audio: "https://ukkibackend.soof.uz/media/audio/CD1-52-4.mp3", img: require('../../../assets/images/unit-3/cd523.png'), text: "iPal: Look! It’s a teddy bear! \n Tina: Oh, dear! \n Olivia: iPal ... It’s for Oscar!" },
        { id: 5, audio: "https://ukkibackend.soof.uz/media/audio/CD1-52-5.mp3", img: require('../../../assets/images/unit-3/cd524.png'), text: "iPal: Here you go, Oscar. This is for you. \n Oscar: Wow! It’s a robot! Thank you, iPal." },
        { id: 6, audio: "https://ukkibackend.soof.uz/media/audio/CD1-52-6.mp3", img: require('../../../assets/images/unit-3/cd525.png'), text: "David: Happy birthday, Oscar! \n All: Hooray!  \n All: 3, 2, 1, that was fun. Stamp your feet. The magic’s done!" },
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

                            <View style={styles.textContainer}>
                                {activeItem.text.split("\n").map((line, index) => {
                                    const words = line.trim().split(" "); // bo‘sh joylarni ham olib tashlaymiz
                                    return (
                                        <Text key={index} style={styles.modalText}>
                                            {/* Har qatorning birinchi so‘zini yashil rangda chiqaramiz */}
                                            <Text style={{ color: "green", fontWeight: '700' }}>{words[0]}</Text>
                                            {/* Qolgan so‘zlar oddiy rangda */}
                                            {words.slice(1).length > 0 ? " " + words.slice(1).join(" ") : ""}
                                        </Text>
                                    );
                                })}
                            </View>

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
    modalText: { marginTop: 15, fontSize: 18, color: '#2b2b2bff',  paddingHorizontal: 10 },

    imgNumber: {
        width: 30, height: 30, borderRadius: 50, borderWidth: 1, borderColor: "white",
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#7e7e7eff',
        position: 'absolute', top: 10, left: 10, zIndex: 10
    },
    textContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.99)",
        padding: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'flex-start',
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