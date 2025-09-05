import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorOverlay from "./Utils/OnError";
import ConfettiEffect from "./Utils/Success";

const NameGame = ({ names = ["Leo", "Tina", "Olivia", "David"], selectName, onAllCorrect,
    setSelectName
 }) => {
    const [hiddenNames, setHiddenNames] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [wrongCount, setWrongCount] = useState(0);
     const [warning, setWarning] = useState("");

    useEffect(() => {
        if (hiddenNames.length === names.length) {
            onAllCorrect(true);
        }
    }, [hiddenNames]);

    const handlePress = (name) => {
        if (!selectName) {
            setWarning("⚠️ Oldin raqamlardan birini tanlang tanlang!");
            setTimeout(() => setWarning(""), 4000);
            return;
        }
        if (name === selectName) {
            setIsSuccess(true);
            setSelectName(null);
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
            setHiddenNames((prev) => [...prev, name]);
        } else {
            setIsError(true);
            setWrongCount((prev) => prev + 1);
            setTimeout(() => {
                setIsError(false);
            }, 3000);
        }
    };

    return (
        <>
            <View style={styles.container}>
                {names.map((name, index) =>
                    hiddenNames.includes(name) ? null : (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            onPress={() => handlePress(name)}
                        >
                            <Text style={styles.btnText}>{name}</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
            {warning && <Text  style={styles.warning} >{warning}</Text>}
        </>
    );
};

export default NameGame;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginTop: 20,
        position: "absolute",
        bottom: 20,
        left: '3%',
    },
    button: {
        backgroundColor: "#4a90e2",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        width: 150,
        alignItems: "center",
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "600",
    },
    warning: {
        color: '#db1818ff',
        fontSize: 20,
        position: "absolute",
        top: 160,
        left: '10%',
    }
});
