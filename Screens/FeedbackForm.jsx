import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ComponentTop from '../components/Utils/ComponentTop';

const FeedbackForm = () => {
    const [activeTab, setActiveTab] = useState('savol');
    const [message, setMessage] = useState('');

    return (
        <View style={{ flex: 1 ,backgroundColor: "#EFF4F8"}}>
            <ComponentTop text="Savol yoki takliflar uchun" />
            <View style={styles.container}>
                <View style={styles.toggleWrapper}>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'savol' && styles.activeButton]}
                        onPress={() => setActiveTab('savol')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'savol' && styles.activeText]}>Savol</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, activeTab === 'taklif' && styles.activeButton]}
                        onPress={() => setActiveTab('taklif')}
                    >
                        <Text style={[styles.toggleText, activeTab === 'taklif' && styles.activeText]}>Taklif</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Savolingizni yozing</Text>
                <Text style={styles.description}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                    been the industry's standard dummy text ever since the 1500s
                </Text>

                <TextInput
                    style={styles.textInput}
                    multiline
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Yozing..."
                    placeholderTextColor={'#93989B'}
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Yuborish</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 20,
        flex: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    toggleWrapper: {
        flexDirection: 'row',
        backgroundColor: '#EFF4F8',
        borderRadius: 50,
        padding: 4,
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#fff',
        elevation: 3,
    },
    toggleText: {
        color: '#000',
    },
    activeText: {
        fontWeight: '600',
    },
    title: {
        fontWeight: '600',
        fontSize: 18,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#595E62',
        lineHeight: "20",
        marginBottom: 12,
    },
    textInput: {
        borderColor: '#DBE0E4',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        minHeight: 140,
        textAlignVertical: 'top',
        backgroundColor: '#EFF4F8',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#006AFF',
        paddingVertical: 14,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default FeedbackForm;