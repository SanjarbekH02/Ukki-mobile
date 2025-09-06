import { Image, StyleSheet, View } from 'react-native';

export default function U3Step10({ next }) {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../../assets/images/unit-3/unit-2-step-10.jpg')} 
                style={styles.image} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});