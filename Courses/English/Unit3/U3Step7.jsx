import { Image, StyleSheet, View } from 'react-native';

export default function U3Step7({ next }) {

    return (
        <View style={styles.container}>
            <Image 
                source={require('../../../assets/images/unit-3/unit-3-step-7.png')} 
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