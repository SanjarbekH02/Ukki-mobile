import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "../../../components/Utils/OnError";
import ConfettiEffect from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import Styles from "../../../Styles/Styles";

const rows = [
    {
        data: [
            require("../../../assets/images/ruchka13.jpg"),
            require("../../../assets/images/kitob13.jpg"),
            require("../../../assets/images/ruchka13.jpg"),
            require("../../../assets/images/kitob13.jpg"),
        ],
        answer: require("../../../assets/images/ruchka13.jpg"),
    },
    {
        data: [
            require("../../../assets/images/ochirgich13.jpg"),
            require("../../../assets/images/ochirgich13.jpg"),
            require("../../../assets/images/qalam13.jpg"),
            require("../../../assets/images/ochirgich13.jpg"),
        ],
        answer: require("../../../assets/images/ochirgich13.jpg"),
    },
    {
        data: [
            require("../../../assets/images/stol13.jpg"),
            require("../../../assets/images/stol13.jpg"),
            require("../../../assets/images/stul13.jpg"),
            require("../../../assets/images/stol13.jpg"),
        ],
        answer: require("../../../assets/images/stol13.jpg"),
    },
    {
        data: [
            require("../../../assets/images/ochirgich13.jpg"),
            require("../../../assets/images/kitob13.jpg"),
            require("../../../assets/images/selectkashalok.jpg"),
            require("../../../assets/images/ochirgich13.jpg"),
        ],
        answer: require("../../../assets/images/kitob13.jpg"),
    },

    // boshqa qatorlar ham shu kabi
];

// Variantlar ham rasmlar bilan
const options = [
    require("../../../assets/images/stol13.jpg"),
    require("../../../assets/images/kitob13.jpg"),
    require("../../../assets/images/ruchka13.jpg"),
    require("../../../assets/images/ochirgich13.jpg"),
    //   require("../../../assets/images/apple.jpg"),
];

export default function U2Step9({ next }) {
    const [selected, setSelected] = useState({});
    const [isSuccess, setIsSeuccess] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleSelect = (rowIndex, option) => {
        if (rows[rowIndex].answer === option) {
            setSelected({ ...selected, [rowIndex]: option });
            setIsSeuccess(true);
            setTimeout(() => setIsSeuccess(false), 2000);
        } else {
            setIsError(true);
            setTimeout(() => setIsError(false), 2000);
        }
    };

    const borderColors = ["red", "blue", "green", "orange", "purple"];
    const allCorrect = rows.every((row, idx) => selected[idx] === row.answer);
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);

    return (
        <>
            <View contentContainerStyle={styles.container}>
                <ThreeButtons
                    audioUrl="https://ukkibackend.soof.uz/media/audio/Dono bolajon, berilgan RASMLAR ketma-ketligini to’g’ri belgila..mp3"
                    setDictionary={setDictionary}
                    infoClick={infoClick}
                    clicked={clicked}
                    setClicked={setClicked}
                    setInfoClick={setInfoClick} />

                {/* Yonma-yon ustunlar */}
                <View style={styles.rowsContainer}>
                    {rows.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.column}>
                            {row.data.map((img, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.box,
                                        { borderColor: borderColors[rowIndex] },
                                    ]}
                                >
                                    <Image source={img} style={styles.img} />
                                </View>
                            ))}

                            <View
                                style={[
                                    styles.box,
                                    { backgroundColor: "#eee", borderColor: borderColors[rowIndex] },
                                ]}
                            >
                                {selected[rowIndex] ? (
                                    <Image source={selected[rowIndex]} style={styles.img} />
                                ) : (
                                    <Text style={styles.num}>?</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

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
                            <Image source={opt} style={styles.img} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Image
                    style={styles.line}
                    source={require("../../../assets/images/arrow.png")}
                />

                {allCorrect && (
                    <TouchableOpacity
                        style={[Styles.NextButton, styles.nextBtn]}
                        onPress={next}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: "center", justifyContent: "center" },
    rowsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 100,
        marginBottom: 50,
        position: "relative",
    },
    column: {
        flexDirection: "column",
        alignItems: "center",
        marginHorizontal: 10,
    },
    box: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 3,
    },
    img: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    num: { fontSize: 18, fontWeight: "bold" },
    options: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    option: {
        width: 60,
        height: 60,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#000",
    },
    line: {
        width: 40,
        height: 240,
        resizeMode: "stretch",
        transform: [{ scaleX: -1 }, { rotate: "90deg" }],
        position: "absolute",
        bottom: "-5%",
        left: "30%",
    },
    nextBtn: { bottom: "-18%" },
});
