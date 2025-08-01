import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const Login = () => {
    const [phone, setPhone] = useState('+998');
    const [password, setPassword] = useState('');
    const [secureText, setSecureText] = useState(true);
    return (
        <View style={loginStyles.container}>
            <LinearGradient
                colors={['#e7eff8', '#e0f5f6']}
                style={loginStyles.loginImage}>
                <Image source={require('../assets/images/login.png')} style={loginStyles.loginImg} />
            </LinearGradient>
            <View style={loginStyles.loginContainer}>
                <View style={loginStyles.logoContainer}>
                    <View className='' style={loginStyles.logo}>
                        <Text className='color-red' style={loginStyles.logoText}>Logo</Text>
                    </View>
                </View>
                <Text style={loginStyles.title}>Tizimga kirish</Text>
                <TouchableOpacity style={loginStyles.button}>
                    <Image
                        source={require('../assets/images/google.png')}
                        style={loginStyles.buttonIcon}
                    />
                    <Text style={loginStyles.buttonText}>Google orqali davom ettirish</Text>
                </TouchableOpacity>

                <TouchableOpacity style={loginStyles.button}>
                    <Image
                        source={require('../assets/images/telegram.png')}
                        style={loginStyles.buttonIcon}
                    />
                    <Text style={loginStyles.buttonText}>Telegram orqali davom ettirish</Text>
                </TouchableOpacity>

                {/* Or Text */}
                <Text className="bg-night" style={loginStyles.orText}>Yoki telefon raqam orqali</Text>

                <Text style={loginStyles.label}>Telefon raqamingiz</Text>
                <TextInput
                    style={loginStyles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                {/* Parol */}
                <Text style={loginStyles.label}>Parol</Text>
                <View style={loginStyles.passwordContainer}>
                    <TextInput
                        placeholder="*******"
                        placeholderTextColor="#999"
                        style={loginStyles.passwordInput}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureText}
                    />
                    <Pressable onPress={() => setSecureText(!secureText)}>
                        <Ionicons
                            name={secureText ? 'eye-off-outline' : 'eye-outline'}
                            size={24}
                            color="#999"
                        />
                    </Pressable>
                </View>

                {/* Tizimga kirish tugmasi */}
                <TouchableOpacity style={loginStyles.loginButton}>
                    <Text style={loginStyles.loginText}>Tizimga kirish</Text>
                </TouchableOpacity>

                {/* Ro‘yxatdan o‘tish */}
                <TouchableOpacity style={loginStyles.signup}>
                    <Text style={loginStyles.signupPlus}>+ </Text>
                    <Text style={loginStyles.signupText}>Ro'yxatdan o’tish</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
};

const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // padding: 20,
    },
    loginImage: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        marginBottom: 20,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        backgroundColor: '#ddd',
        padding: 20,
        borderRadius: 10,
    },
    loginContainer: {
        width: "100%",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        boxShadow: "0 0 12px 0 #00000014",
        padding: 15,
        borderRadius: 50,
        marginBottom: 15,
    },
    buttonIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        color: "#000",
        fontWeight: 400,
    },
    orText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 30,
        marginTop: 20,
    },
    label: {
        width: "100%",
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
        alignItems: "flex-start"
    },
    input: {
        width: "100%",
        backgroundColor: '#EFF4F8',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        fontSize: 16,
        outlineStyle: "none"
    },
    passwordContainer: {
        width: "100%",
        flexDirection: 'row',
        backgroundColor: '#EFF4F8',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 30
    },
    passwordInput: {
        outlineStyle: "none",
        flex: 1,
        fontSize: 16,
    },
    loginButton: {
        width: "100%",
        backgroundColor: '#0059FF',
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
        fontSize: 17,
        fontWeight: 600,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    signup: {
        flexDirection: "row",
        marginTop: 50,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: "center",
    },
    signupPlus: {
        marginHorizontal: 10,
        fontSize: 26,
        color: "#0059FF",
        marginBottom: 5
    },
    signupText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 600,
    }
});

export default Login;