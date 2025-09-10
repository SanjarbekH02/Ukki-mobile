// Success component - simple version without confetti
import { View, Text, StyleSheet } from "react-native";

export default function Success() {
    return (
        <View style={styles.container}>
            <Text style={styles.successText}>✓ Correct!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        zIndex: 1000,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
    },
});
