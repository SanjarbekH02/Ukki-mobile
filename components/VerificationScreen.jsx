import { useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function VerificationScreen() {
  const [code, setCode] = useState(['', '', '', '', '']); // 6 xonali
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Sahifa ochilganda birinchi inputga fokus
    inputRefs.current[0]?.focus();

    // Timer
    if (timer !== 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.verContainer}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.toBack} >
          <Image source={require('../assets/images/left.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Tasdiqlash</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.phoneBox}>
          <Text style={styles.phoneNumber}>+998 97 628 28 82</Text>
          <Text style={styles.subtitle}>
            Ushbu raqamga 6 xonali kod yuborildi, ushbu kodni kiriting.
          </Text>
        </View>

        <Text style={styles.codeLabel}>Kod kiriting</Text>

        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(value, index)}
              returnKeyType="next"
              placeholder='0'
              placeholderTextColor="#A9AEB2"
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ro'yxatdan o'tish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verContainer: {
    flex: 1,
    // padding: 20,
    // paddingTop: 60,
    backgroundColor: '#e6f2ff',
  },
  top: {
    // flex: 1,
    position: "relative",
    paddingTop: 20,
    paddingBottom: 30,
  },
  toBack: {

    padding: 8,
    paddingLeft: 15,
    paddingRight: 20,
    backgroundColor: "white",
    position: "absolute",
    top: 20,
    left: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    // marginBottom: 30,
  },
  bottom: {
    // flex:2
    borderTopLeftRadius: "12px",
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 15,
    flex: 1
  },
  phoneBox: {
    marginBottom: 20,
    elevation: 3,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1D2226",
    textAlign: 'center',
    marginBottom: 10,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#DBE0E4',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#EFF4F8',
  },
  timerText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0059FF',
    paddingVertical: 14,
    borderRadius: 50,
    fontSize: 16,
    fontWeight: 600,
    alignItems: 'center',
    marginTop: 140,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
