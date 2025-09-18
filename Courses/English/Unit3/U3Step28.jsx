// App.js
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

// O'yinchoqlar ma'lumotlari
const toys = [
  { id: 1, name: 'KITE', emoji: '🪁', color: '#FF6B6B' },
  { id: 2, name: 'ROBOT', emoji: '🤖', color: '#4ECDC4' },
  { id: 3, name: 'BALL', emoji: '⚽', color: '#45B7D1' },
  { id: 4, name: 'BIKE', emoji: '🚲', color: '#96CEB4' },
  { id: 5, name: 'DOLL', emoji: '🪆', color: '#FFEAA7' },
  { id: 6, name: 'CAMERA', emoji: '📷', color: '#DDA0DD' }
];

const ToyCard = ({ toy, onPress, completed }) => {
  return (
    <TouchableOpacity
      style={[styles.toyCard, { backgroundColor: toy.color }]}
      onPress={() => onPress(toy)}
      activeOpacity={0.8}
    >
      <Text style={styles.toyEmoji}>{toy.emoji}</Text>
      <Text style={styles.toyName}>{toy.name}</Text>
      <Text style={styles.progressText}>
        {completed ? '✅ Yozildi' : '⏳ Kutmoqda'}
      </Text>
    </TouchableOpacity>
  );
};

const TracingModal = ({ visible, toy, onClose, onWordComplete, completedWords, next }) => {
  const [inputValue, setInputValue] = useState('');

  if (!toy) return null;

  const handleSubmit = () => {
    if (inputValue.trim().toUpperCase() === toy.name) {
      onWordComplete(toy.id);
      Alert.alert('Ajoyib! 🎉', `${toy.name} so'zi to‘g‘ri yozildi!`);
      setInputValue('');
      onClose();
    } else {
      Alert.alert('Xato ❌', 'Qaytadan urinib ko‘ring.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: toy.color }]}>
        <StatusBar backgroundColor={toy.color} barStyle="light-content" />

        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{toy.name}</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Toy Display */}
        <View style={styles.toyDisplay}>
          <Text style={styles.bigEmoji}>{toy.emoji}</Text>
          <Text style={styles.dottedWord}>
            {toy.name.split('').join('   ')}
          </Text>
          <Text style={styles.instructionText}>
            Pastdagi inputga so‘zni yozing!
          </Text>

          <TextInput
            style={styles.input}
            placeholder="So'zni yozing..."
            placeholderTextColor="#ddd"
            value={inputValue}
            onChangeText={setInputValue}
            autoCapitalize="characters"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>✅ Tekshirish</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Info */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressInfoText}>
            {completedWords[toy.id] ? '✔ Allaqachon yozilgan' : '⌛ Hali yozilmagan'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default function App({ next }) {
  const [selectedToy, setSelectedToy] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [completedWords, setCompletedWords] = useState({});

  const handleToyPress = (toy) => {
    setSelectedToy(toy);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedToy(null);
  };

  const handleWordComplete = (toyId) => {
    setCompletedWords(prev => ({
      ...prev,
      [toyId]: true
    }));
  };

  const resetAllProgress = () => {
    Alert.alert(
      'Barchasini tozalash',
      'Barcha progressni tozalashni xohlaysizmi?',
      [
        { text: 'Yo‘q', style: 'cancel' },
        {
          text: 'Ha',
          onPress: () => {
            setCompletedWords({});
            Alert.alert('Tozalandi ✅', 'Barcha so‘zlar qayta yozilishi mumkin.');
          }
        }
      ]
    );
  };

  const showOverallProgress = () => {
    const total = toys.length;
    const completed = Object.keys(completedWords).length;
    const percentage = Math.round((completed / total) * 100);

    Alert.alert(
      'Umumiy natija',
      `${completed}/${total} ta so‘z yozildi\nProgress: ${percentage}%`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3498DB" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🧸 O'yinchoqlar</Text>
        <Text style={styles.subtitle}>So‘zlarni yozishni o‘rganing!</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.progressButton} onPress={showOverallProgress}>
            <Text style={styles.buttonText}>📊 Natija</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetAllButton} onPress={resetAllProgress}>
            <Text style={styles.buttonText}>🔄 Tozalash</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* O'yinchoqlar grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {toys.map((toy) => (
            <ToyCard
              key={toy.id}
              toy={toy}
              onPress={handleToyPress}
              completed={!!completedWords[toy.id]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={next} style={styles.nextBtn}>
            <Text style={{color: "white", fontSize: 20}}>Next</Text>
        </TouchableOpacity>
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modal */}
      <TracingModal
        visible={modalVisible}
        toy={selectedToy}
        onClose={handleCloseModal}
        onWordComplete={handleWordComplete}
        completedWords={completedWords}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  header: {
    backgroundColor: '#3498DB',
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E8F4FD',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  progressButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetAllButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  toyCard: {
    width: (width - 60) / 2,
    height: (width - 60) / 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  toyEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  toyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },

  nextBtn: { 
    backgroundColor: '#3498DB',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  toyDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bigEmoji: {
    fontSize: 120,
    marginBottom: 10,
  },
  dottedWord: {
    fontSize: 36,
    letterSpacing: 8,
    color: 'white',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
  },
  submitButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressInfo: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  progressInfoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
