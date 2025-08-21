import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Polygon, Svg } from "react-native-svg";
import ThreeButtons from "../../../components/Utils/ThreeButtons";

const SHAPES = [
    { id: 1, audio: "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_14_1.mp3", correctColor: "green" },
    { id: 2, audio: "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_14_2.mp3", correctColor: "yellow" },
    { id: 3, audio: "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_14_3.mp3", correctColor: "pink" },
    { id: 4, audio: "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_14_4.mp3", correctColor: "purple" },
    { id: 5, audio: "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_14_5.mp3", correctColor: "orange" },
    { id: 6, audio: "https://ukkibackend.soof.uz/media/audio/Work_book_CD1_14_6.mp3", correctColor: "blue" },
];

const COLORS = ["green", "blue", "yellow", "orange", "purple", "pink"];

function useOctagonPoints(size = 110, inset = 18) {
    return useMemo(() => {
        const w = size, h = size;
        const left = inset, right = w - inset, top = inset, bottom = h - inset;
        const cx = w / 2, cy = h / 2;
        const pts = [
            [cx, top],
            [right, top],
            [w - inset / 2, cy],
            [right, bottom],
            [cx, h - inset / 2],
            [left, bottom],
            [inset / 2, cy],
            [left, top],
        ];
        return pts.map(([x, y]) => `${x},${y}`).join(" ");
    }, [size, inset]);
}

export default function ShapeColorGame({next}) {
    const points = useOctagonPoints(120, 22);
    const [sound, setSound] = useState(null);
    const [activeId, setActiveId] = useState(null);
    const [fills, setFills] = useState({});
    const [messages, setMessages] = useState({});
    const [showColors, setShowColors] = useState(false);

    async function audioPlay(url, id) {
        setMessages((m) => ({ ...m, [id]: "" }));
        setActiveId(id);

        if (sound) {
            try { await sound.stopAsync(); } catch { }
            try { await sound.unloadAsync(); } catch { }
        }

        const { sound: s } = await Audio.Sound.createAsync({ uri: url });
        setSound(s);

        await s.playAsync();
        s.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                setMessages((m) => ({ ...m, [id]: "Rangni tanlang!" }));
                setShowColors(true);
            }
        });
    }

    function checkAnswer(id, color) {
        const item = SHAPES.find((x) => x.id === id);
        if (item.correctColor === color) {
            setFills((f) => ({ ...f, [id]: color }));
            setMessages((m) => ({ ...m, [id]: "✅ To‘g‘ri!" }));
            setActiveId(null);
            setShowColors(false);
        } else {
            setMessages((m) => ({ ...m, [id]: "❌ Noto‘g‘ri, qaytadan urinib ko‘ring!" }));
        }
    }

    const isAllCorrect = Object.keys(fills).length === SHAPES.length;

    return (
        <View style={{ flex: 1, padding: 12, justifyContent: "center" }}>
            <ThreeButtons />

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                {SHAPES.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            width: "32%",
                            marginBottom: 18,
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity onPress={() => audioPlay(item.audio, item.id)} style={{ marginBottom: 6 }}>
                            <Ionicons name="volume-high" size={32} color="black" />
                        </TouchableOpacity>

                        <Svg width={120} height={120}>
                            <Polygon
                                points={points}
                                stroke="black"
                                strokeWidth={2}
                                fill={fills[item.id] || "white"}
                            />
                        </Svg>

                        {messages[item.id] ? (
                            <Text style={{ marginTop: 6, fontWeight: "600", textAlign: "center" }}>
                                {messages[item.id]}
                            </Text>
                        ) : null}
                    </View>
                ))}
            </View>

            {showColors && activeId && messages[activeId] === "Rangni tanlang!" && (
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    backgroundColor: "white",
                    padding: 10,
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0
                }}>
                    {COLORS.map((c) => (
                        <TouchableOpacity
                            key={c}
                            onPress={() => checkAnswer(activeId, c)}
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: 6,
                                backgroundColor: c,
                                margin: 4,
                            }}
                        />
                    ))}
                </View>
            )}

            {isAllCorrect && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        bottom: 80,
                        alignSelf: "center",
                        backgroundColor: "green",
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 8,
                    }}
                    onPress={next}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>NEXT</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
