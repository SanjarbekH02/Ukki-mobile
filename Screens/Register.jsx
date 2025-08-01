import { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [region, setRegion] = useState('');
    const [gender, setGender] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Toshkent', value: 'toshkent' },
        { label: 'Samarqand', value: 'samarqand' },
        { label: 'Andijon', value: 'andijon' },
        { label: 'Farg‘ona', value: 'fargona' },
        { label: 'Namangan', value: 'namangan' },
        { label: 'Buxoro', value: 'buxoro' },
        { label: 'Jizzax', value: 'jizzax' },
        { label: 'Navoiy', value: 'navoiy' },
        { label: 'Sirdaryo', value: 'sirdaryo' },
        { label: 'Xorazm', value: 'xorazm' },
        { label: 'Surxondaryo', value: 'surxondaryo' },
        { label: 'Qashqadaryo', value: 'qashqadaryo' },
    ]);


    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Oylar 0dan boshlanadi
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const handleConfirm = (date) => {
        setBirthDate(date);
        hideDatePicker();
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Shaxsiy ma’lumotlaringizni kiriting</Text>
            </View>
            <View style={styles.inputBlock}>
                <Text style={styles.label}>Ism</Text>
                <TextInput
                    placeholder="Ismingizni kiriting"
                    placeholderTextColor={"#96A7B4"}
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>Familiya</Text>
                <TextInput
                    placeholder="Familiyangizni kiriting"
                    placeholderTextColor={"#96A7B4"}
                    style={styles.input}
                    value={surname}
                    onChangeText={setSurname}
                />
                <Text style={styles.label}>Tug’ilgan kuningiz</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                    <Text style={{ color: '#000' }}>{formatDate(birthDate)}</Text>
                    <Ionicons name='calendar' size={22} />
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />

                <Text style={styles.label}>Viloyat</Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Viloyat tanlang"
                    style={{ backgroundColor: '#EFF4F8', borderColor: '#EFF4F8' }}
                    dropDownContainerStyle={{ backgroundColor: '#EFF4F8', borderColor: "#e2e5e7ff" }}
                />


                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[styles.genderBtn, gender === 'male' && styles.selectedGender]}
                        onPress={() => setGender('male')}
                    >
                        <Image source={require('../assets/images/male.png')} />
                        <Text style={styles.genderText}> O‘g‘il</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.genderBtn, gender === 'female' && styles.selectedGender]}
                        onPress={() => setGender('female')}
                    >
                        <Image source={require('../assets/images/famele.png')} />
                        <Text style={styles.genderText}> Qiz</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Parol</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        placeholder="********"
                        placeholderTextColor={"#96A7B4"}
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Parolni qaytaring</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput
                        placeholder="********"
                        placeholderTextColor={"#96A7B4"}
                        style={styles.passwordInput}
                        // secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Tizimga kirish</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        // paddingTop: 60,
        backgroundColor: '#EEFFFC',
    },
    inputBlock: {
        flex:1,
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
    },
    title: {
        fontSize: 20,
        fontWeight: 600,
        padding: 30,
        paddingLeft: 20,
        padddingRight: 20,
    },
    input: {
        backgroundColor: '#EFF4F8',
        padding: 14,
        borderRadius: 12,
        marginBottom: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    label: {
        fontSize: 14,
        fontWeight: 400,
        marginBottom: 5,
        color: '#1D2226',
    },
    pickerWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 10,
        elevation: 3, // Android
        zIndex: 10, // iOS
    },

    picker: {
        backgroundColor: '#fff',
        color: '#000',
        height: 50,
        width: '100%',
    },

    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 24,
    },
    genderBtn: {
        flex: 1,
        backgroundColor: '#EFF4F8',
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        marginHorizontal: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    genderText: {
        fontSize: 16,
        fontWeight: 400,
        color: "#000"
    },
    selectedGender: {
        backgroundColor: '#d1e7ff',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF4F8',
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 24,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
    },
    button: {
        backgroundColor: '#0059FF',
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
