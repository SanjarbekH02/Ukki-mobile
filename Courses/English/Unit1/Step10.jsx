import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const rows = [
    { data: [2, 4, 6, 2, 4, 6, 2, 4], answer: 6 },
    { data: [8, 9, 10, 8, 9, 10, 8, 9], answer: 10 },
    { data: [3, 5, 7, 3, 5, 7, 3, 5], answer: 7 },
    { data: [6, 5, 4, 6, 5, 4, 6, 5], answer: 4 },
    { data: [1, 8, 3, 1, 8, 3, 1, 8], answer: 3 },
];

const options = [10, 6, 4, 3, 7];

export default function App({next}) {
    const [selected, setSelected] = useState({});
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSeuccess] = useState(false);
    const [isError, setIsError] = useState(false)

    const handleSelect = (rowIndex, option) => {
        if (rows[rowIndex].answer === option) {
            setSelected({ ...selected, [rowIndex]: option });
            setIsSeuccess(true);
            setTimeout(() => {
                setIsSeuccess(false)
            }, 2000)
        } else {
            setIsError(true);
            setTimeout(() => {
                setIsError(false)
            }, 2000)
        }
    };

    const borderColors = ["red", "blue", "green", "orange", "purple"];

const allCorrect = rows.every((row, idx) => selected[idx] === row.answer);
    return (
        <>
            <View contentContainerStyle={styles.container}>
                <ThreeButtons />
                {/* Yonma-yon 5 ta ustun */}
                <View style={styles.rowsContainer}>
                    {rows.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.column}>
                            {row.data.map((num, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.box,
                                        { borderColor: borderColors[rowIndex] }
                                    ]}
                                >
                                    <Text style={styles.num}>{num}</Text>
                                </View>
                            ))}

                            <View
                                style={[
                                    styles.box,
                                    { backgroundColor: "#eee", borderColor: borderColors[rowIndex] }
                                ]}
                            >
                                <Text style={styles.num}>
                                    {selected[rowIndex] ? selected[rowIndex] : "?"}
                                </Text>
                            </View>
                        </View>
                    ))}

                </View>

                {/* Variantlar */}
                <View style={styles.options}>
                    {options.map((opt, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.option}
                            onPress={() => {
                                const emptyRow = rows.findIndex((_, idx) => !selected[idx]);
                                if (emptyRow !== -1) handleSelect(emptyRow, opt);
                            }}
                        >
                            <Text style={styles.num}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Image style={styles.line} source={require('../../../assets/images/arrow.png')} />
                {allCorrect && (
                    <TouchableOpacity
                        style={[Styles.NextButton, styles.nextBtn]}
                        onPress={next}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
            {isSuccess && <ConfettiEffect />};
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: "center", justifyContent: 'center' },
    rowsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 100,
        marginBottom: 50,
        position: 'relative'
    },
    column: {
        flexDirection: "column",
        alignItems: "center",
        marginHorizontal: 10,
    },
    box: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 3,
    },
    num: { fontSize: 18, fontWeight: "bold" },
    options: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    option: {
        width: 50,
        height: 50,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000'
    },
    line: { width: 47, height: 80, resizeMode: "stretch", transform: [{ scaleX: -1 }, { rotate: "90deg" }], position: 'absolute', bottom: '7%', left: '22%' },
    nextBtn: {bottom: "-18%"}
});
