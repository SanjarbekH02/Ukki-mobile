// import { Audio } from "expo-av";
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
import ErrorOverlay from "../components/OnError";
import Success from '../components/Success';

/**
 * WordGameAssist
 * - words: array of words
 * - requires optional assets in ./assets:
 *    - sounds: click.mp3, success.mp3, error.mp3 (optional)
 *    - hand.png (pointer image)
 *
 * Behavior:
 * - normal play: pick letters to fill boxes
 * - after 3 wrong attempts on the same word => assistMode true
 * - assist mode: pointer shows which pool letter to press (in order).
 *   Only that letter press is accepted; each correct press moves pointer to next letter.
 */

export default function WordGameAssist({ words = ["hello", "bye", "green", "yellow"] }) {
    const [index, setIndex] = useState(0);
    const [target, setTarget] = useState(words[0].toLowerCase());
    const [boxes, setBoxes] = useState([]);
    const [pool, setPool] = useState([]); // {id, letter, used}
    const [message, setMessage] = useState("");
    const [disablePool, setDisablePool] = useState(false);
    const pointerScale = useRef(new Animated.Value(1)).current;


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pointerScale, {
                    toValue: 1.2, // kattalashish
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(pointerScale, {
                    toValue: 1, // qayta kichrayish
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // attempts counter for current word
    const [attempts, setAttempts] = useState(0);

    // assist mode state
    const [assistMode, setAssistMode] = useState(false);
    const [assistIndex, setAssistIndex] = useState(0); // which letter of target we are guiding to

    // pointer animation & layout refs
    const pointerAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const pointerOpacity = useRef(new Animated.Value(0)).current;
    const poolContainerLayout = useRef({ x: 0, y: 0 });
    const poolItemLayouts = useRef({}); // { [id]: { x, y, width, height } }

    // sounds
    const clickSound = useRef(null);
    const successSound = useRef(null);
    const errorSound = useRef(null);

    useEffect(() => {
        initForWord(words[index]);
        setAttempts(0);
        // cleanup sounds on unmount
        return () => {
            //   unloadSounds();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    //   useEffect(() => {
    //     // preload sounds once
    //     loadSounds();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //   }, []);

    //   async function loadSounds() {
    //     try {
    //       clickSound.current = await Audio.Sound.createAsync(require("./assets/sounds/click.mp3"));
    //     } catch (e) {
    //       clickSound.current = null;
    //     }
    //     try {
    //       successSound.current = await Audio.Sound.createAsync(require("./assets/sounds/success.mp3"));
    //     } catch (e) {
    //       successSound.current = null;
    //     }
    //     try {
    //       errorSound.current = await Audio.Sound.createAsync(require("./assets/sounds/error.mp3"));
    //     } catch (e) {
    //       errorSound.current = null;
    //     }
    //   }

    async function unloadSounds() {
        try {
            if (clickSound.current && clickSound.current.sound) await clickSound.current.sound.unloadAsync();
            if (successSound.current && successSound.current.sound) await successSound.current.sound.unloadAsync();
            if (errorSound.current && errorSound.current.sound) await errorSound.current.sound.unloadAsync();
        } catch (e) {
            // ignore
        }
    }

    async function playClick() {
        try {
            if (clickSound.current && clickSound.current.sound) {
                await clickSound.current.sound.replayAsync();
            }
        } catch (e) { }
    }
    async function playSuccess() {
        try {
            if (successSound.current && successSound.current.sound) {
                await successSound.current.sound.replayAsync();
            }
        } catch (e) { }
    }
    async function playError() {
        try {
            if (errorSound.current && errorSound.current.sound) {
                await errorSound.current.sound.replayAsync();
            }
        } catch (e) { }
    }

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
        // Android layout animation enable
        if (Platform.OS === "android" && LayoutAnimation && LayoutAnimation.configureNext) {
            // no-op but ensures LayoutAnimation works on Android in dev
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

    // when a pool letter is pressed
    async function onPick(poolId) {
        // If in assistMode: only allow pressing the suggested pool item (the one pointer is on)
        if (assistMode) {
            const suggested = getSuggestedPoolItemForAssist(assistIndex);
            if (!suggested || suggested.id !== poolId) {
                // ignore other presses while assisting
                return;
            }
            // allow pressing the suggested one — proceed
        }

        // normal flow: play click sound
        await playClick();

        const poolIdx = pool.findIndex((p) => p.id === poolId);
        if (poolIdx === -1) return;
        if (pool[poolIdx].used) return;

        const emptyBoxIdx = boxes.findIndex((b) => b === null);
        if (emptyBoxIdx === -1) return;

        // place letter
        const newBoxes = boxes.slice();
        newBoxes[emptyBoxIdx] = { ...pool[poolIdx] };
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBoxes(newBoxes);

        const newPool = pool.slice();
        newPool[poolIdx] = { ...newPool[poolIdx], used: true };
        setPool(newPool);

        // If we were in assist mode, advance assistIndex to next letter
        if (assistMode) {
            setAssistIndex((prev) => prev + 1);
            // If assistIndex reaches target length, we've completed the word — handle completion below
        }

        if (newBoxes.every((b) => b !== null)) {
            setDisablePool(true);
            setTimeout(() => checkAnswer(newBoxes), 300);
        }
    }

    // undo from boxes
    function onRemoveFromBox(boxIdx) {
        if (assistMode) return; // don't allow removing while assisting (optional)
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
            playSuccess();
            setMessage("Tog'ri!");
            setAttempts(0);
            setAssistMode(false);
            setAssistIndex(0);
            setTimeout(() => {
                const next = (index + 1) % words.length;
                setIndex(next);
            }, 900);
        } else {
            playError();
            Vibration.vibrate(300);
            setMessage("Noto'g'ri — qaytadan yozing");
            // increase attempts
            setAttempts((prev) => {
                const nextAttempt = prev + 1;
                // if attempts reach 3 => enable assistMode
                if (nextAttempt >= 3) {
                    // start assist mode after small delay so user sees message
                    setTimeout(() => startAssist(), 600);
                }
                return nextAttempt;
            });

            // reset boxes and pool usage
            setTimeout(() => {
                setPool((prev) => prev.map((p) => ({ ...p, used: false })));
                setBoxes(Array.from({ length: target.length }).map(() => null));
                setDisablePool(false);
                setTimeout(() => setMessage(""), 1200);
            }, 700);
        }
    }

    /* ========== ASSIST MODE LOGIC ========== */

    // start assist: show pointer at first target letter's matching pool item
    function startAssist() {
        setAssistMode(true);
        setAssistIndex(0);
        // show pointer and move to first suggested item (if measurable)
        setTimeout(() => {
            movePointerToSuggested(0);
        }, 120); // small delay
    }

    // returns pool item (object) that corresponds to target letter at position idx
    function getSuggestedPoolItemForAssist(idx) {
        // we need the pool item that matches target[idx] and is currently not used in boxes
        const ch = target[idx];
        // find the first pool item with that letter and not used AND not already used by previous suggestions in mapping
        // But since we always advance assistIndex only when user presses suggested, we can simply find first unused with that letter
        const poolItem = pool.find((p) => p.letter === ch && !p.used);
        return poolItem || null;
    }

    // animate pointer to the suggested pool item's layout (if measured)
    function movePointerToSuggested(idx) {
        const poolItem = getSuggestedPoolItemForAssist(idx);
        if (!poolItem) {
            // nothing to point to (maybe items not measured yet) -> try to fallback: flash the letters
            flashSuggestedLettersFallback(idx);
            return;
        }
        const layout = poolItemLayouts.current[poolItem.id];
        const container = poolContainerLayout.current;
        if (!layout || !container) {
            flashSuggestedLettersFallback(idx);
            return;
        }

        // compute absolute-ish coordinates within SafeAreaView:
        const targetX = container.x + layout.x + layout.width / 2 - 20; // adjust pointer half width
        const targetY = container.y + layout.y + 50; // above the letter

        // show pointer if hidden
        Animated.timing(pointerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        Animated.spring(pointerAnim, {
            toValue: { x: targetX, y: targetY },
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
        }).start();
    }

    // fallback: briefly flash suggested letter if layout not ready
    function flashSuggestedLettersFallback(idx) {
        const poolItem = getSuggestedPoolItemForAssist(idx);
        if (!poolItem) return;
        // briefly toggle used style to draw attention
        setPool((prev) => prev.map((p) => (p.id === poolItem.id ? { ...p, used: true } : p)));
        setTimeout(() => {
            setPool((prev) => prev.map((p) => (p.id === poolItem.id ? { ...p, used: false } : p)));
        }, 700);
        // ensure pointerOpacity visible a bit
        Animated.timing(pointerOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start(() => {
            setTimeout(() => {
                Animated.timing(pointerOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
            }, 700);
        });
    }

    // watch assistIndex changes to move pointer to next letter
    useEffect(() => {
        if (!assistMode) return;
        if (assistIndex >= target.length) {
           
            Animated.timing(pointerOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
            return;
        }
        // move pointer to next suggested pool item
        movePointerToSuggested(assistIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assistIndex, assistMode]);

    /* ========== LAYOUT HANDLERS ========== */
    function onPoolContainerLayout(e) {
        // store container layout relative to parent
        poolContainerLayout.current = e.nativeEvent.layout;
    }
    function onPoolItemLayout(id, e) {
        poolItemLayouts.current[id] = e.nativeEvent.layout;
    }

    /* ========== RENDER ========== */

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>🌈 So'z o'yini (Assist)</Text>
            <Text style={styles.hint}>So'zni tuzing ({target.length} harf)</Text>

            {/* Boxes */}
            <View style={styles.boxRow}>
                {boxes.map((b, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.box, b ? styles.boxFilled : null]}
                        onPress={() => onRemoveFromBox(i)}
                        activeOpacity={0.8}
                        disabled={assistMode} // disable removing while assisting
                    >
                        <Text style={styles.boxText}>{b ? b.letter.toUpperCase() : ""}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* message */}
            {message === "Tog'ri!" ? (
                <Success />
            ): message === "Noto'g'ri — qaytadan yozing" ? (
                <ErrorOverlay />
            ) : null}

            {/* Pool */}
            <View style={styles.poolRow} onLayout={onPoolContainerLayout}>
                {pool.map((p) => {
                    // If assistMode, highlight only suggested pool item
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

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                        setPool((prev) => prev.map((p) => ({ ...p, used: false })));
                        setBoxes(Array.from({ length: target.length }).map(() => null));
                        setMessage("");
                        setDisablePool(false);
                        setAttempts(0);
                        setAssistMode(false);
                        setAssistIndex(0);
                        Animated.timing(pointerOpacity, { toValue: 0, duration: 100, useNativeDriver: true }).start();
                    }}
                >
                    <Text style={styles.controlText}>🔄 Qayta boshlash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlBtn}
                    onPress={() => {
                        const next = (index + 1) % words.length;
                        setIndex(next);
                    }}
                >
                    <Text style={styles.controlText}>➡️ Keyingi</Text>
                </TouchableOpacity>
            </View>

            {/* Pointer (absolute) */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.pointer,
                    {
                        opacity: pointerOpacity,
                        transform: [
                            { translateX: pointerAnim.x },
                            { translateY: pointerAnim.y },
                            { scale: pointerScale } // endi pulsatsiya shu yerda
                        ],
                    },
                ]}
            >
                <Image
                    source={require("../assets/images/hand.png")}
                    style={{ width: 40, height: 40, resizeMode: "contain" }}
                />
            </Animated.View>

        </SafeAreaView>
    );
}

/* ========== STYLES ========== */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: "center", justifyContent: 'center', backgroundColor: "#fdf6ff" },
    title: { fontSize: 26, fontWeight: "800", marginBottom: 6, color: "#ff6f91" },
    hint: { fontSize: 15, marginBottom: 12, color: "#444" },

    boxRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 18,
    },
    box: {
        width: 64,
        height: 64,
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

    // assist styles
    suggestedLetter: {
        borderColor: "#3b82f6",
        backgroundColor: "#dbeafe",
        transform: [{ scale: 1.05 }],
    },
    dimmedLetter: {
        opacity: 0.45,
    },

    messageWrap: {
        marginTop: 8,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#fff3cd",
        borderWidth: 1,
        borderColor: "#ffeeba",
    },
    messageText: { fontSize: 18, fontWeight: "800", color: "#856404" },

    controls: {
        flexDirection: "row",
        marginTop: 18,
    },
    controlBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#ff6f91",
        marginHorizontal: 8,
        backgroundColor: "#ffcccb",
    },
    controlText: { fontWeight: "800", color: "#b71c1c", fontSize: 15 },

    pointer: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        zIndex: 999,
    },
});
