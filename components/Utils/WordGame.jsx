// import { Audio } from "expo-av";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Image,
    LayoutAnimation,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";
import ErrorOverlay from "./OnError";
import Success from "./Success";
import ThreeButtons from "./ThreeButtons";

export default function WordGameAssist({
    setDictionary,
    words = ["hello", "bye", "green", "yellow"],
    audios = [
        "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3",
    ],
}) {
    const [index, setIndex] = useState(0);
    const [target, setTarget] = useState(words[0].toLowerCase());
    const [boxes, setBoxes] = useState([]);
    const [pool, setPool] = useState([]);
    const [message, setMessage] = useState("");
    const [disablePool, setDisablePool] = useState(false);

    const [isStarted, setIsStarted] = useState(false); // 🔥 yangi state

    const pointerScale = useRef(new Animated.Value(1)).current;
    const wordSound = useRef(null);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pointerScale, {
                    toValue: 1.2,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pointerScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (!isStarted) return; // 🔥 faqat Play bosilganda ishlaydi
        initForWord(words[index]);
        setAttempts(0);
        playWordAudio(audios[index]);
        return () => {
            unloadWordAudio();
        };
    }, [index, isStarted]);

    async function playWordAudio(url) {
        try {
            await unloadWordAudio();
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            wordSound.current = sound;
            await sound.playAsync();
        } catch (e) {
            console.log("Audio error:", e);
        }
    }

    async function unloadWordAudio() {
        try {
            if (wordSound.current) {
                await wordSound.current.stopAsync();
                await wordSound.current.unloadAsync();
                wordSound.current = null;
            }
        } catch (e) { }
    }

    // attempts counter
    const [attempts, setAttempts] = useState(0);

    // assist mode state
    const [assistMode, setAssistMode] = useState(false);
    const [assistIndex, setAssistIndex] = useState(0);

    // pointer animation
    const pointerAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const pointerOpacity = useRef(new Animated.Value(0)).current;
    const poolContainerLayout = useRef({ x: 0, y: 0 });
    const poolItemLayouts = useRef({});

    // sounds
    const clickSound = useRef(null);
    const successSound = useRef(null);
    const errorSound = useRef(null);

    function initForWord(word) {
        const w = String(word).toLowerCase();
        setTarget(w);
        setBoxes(Array.from({ length: w.length }).map(() => null));
        const letters = w.split("");
        const poolPrepared = letters.map((l, i) => ({
            id: `${i}-${l}-${Math.random().toString(36).slice(2)}`,
            letter: l,
            used: false,
        }));
        setPool(shuffle(poolPrepared));
        setMessage("");
        setDisablePool(false);
        setAssistMode(false);
        setAssistIndex(0);
        poolItemLayouts.current = {};
        pointerOpacity.setValue(0);
        if (Platform.OS === "android" && LayoutAnimation && LayoutAnimation.configureNext) {
        }
    }

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    async function onPick(poolId) {
        if (assistMode) {
            const suggested = getSuggestedPoolItemForAssist(assistIndex);
            if (!suggested || suggested.id !== poolId) {
                return;
            }
        }

        const poolIdx = pool.findIndex((p) => p.id === poolId);
        if (poolIdx === -1) return;
        if (pool[poolIdx].used) return;

        const emptyBoxIdx = boxes.findIndex((b) => b === null);
        if (emptyBoxIdx === -1) return;

        const newBoxes = boxes.slice();
        newBoxes[emptyBoxIdx] = { ...pool[poolIdx] };
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBoxes(newBoxes);

        const newPool = pool.slice();
        newPool[poolIdx] = { ...newPool[poolIdx], used: true };
        setPool(newPool);

        if (assistMode) {
            setAssistIndex((prev) => prev + 1);
        }

        if (newBoxes.every((b) => b !== null)) {
            setDisablePool(true);
            setTimeout(() => checkAnswer(newBoxes), 300);
        }
    }

    function onRemoveFromBox(boxIdx) {
        if (assistMode) return;
        if (boxes[boxIdx] === null) return;
        const item = boxes[boxIdx];
        const newBoxes = boxes.slice();
        newBoxes[boxIdx] = null;
        setBoxes(newBoxes);

        const newPool = pool.map((p) => (p.id === item.id ? { ...p, used: false } : p));
        setPool(newPool);
        setMessage("");
        setDisablePool(false);
    }

    function checkAnswer(filledBoxes) {
        const assembled = filledBoxes.map((b) => b.letter).join("");
        if (assembled === target) {
            setMessage("Tog'ri!");
            setAttempts(0);
            setAssistMode(false);
            setAssistIndex(0);
            if (index < words.length - 1) {
                setTimeout(() => {
                    setIndex(index + 1);
                }, 900);
            }
        } else {
            Vibration.vibrate(300);
            setMessage("Noto'g'ri — qaytadan yozing");
            setAttempts((prev) => {
                const nextAttempt = prev + 1;
                if (nextAttempt >= 3) {
                    setTimeout(() => startAssist(), 600);
                }
                return nextAttempt;
            });

            setTimeout(() => {
                setPool((prev) => prev.map((p) => ({ ...p, used: false })));
                setBoxes(Array.from({ length: target.length }).map(() => null));
                setDisablePool(false);
                setTimeout(() => setMessage(""), 1200);
            }, 700);
        }
    }

    function startAssist() {
        setAssistMode(true);
        setAssistIndex(0);
        setTimeout(() => {
            movePointerToSuggested(0);
        }, 120);
    }

    function getSuggestedPoolItemForAssist(idx) {
        const ch = target[idx];
        const poolItem = pool.find((p) => p.letter === ch && !p.used);
        return poolItem || null;
    }

    function movePointerToSuggested(idx) {
        const poolItem = getSuggestedPoolItemForAssist(idx);
        if (!poolItem) {
            flashSuggestedLettersFallback(idx);
            return;
        }
        const layout = poolItemLayouts.current[poolItem.id];
        const container = poolContainerLayout.current;
        if (!layout || !container) {
            flashSuggestedLettersFallback(idx);
            return;
        }

        const targetX = container.x + layout.x + layout.width / 2 - 20;
        const targetY = container.y + layout.y + 50;

        Animated.timing(pointerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        Animated.spring(pointerAnim, {
            toValue: { x: targetX, y: targetY },
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
        }).start();
    }

    function flashSuggestedLettersFallback(idx) {
        const poolItem = getSuggestedPoolItemForAssist(idx);
        if (!poolItem) return;
        setPool((prev) => prev.map((p) => (p.id === poolItem.id ? { ...p, used: true } : p)));
        setTimeout(() => {
            setPool((prev) => prev.map((p) => (p.id === poolItem.id ? { ...p, used: false } : p)));
        }, 700);
        Animated.timing(pointerOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start(() => {
            setTimeout(() => {
                Animated.timing(pointerOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
            }, 700);
        });
    }

    useEffect(() => {
        if (!assistMode) return;
        if (assistIndex >= target.length) {
            Animated.timing(pointerOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
            return;
        }
        movePointerToSuggested(assistIndex);
    }, [assistIndex, assistMode]);

    function onPoolContainerLayout(e) {
        poolContainerLayout.current = e.nativeEvent.layout;
    }
    function onPoolItemLayout(id, e) {
        poolItemLayouts.current[id] = e.nativeEvent.layout;
    }

    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            {!isStarted ? (
                <>
                    <ThreeButtons
                        setDictionary={setDictionary}
                        infoClick={infoClick}
                        clicked={clicked}
                        setClicked={setClicked}
                        setInfoClick={setInfoClick}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/f7546256-eda1-4406-91fd-864fda928a2c.mp3"
                    />
                    <TouchableOpacity style={styles.playBtn} onPress={() => setIsStarted(true)}>
                        <Text style={styles.playBtnText}>▶️ Play</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <ThreeButtons
                        setDictionary={setDictionary}
                        infoClick={infoClick}
                        clicked={clicked}
                        setClicked={setClicked}
                        setInfoClick={setInfoClick}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/f7546256-eda1-4406-91fd-864fda928a2c.mp3"
                    />
                    <Text style={styles.title}>🌈 So'z o'yini</Text>
                    <Text style={styles.hint}>So'zni tuzing ({target.length} harf)</Text>

                    {/* Boxes */}
                    <View style={styles.boxRow}>
                        {boxes.map((b, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.box, b ? styles.boxFilled : null]}
                                onPress={() => onRemoveFromBox(i)}
                                activeOpacity={0.8}
                                disabled={assistMode}
                            >
                                <Text style={styles.boxText}>{b ? b.letter.toUpperCase() : ""}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {message === "Tog'ri!" ? (
                        <>
                            <Success />
                            {index === words.length - 1 && (
                                <TouchableOpacity
                                    style={[styles.controlBtn, { marginTop: 20 }]}
                                    onPress={() => {
                                        setDictionary(true);
                                        setIsStarted(false);
                                    }}
                                >
                                    <Text style={styles.controlText}>🎉 Tugatish</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : message === "Noto'g'ri — qaytadan yozing" ? (
                        <ErrorOverlay />
                    ) : null}

                    <View style={styles.poolRow} onLayout={onPoolContainerLayout}>
                        {pool.map((p) => {
                            let extraStyle = {};
                            if (assistMode) {
                                const suggested = getSuggestedPoolItemForAssist(assistIndex);
                                if (suggested && suggested.id === p.id) {
                                    extraStyle = styles.suggestedLetter;
                                } else {
                                    extraStyle = styles.dimmedLetter;
                                }
                            }
                            return (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[styles.letter, p.used ? styles.letterUsed : null, extraStyle]}
                                    onLayout={(e) => onPoolItemLayout(p.id, e)}
                                    onPress={() => onPick(p.id)}
                                    disabled={p.used || disablePool}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.letterText}>{p.letter.toUpperCase()}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.pointer,
                            {
                                opacity: pointerOpacity,
                                transform: [
                                    { translateX: pointerAnim.x },
                                    { translateY: pointerAnim.y },
                                    { scale: pointerScale },
                                ],
                            },
                        ]}
                    >
                        <Image
                            source={require("../../assets/images/hand.png")}
                            style={{ width: 40, height: 40, resizeMode: "contain" }}
                        />
                    </Animated.View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#fdf6ff" },
    title: { fontSize: 26, fontWeight: "800", marginBottom: 6, color: "#ff6f91" },
    hint: { fontSize: 15, marginBottom: 12, color: "#444" },
    playBtn: {
        backgroundColor: "#4caf50",
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 4,
    },
    playBtnText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    boxRow: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: 'wrap',
        marginBottom: 18,
    },
    box: {
        width: 54,
        height: 54,
        marginHorizontal: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fffbea",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        marginBottom: 3,
    },
    boxFilled: {
        borderColor: "#4caf50",
        backgroundColor: "#d4f8d4",
    },
    boxText: { fontSize: 24, fontWeight: "900", color: "#333" },
    poolRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 12,
        minHeight: 120,
        paddingHorizontal: 8,
    },
    letter: {
        width: 56,
        height: 56,
        margin: 6,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "#ffb347",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffe4b5",
        elevation: 3,
    },
    letterUsed: {
        opacity: 0.28,
    },
    letterText: { fontSize: 20, fontWeight: "900", color: "#ff7043" },
    suggestedLetter: {
        borderColor: "#3b82f6",
        backgroundColor: "#dbeafe",
        transform: [{ scale: 1.05 }],
    },
    dimmedLetter: {
        opacity: 0.45,
    },
    controlBtn: {
        backgroundColor: "#FFD93D",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        alignItems: "center",
    },
    controlText: { fontWeight: "800", color: "#000", fontSize: 15 },
    pointer: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        zIndex: 999,
    },
});
