import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles from '../../../Styles/Styles';
import ErrorOverlay from '../../../components/Utils/OnError';
import ConfettiEffect from '../../../components/Utils/Success';
import ThreeButtons from '../../../components/Utils/ThreeButtons';

export default function Step20({next}) {
    const [selected, setSelected] = useState(null);
    const [result, setResult] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [nextBtn, setNextBtn] = useState(false)

    const correct = 'chumchuq'

    const handlePress = (option) => {
        if (option === correct) {
            setSelected(option)
            setResult("✅ To‘g‘ri!");
            setNextBtn(true)
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false)
            }, 2000)
        } else {
            setSelected(null)
            setResult("❌ Notog‘ri!")
            setIsError(true);
            setTimeout(() => {
                setIsError(false);
            }, 1000)
        }
    }

    return (
        <>
            <View style={Styles.stepContainer}>
                <ThreeButtons />

                <View style={styles.imageBlock}>
                    <Image style={styles.Image} source={require('../../../assets/images/uya.jpg')} />

                    {/* faqat to‘g‘ri bo‘lsa ko‘rsatiladi */}
                    {selected === correct && (
                        <Image
                            source={require('../../../assets/images/chumchuq.png')}
                            style={[styles.imgOption, styles.in]}
                        />
                    )}
                    <View style={styles.in} pointerEvents="none" />
                </View>

                <View style={styles.options}>
                    <TouchableOpacity style={styles.imgBtn} onPress={() => handlePress('baliq')}>
                        <Image style={styles.imgOption} source={require('../../../assets/images/baliq.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.imgBtn} onPress={() => handlePress('mushuk')}>
                        <Image style={styles.imgOption} source={require('../../../assets/images/mushuk.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.imgBtn} onPress={() => handlePress('chumchuq')}>
                        <Image style={styles.imgOption} source={require('../../../assets/images/chumchuq.png')} />
                    </TouchableOpacity>
                </View>

                {result !== "" && (
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>
                        {result}
                    </Text>
                )}
                {nextBtn && (
                    <TouchableOpacity onPress={next} style={Styles.NextButton}>
                        <Text style={{ fontWeight: '700', }}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
            {isSuccess && <ConfettiEffect />}
            {isError && <ErrorOverlay />}
        </>
    )
}

const styles = StyleSheet.create({
    imageBlock: { width: '100%', height: '40%', marginBottom: 40, position: 'relative' },
    Image: { width: '100%', height: "100%", resizeMode: 'stretch' },
    in: {
        width: 80,
        height: 80,
        position: 'absolute',
        bottom: '13%',
        left: '30%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    options: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20
    },
    imgBtn: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 12
    },
    imgOption: {
        width: 100,
        height: 100,
        resizeMode: 'stretch'
    }
})
