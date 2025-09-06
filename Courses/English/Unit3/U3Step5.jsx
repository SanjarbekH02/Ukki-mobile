import { Image, StyleSheet, View } from 'react-native';

const pictures = [
    require('../../../assets/images/unit-3/unit-2-step-5-1.jpg'),
    require('../../../assets/images/unit-3/unit-2-step-5-2.jpg'),
];

export default function U3Step5({ next }) {

    return (
        <View style={styles.container}>
            {pictures.map((picture, index) => (
                <Image 
                    key={index} 
                    source={picture} 
                    style={styles.image} 
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    image: {
        height: '45%',
        width: '80%',
        resizeMode: 'stretch',
        borderWidth: 1,
        borderColor: '#ddd',
        marginVertical: 5,
    },
});