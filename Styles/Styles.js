import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        // alignItems: "stretch",
        position: "relative"
    },

    text: {
        flex: 1,
        backgroundColor: "red"
    },
    text1: {
        flex: 2,
        backgroundColor: "red"
    },

    ComponentTop: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },

    ImgFull: {
        width: "100%",
        resizeMode: "contain",
        resizeMode: "cover"
    },
    step2Img: {
        width: "100%",
        resizeMode: "contain",
        position: "absolute",
        top: 0,
        left: 0
    },
    NextButton: {
        backgroundColor: "#FFD93D",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        alignItems: "center",
        position: "absolute",
        bottom: 20,
        right: 20
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    title: {
        fontSize: 12,
        fontWeight: "600",
        color: '#077F94',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000
    },
    listenBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingRight: 10,
    },
    listenBtn2: {
        top: 60,
    },
    listenBtn3: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        position: 'absolute',
        bottom: 50,
        left: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingRight: 10,
    },
    listenNumber: {
        width: 30,
        height: 30,
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginRight: 10,
        backgroundColor: '#079436ff',
        textAlign: 'center',
        verticalAlign: 'middle',
        paddingTop: 2,
        borderRadius: 50,
        // iOS uchun
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        // Android uchun
        elevation: 5,
    },
    userNumber: {
        width:40,
        height:40,
        borderRadius: 50,
        backgroundColor: '#7272728e',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#fff',
    },
    userNumber1: {
        top: '40%',
        left: "5%",
    },
    userNumber2: {
        top: '40%',
        left: '30%',
    },
    userNumber4: {
        bottom: '35%',
        left: '48%',
    },
    userNumber3: {
        top: '41%',
        right: '10%',
    },
    userNumberText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    userNumberImage:{
        width: 90,
        height: 90,
    },

})