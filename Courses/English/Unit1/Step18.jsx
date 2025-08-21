import { useMemo, useRef, useState } from "react";
import {
    FlatList,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

// Palitra ranglari
const COLORS = ["#111827", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#FFFFFF"];

export default function Step18({next}) {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [paths, setPaths] = useState([]);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const drawing = useRef(false);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    drawing.current = true;
                    const { locationX, locationY } = evt.nativeEvent;
                    const newPath = {
                        color: selectedColor,
                        width: strokeWidth,
                        points: [{ x: locationX, y: locationY }],
                    };
                    setPaths((prev) => [...prev, newPath]);
                },
                onPanResponderMove: (evt) => {
                    if (!drawing.current) return;
                    const { locationX, locationY } = evt.nativeEvent;
                    setPaths((prev) => {
                        if (prev.length === 0) return prev;
                        const copy = [...prev];
                        const last = { ...copy[copy.length - 1] };
                        // so‘nggi pathga yangi nuqtani qo‘shamiz
                        last.points = [...last.points, { x: locationX, y: locationY }];
                        copy[copy.length - 1] = last;
                        return copy;
                    });
                },
                onPanResponderRelease: () => {
                    drawing.current = false;
                },
                onPanResponderTerminate: () => {
                    drawing.current = false;
                },
            }),
        [selectedColor, strokeWidth]
    );

    // points -> SVG path string
    const toSvgPath = (pts) => {
        if (!pts || pts.length === 0) return "";
        const [{ x, y }, ...rest] = pts;
        return `M ${x} ${y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
    };

    const onUndo = () => setPaths((prev) => prev.slice(0, -1));
    const onClear = () => setPaths([]);

    return (
        <View style={styles.container}>
            {/* Rasmlar (20%) */}
            <View style={styles.imgBlock}>
                <Image style={styles.image} source={require("../../../assets/images/tort.jpg")} />
                <Image style={styles.image} source={require("../../../assets/images/tort2.jpg")} />
            </View>

            {/* Toolbar (10%) */}
            <View style={styles.toolbar}>
                <FlatList
                    horizontal
                    data={COLORS}
                    keyExtractor={(c, i) => c + i}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                    renderItem={({ item: color }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedColor(color)}
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: color, borderColor: color === "#FFFFFF" ? "#e5e7eb" : "transparent" },
                                selectedColor === color && styles.swatchSelected,
                            ]}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Brush size */}
                <View style={styles.sizeRow}>
                    {[3, 5, 8, 12].map((w) => (
                        <TouchableOpacity
                            key={w}
                            onPress={() => setStrokeWidth(w)}
                            style={[styles.sizeBtn, strokeWidth === w && styles.sizeBtnActive]}
                        >
                            <View style={{ width: w, height: w, borderRadius: w, backgroundColor: "#111827" }} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={onUndo} style={styles.actionBtn}>
                        <Text style={styles.actionText}>Undo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClear} style={[styles.actionBtn, styles.clearBtn]}>
                        <Text style={[styles.actionText, { color: "white" }]}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={next} style={styles.nextBtn}>
                        <Text style={styles.actionText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Canvas (70%) */}
            <View
                style={styles.canvasWrapper}
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setCanvasSize({ width, height });
                }}
                {...panResponder.panHandlers}
            >
                <Svg width={canvasSize.width} height={canvasSize.height}>
                    <Rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
                    {paths.map((p, idx) => (
                        <Path
                            key={idx}
                            d={toSvgPath(p.points)}
                            stroke={p.color}
                            strokeWidth={p.width}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </Svg>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },

    imgBlock: {
        flex: 0.2, // 20%
        flexDirection: "row",
    },
    image: {
        width: '50%',
        height: '100%',
        resizeMode: "stretch",
    },

    toolbar: {
        paddingTop: 12,
        paddingBottom: 8,
        gap: 10,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    colorSwatch: {
        width: 28,
        height: 28,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
    },
    swatchSelected: {
        transform: [{ scale: 1.05 }],
    },
    sizeRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        gap: 12,
    },
    sizeBtn: {
        width: 38,
        height: 32,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
    },
    sizeBtnActive: {
        borderColor: "#111827",
        backgroundColor: "#EEF2FF",
    },
    actions: {
        flexDirection: "row",
        paddingHorizontal: 12,
        gap: 10,
        alignItems: "center",
    },
    actionBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        backgroundColor: "#FFFFFF",
    },
    clearBtn: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
    actionText: { fontWeight: "600", color: "#111827" },

    canvasWrapper: {
        flex: 0.7, // 70%
    },
    nextBtn: {padding: 8, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#fffb00ff', marginLeft: 'auto'}
});
