import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles from '../../../Styles/Styles';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

export default function U2Step19({ next }) {
    const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false)
    const [dictionary, setDictionary] = useState(false)
    return (
        <View style={Styles.stepContainer}>
            <ThreeButtons
                setDictionary={setDictionary}
                infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick}
                audioUrl="https://ukkibackend.soof.uz/media/audio/3543cc8b-4839-4c07-93d8-a371e90dbaa9.mp3" />
            <View style={styles.imgBlock}>
                <Image style={styles.image} source={require('../../../assets/images/cd36.jpg')} />
            </View>
            <TouchableOpacity onPress={next} style={Styles.NextButton}>
                <Text>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    imgBlock: { width: '100%', height: '40%' },
    image: {
        width: '100%', height: '100%', resizeMode: 'stretch'
    }
})