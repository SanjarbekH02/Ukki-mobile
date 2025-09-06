import { Image, StyleSheet, View } from "react-native";

const pictures = [
    require("../../../assets/images/unit-3/unit-2-step-4-1.jpg"),
    require("../../../assets/images/unit-3/unit-2-step-4-2.jpg"),
    require("../../../assets/images/unit-3/unit-2-step-4-3.jpg"),
];

export default function U3Step4({ next }) {

    return (
        <View style={styles.container}>
            {pictures.map((picture, index) => (
                <Image key={index} source={picture} style={styles.image} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        height: '100%',
        resizeMode: 'contain',
    },
});