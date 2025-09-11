import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles from '../../../Styles/Styles';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import { audioPlay } from '../../../constants/AudioPlay';

export default function Step12({ next }) {
    const [activeBtns, setActiveBtns] = useState(Array(7).fill(false))
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1)
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true)
    const [dictionary, setDictionary] = useState(false)
    const [wordgame, setWordgame] = useState(true)
    const [talaffuz, setTalaffuz] = useState(false)

    const audioLinks = [
        "https://ukkibackend.soof.uz/media/audio/CD1-12-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-3.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-4.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-5.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-6.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-12-7.mp3",
    ]

    const colors = [
        '#FF0000',
        '#FFFF00',
        '#008000',
        '#0000FF',
        '#FFC0CB',
        '#FFA500',
        '#800080',
    ]

    const buttonPositions = [
        styles.colorBtn1,
        styles.colorBtn2,
        styles.colorBtn3,
        styles.colorBtn4,
        styles.colorBtn7,
        styles.colorBtn6,
        styles.colorBtn5,
    ]

    useEffect(() => {
        let currentIndex = 0;
        const playSequentially = async () => {
            if (currentIndex < audioLinks.length) {
                setCurrentPlayingIndex(currentIndex);
                await audioPlay(audioLinks[currentIndex]);
                setTimeout(() => {
                    setCurrentPlayingIndex(-1);
                    currentIndex++;
                    setTimeout(playSequentially, 500);
                }, 2000);
            }
        };
        setTimeout(playSequentially, 1000);
    }, []);

    const handlePressIn = async (index) => {
        const newBtns = [...activeBtns]
        newBtns[index] = true
        setActiveBtns(newBtns)
        setCurrentPlayingIndex(index);
        await audioPlay(audioLinks[index]);
    }

    const handlePressOut = (index) => {
        const newBtns = [...activeBtns]
        newBtns[index] = false
        setActiveBtns(newBtns)
        if (currentPlayingIndex === index) {
            setTimeout(() => setCurrentPlayingIndex(-1), 2000);
        }
    }

    return (
        <>
            {dictionary ? (
                <>

                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[
                                { word: "red", translation: "qizil", audioUrl: "https://ukkibackend.soof.uz/media/audio/qizil.mp3" },
                                { word: "Point ", translation: "ko’rsatmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/ko'rsatmoq.mp3" },
                                { word: "Say", translation: "Aytmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/aytmoq.mp3" },
                                { word: "Who ", translation: "Kim", audioUrl: "https://ukkibackend.soof.uz/media/audio/kim.mp3" },
                                { word: "Speak", translation: "Gapirmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/gapirmoq.mp3" },
                                { word: "Find", translation: "Topmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/topmoq.mp3" },
                                { word: "What is your name?", translation: " Sening isming nima?", audioUrl: "https://ukkibackend.soof.uz/media/audio/sening isming nima.mp3" },
                            ]}
                        />

                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                { text: "red", audioUrl: "https://ukkibackend.soof.uz/media/audio/qizil.mp3" },
                                { text: "point", audioUrl: "https://ukkibackend.soof.uz/media/audio/ko'rsatmoq.mp3" },
                                { text: "say", audioUrl: "https://ukkibackend.soof.uz/media/audio/aytmoq.mp3" },
                                { text: "who", audioUrl: "https://ukkibackend.soof.uz/media/audio/kim.mp3" },
                                { text: "speak", audioUrl: "https://ukkibackend.soof.uz/media/audio/gapirmoq.mp3" },
                                { text: "find", audioUrl: "https://ukkibackend.soof.uz/media/audio/topmoq.mp3" },
                            ]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={["listen", "point", "say", "who", "speak", "find",]}
                            audios={
                                [
                                    "https://ukkibackend.soof.uz/media/audio/tinglamoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/ko'rsatmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/aytmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/kim.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/gapirmoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/topmoq.mp3",

                                ]
                            }
                        />
                    )}
                </>
            ) : (
                <View style={Styles.stepContainer}>
                    <ThreeButtons
                     />
                    <TouchableOpacity style={Styles.listenBtn}>
                        <Text style={Styles.listenNumber}>9</Text>
                        <Text style={Styles.listenText}>Listen. Point and say</Text>
                    </TouchableOpacity>
                    <View style={styles.colorsBlock}>
                        <Image style={styles.colorImg} source={require('../../../assets/images/colors.jpg')} />
                        {buttonPositions.map((posStyle, index) => (
                            <View key={index}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        setCurrentPlayingIndex(index);
                                        await audioPlay(audioLinks[index]);
                                        setTimeout(() => setCurrentPlayingIndex(-1), 2000);
                                    }}
                                    onPressIn={() => handlePressIn(index)}
                                    onPressOut={() => handlePressOut(index)}
                                    style={[
                                        styles.colorBtn,
                                        posStyle,
                                        activeBtns[index] && styles.activeBtn,
                                        currentPlayingIndex === index && [
                                            styles.playingBtn,
                                            { backgroundColor: colors[index] + '40' }
                                        ]
                                    ]}
                                />
                                {currentPlayingIndex === index && (
                                    <View
                                        style={[
                                            styles.colorIndicator,
                                            posStyle,
                                            { backgroundColor: colors[index] }
                                        ]}
                                    />
                                )}
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity onPress={next} style={Styles.NextButton}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                </View>)}
        </>
    )
}

const styles = StyleSheet.create({
    colorsBlock: { width: "100%", height: '30%', marginBottom: 100 },
    colorImg: { width: '100%', height: "100%", resizeMode: "stretch" },
    colorBtn: { width: '8%', height: '60%', position: 'absolute' },
    colorBtn1: { top: '15%', left: '8%', },
    colorBtn2: { top: '15%', left: '18%' },
    colorBtn3: { top: '16%', left: '29%' },
    colorBtn4: { top: '16%', left: '41%' },
    colorBtn5: { top: '16%', right: '18%' },
    colorBtn6: { top: '16%', right: '29%' },
    colorBtn7: { top: '16%', right: '40%' },
    activeBtn: { backgroundColor: '#ffffff79' },
    playingBtn: {
        transform: [{ scale: 1.2 }],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    colorIndicator: {
        width: '6%',
        height: 10,
        borderRadius: 100,
        position: 'absolute',
        transform: [{ translateX: '25%' }, { translateY: '120%' }],
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        borderWidth: 2,
        borderColor: '#fff'
    }
})
