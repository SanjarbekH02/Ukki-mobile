import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const imagesLeft = [
    { src: require("../../../assets/images/cd341.jpg"), label: "Button 1", style: { top: '3%', left: 0 } },
    { src: require("../../../assets/images/cd342.jpg"), label: "Button 2", style: { top: '13%', left: '23%', zIndex: 2 } },
    { src: require("../../../assets/images/cd343.jpg"), label: "Button 3", style: { top: '26%', left: 0 } },
    { src: require("../../../assets/images/cd344.jpg"), label: "Button 4", style: { top: '38%', left: '23%' } },
    { src: require("../../../assets/images/cd345.jpg"), label: "Button 5", style: { top: '50%', left: 0 } },
    { src: require("../../../assets/images/cd346.jpg"), label: "Button 6", style: { bottom: '17%', left: '23%' } },
];

const imagesRight = [
    { src: require("../../../assets/images/cd347.jpg"), label: "Button 7", style: { top: '3%', right: '23%' } },
    { src: require("../../../assets/images/cd348.jpg"), label: "Button 8", style: { top: '13%', right: 0 } },
    { src: require("../../../assets/images/cd349.jpg"), label: "Button 9", style: { top: '26%', right: '23%' } },
    { src: require("../../../assets/images/cd3410.jpg"), label: "Button 10", style: { top: '38%', right: 0 } },
    { src: require("../../../assets/images/cd3411.jpg"), label: "Button 11", style: { top: '50%', right: '23%' } },
    { src: require("../../../assets/images/cd3412.jpg"), label: "Button 12", style: { bottom: '17%', right: 0 } },
];

const { width } = Dimensions.get("window");
const buttonWidth = width / 2.5;

const U2Step16 = () => {
    return (
        <View style={styles.container}>
            {imagesLeft.map((item, idx) => (
                <TouchableOpacity key={idx} style={[styles.button, item.style]}>
                    <Image source={item.src} style={styles.image} />
                </TouchableOpacity>
            ))}
            <View style={styles.centerLine}></View>
            {imagesRight.map((item, idx) => (
                <TouchableOpacity key={idx} style={[styles.button, item.style]}>
                    <Image source={item.src} style={styles.image} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
        backgroundColor: "#f9f9f9",
    },
    button: {
        position: "absolute",
        alignItems: "center",
        width: "25%",
        height: 150,
    },
    image: {
        width: '100%',
        height: '100%',
        marginBottom: 5,
        resizeMode: "contain",
    },
    text: {
        fontSize: 14,
        textAlign: "center",
    },
    centerLine: {
        width: 2,
        height: '100%',
        backgroundColor: "#b4b4b4ff",
        position: 'absolute',
        top: 0,
        left: '50%'
    }
});

export default U2Step16;
