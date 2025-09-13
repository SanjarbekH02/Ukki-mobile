import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComponentTop({ text = "", transparent }) {
    const navigation = useNavigation()
    return (
        < View style={[styles.top, transparent ? styles.transparent : '']}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.toBack} >
                <Image source={require('../../assets/images/left.png')} />
            </TouchableOpacity>
            <Text style={styles.title}>
                {text.split(" ").length > 3
                    ? text.split(" ").slice(0, 3).join(" ") + "..."
                    : text}
            </Text>
        </View>
    )
}

ComponentTop.displayName = 'ComponentTop';

const styles = StyleSheet.create({
    top: {
        // flex: 1,
        position: "relative",
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    toBack: {

        padding: 8,
        paddingLeft: 15,
        paddingRight: 20,
        backgroundColor: "#EFF4F8",
        position: "absolute",
        bottom: 23,
        left: 10,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        alignSelf: 'center',
        // marginBottom: 30,
    },
    transparent: {
        backgroundColor: "transparent"
    }
})