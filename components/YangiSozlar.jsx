import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const FlashCards = ({ data, onFinish, setDictionary }) => {
    const [index, setIndex] = useState(0);
    const [finished, setFinished] = useState(false);
    const translateX = useRef(new Animated.Value(width)).current;
    const rotateY = useRef(new Animated.Value(0)).current;
    const soundRef = useRef(null);

    const currentItem = data[index];

    // Karta kirishi
    useEffect(() => {
        if (!finished) {
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [index, finished]);

    // Audio o‘ynash
    const playAudio = async (url) => {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    nextCard();
                }
            });
        } catch (err) {
            console.log("Audio error:", err);
        }
    };

    // Flip + audio
    const flipCard = () => {
        Animated.timing(rotateY, {
            toValue: 180,
            duration: 500,
            useNativeDriver: true,
        }).start();
        playAudio(currentItem.audioUrl);
    };

    // Keyingi kartaga o'tish
    const nextCard = () => {
        Animated.timing(translateX, {
            toValue: -width,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            rotateY.setValue(0);

            if (index + 1 >= data.length) {
                setFinished(true);
            } else {
                setIndex((prev) => prev + 1);
                translateX.setValue(width);
            }
        });
    };

    // Restart qilish
    const restart = () => {
        setIndex(0);
        setFinished(false);
        rotateY.setValue(0);
        translateX.setValue(width);
    };

    // Rotate interpolations
    const frontInterpolate = rotateY.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });
    const backInterpolate = rotateY.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    });

    if (finished) {
        return (
            <View style={styles.container}>
                <Text style={styles.doneText}>🎉 Barcha so‘zlarni tugatdingiz!</Text>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: "#4CAF50" }]} onPress={restart}>
                        <Text style={styles.buttonText}>Qaytadan ko‘rish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#f44336" }]}
                        onPress={() => setDictionary(false)}
                    >
                        <Text style={styles.buttonText}>Tugatish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* FRONT SIDE */}
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors[index % colors.length],
                        transform: [{ translateX }, { rotateY: frontInterpolate }],
                    },
                ]}
            >
                <TouchableOpacity style={styles.inner} onPress={flipCard}>
                    <Text style={styles.frontText}>Tap to Flip</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* BACK SIDE */}
            <Animated.View
                style={[
                    styles.card,
                    styles.cardBack,
                    {
                        backgroundColor: colors[index % colors.length],
                        transform: [{ translateX }, { rotateY: backInterpolate }],
                    },
                ]}
            >
                <TouchableOpacity style={styles.inner} onPress={flipCard}>
                    <Text style={styles.text}>
                        {currentItem.word} - {currentItem.translation}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const colors = ["#FFB6C1", "#87CEFA", "#90EE90", "#FFD700", "#FFA07A"];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: 280,
        height: 180,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backfaceVisibility: "hidden",
        position: "absolute",
    },
    cardBack: {
        transform: [{ rotateY: "180deg" }],
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
    frontText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    doneText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default FlashCards;
