import { useEffect, useRef, useState } from "react";
import { Animated, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Styles from "../../../Styles/Styles";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import WordPractice from "../../../components/Utils/Talaffuz";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import WordGameAssist from "../../../components/Utils/WordGame";
import FlashCards from "../../../components/YangiSozlar";

const items = [
    { id: 1, img: require("../../../assets/images/olivia.jpg"), correct: "b" },
    { id: 2, img: require("../../../assets/images/leo.jpg"), correct: "c" },
    { id: 3, img: require("../../../assets/images/tina.jpg"), correct: "d" },
    { id: 4, img: require("../../../assets/images/david.jpg"), correct: "a" },
];

const targets = [
    { id: "a", img: require("../../../assets/images/davidSoya.jpg") },
    { id: "b", img: require("../../../assets/images/oliviaSoya.jpg") },
    { id: "c", img: require("../../../assets/images/leoSoya.jpg") },
    { id: "d", img: require("../../../assets/images/tinaSoya.jpg") },
];

export default function App({ next }) {
    const [positions, setPositions] = useState({});
    const [matched, setMatched] = useState({});
    const dropZones = useRef({});
    const [isError, setIsError] = useState(false);

    const createResponder = (item) => {
        let pan = new Animated.ValueXY();

        const responder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gesture) => {
                let foundTarget = null;

                Object.keys(positions).forEach((key) => {
                    const pos = positions[key];
                    if (
                        gesture.moveX > pos.x &&
                        gesture.moveX < pos.x + pos.width &&
                        gesture.moveY > pos.y &&
                        gesture.moveY < pos.y + pos.height
                    ) {
                        foundTarget = key;
                    }
                });

                if (foundTarget) {
                    if (foundTarget === item.correct) {
                        setMatched((prev) => ({ ...prev, [item.id]: true }));
                        // Rasmni drop zone ichida qoldiramiz
                        Animated.spring(pan, {
                            toValue: {
                                x: positions[foundTarget].x - gesture.x0 + 20,
                                y: positions[foundTarget].y - gesture.y0 + 20,
                            },
                            useNativeDriver: false,
                        }).start();
                    } else {
                        setIsError(true);
                        setTimeout(() => {
                            setIsError(false);
                        }, 2000);
                        pan.setValue({ x: 0, y: 0 });
                    }
                } else {
                    pan.setValue({ x: 0, y: 0 });
                }
            },
        });

        return { pan, responder };
    };

    // Drop zone o‘lchamini olish
    const measureDropZones = () => {
        Object.keys(dropZones.current).forEach((key) => {
            dropZones.current[key]?.measureInWindow((x, y, width, height) => {
                setPositions((prev) => ({
                    ...prev,
                    [key]: { x, y, width, height },
                }));
            });
        });
    };

    useEffect(() => {
        setTimeout(measureDropZones, 500);
    }, []);

    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true)
    const [dictionary, setDictionary] = useState(false)
    const [wordgame, setWordgame] = useState(true)
    const [talaffuz, setTalaffuz] = useState(false)

    return (
        <>
            {dictionary ? (
                <>

                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[
                                { word: "I'm", translation: "Men", audioUrl: "https://ukkibackend.soof.uz/media/audio/men.mp3" },
                                { word: "This", translation: "Bu", audioUrl: "https://ukkibackend.soof.uz/media/audio/bu.mp3" },
                                { word: "Friend", translation: "Do‘st", audioUrl: "https://ukkibackend.soof.uz/media/audio/do'st.mp3" },
                                { word: "Answer", translation: "Javob bermoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/javob bermoq.mp3" },
                                { word: "Name", translation: "Ism", audioUrl: "https://ukkibackend.soof.uz/media/audio/ism.mp3" },
                            ]}
                        />

                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                { text: "I'm", audioUrl: "https://ukkibackend.soof.uz/media/audio/men.mp3" },
                                { text: "This", audioUrl: "https://ukkibackend.soof.uz/media/audio/bu.mp3" },
                                { text: "Friend", audioUrl: "https://ukkibackend.soof.uz/media/audio/do'st.mp3" },
                                { text: "Answer", audioUrl: "https://ukkibackend.soof.uz/media/audio/javob bermoq.mp3" },
                                { text: "Name", audioUrl: "https://ukkibackend.soof.uz/media/audio/ism.mp3" },
                            ]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={["I'm", "This", "Friend", "Answer", "Name",]}
                            audios={
                                [
                                    "https://ukkibackend.soof.uz/media/audio/men.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/bu.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/do'st.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/javob bermoq.mp3",
                                    "https://ukkibackend.soof.uz/media/audio/ism.mp3",

                                ]
                            }
                        />
                    )}
                </>
            ) : (
                <View style={styles.container}>
                    <ThreeButtons setDictionary={setDictionary}
                        infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/Salom bilag’on bolajon, Rasmlarga qara va ularni moslashtir. .mp3" />
                    <View style={styles.leftColumn}>
                        {items.map((item) => {
                            if (matched[item.id]) return null;
                            const { pan, responder } = createResponder(item);
                            return (
                                <Animated.View
                                    key={item.id}
                                    style={[styles.item, { transform: pan.getTranslateTransform() }]}
                                    {...responder.panHandlers}
                                >
                                    <Image source={item.img} style={styles.itemImg} />
                                    <Text style={styles.label}>{item.id}</Text>
                                </Animated.View>
                            );
                        })}
                    </View>

                    {/* O‘ng tomonda soyalar */}
                    <View
                        style={[
                            styles.rightColumn,
                            Object.keys(matched).length === items.length && styles.completed
                        ]}
                    >
                        {targets.map((t) => (
                            <View
                                key={t.id}
                                style={styles.target}
                                ref={(ref) => (dropZones.current[t.id] = ref)}
                            >
                                {/* Agar moslangan bo‘lsa, rasmni ichida ko‘rsatamiz */}
                                {Object.keys(matched).find(
                                    (itemId) =>
                                        items.find((i) => i.id == itemId)?.correct === t.id
                                ) ? (
                                    <Image
                                        source={
                                            items.find((i) => i.correct === t.id).img
                                        }
                                        style={styles.targetImg}
                                    />
                                ) : (
                                    <Image source={t.img} style={styles.targetImg} />
                                )}
                                <Text style={styles.label}>{t.id}</Text>
                            </View>
                        ))}
                    </View>

                    {Object.keys(matched).length === items.length && (
                        <TouchableOpacity onPress={next} style={Styles.NextButton}>
                            <Text>Next ➡️</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
            {isError && <ErrorOverlay />}
            {Object.keys(matched).length === items.length && <ConfettiEffect />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        padding: 20,
        // backgroundColor: "#fff",
    },
    leftColumn: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    rightColumn: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    completed: {
        justifyContent: "center",
        // alignItems: "center",
        marginRight: "27%",
    },
    target: {
        width: 100,
        height: 120,
        backgroundColor: "#eee",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        elevation: 3,
    },
    targetImg: { width: 80, height: 80, resizeMode: "contain" },
    item: {
        alignItems: "center",
        margin: 10,
    },
    itemImg: {
        width: 70,
        height: 70,
        resizeMode: "contain",
        borderRadius: 10,
    },
    label: {
        marginTop: 5,
        fontWeight: "bold",
        fontSize: 16,
    },
    nextBtn: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: "center",
    },
});
