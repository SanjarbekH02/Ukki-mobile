import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Styles from '../../../Styles/Styles'
import ThreeButtons from '../../../components/Utils/ThreeButtons'

export default function Step17({ next }) {
  const [visible, setVisible] = useState(false)
  const [activeImg, setActiveImg] = useState(null)
  const [sound, setSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showNext, setShowNext] = useState(false)
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true)
  const [dictionary, setDictionary] = useState(false)
  const [wordgame, setWordgame] = useState(true)
  const [talaffuz, setTalaffuz] = useState(false)

  const audios = [
    'https://ukkibackend.soof.uz/media/audio/CD1-41-3.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-41-6.mp3',
    'https://ukkibackend.soof.uz/media/audio/kitob.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-41-7.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-41-5.mp3',
    'https://ukkibackend.soof.uz/media/audio/CD1-41-10s.mp3',
  ]

  const images = [
    require('../../../assets/images/unit-3/c1.jpg'),
    require('../../../assets/images/unit-3/c2.jpg'),
    require('../../../assets/images/unit-3/c3.jpg'),
    require('../../../assets/images/unit-3/c4.jpg'),
    require('../../../assets/images/unit-3/c5.jpg'),
    require('../../../assets/images/unit-3/c6.jpg'),
  ]

  const texts = [
    "Kite - Varrak",
    "Camera - Kamera",
    "Book - Kitob",
    "Robot - Robot",
    "Teddy bear  - Yumshoq ayiqcha",
    "Art set  - Rasm chizish to'plami.",
  ]

  // eski audio tozalash
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

  const playSequence = async (index = 0) => {
    try {
      if (index >= audios.length) {
        setIsPlaying(false)
        setVisible(false)
        setActiveImg(null)
        setShowNext(true)
        return
      }

      if (sound) {
        await sound.stopAsync()
        await sound.unloadAsync()
      }

      setCurrentIndex(index)
      setActiveImg(images[index])
      setVisible(true)

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audios[index] })
      setSound(newSound)

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playSequence(index + 1)
        }
      })

      await newSound.playAsync()
    } catch (err) {
      console.log('Audio error:', err)
    }
  }

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      setShowNext(false)
      playSequence(0)
    }
  }

  return (
    <>
      <View style={Styles.container}>
        <ThreeButtons
          audioUrl="https://ukkibackend.soof.uz/media/audio/ad9c2f34-e973-422c-8641-024bc5db66e9.mp3"
          setDictionary={setDictionary}
          infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick}
        />
        {/* Rasm bloklari */}
        <View style={styles.imgGrid}>
          {images.map((img, i) => (
            <View key={i} style={styles.imgBox}>
              <Image source={img} style={styles.image} />
            </View>
          ))}

          {!isPlaying && !showNext && (
            <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
              <Text style={styles.playText}>▶ Play</Text>
            </TouchableOpacity>
          )}
        </View>

        {showNext && (
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>Next ➜</Text>
          </TouchableOpacity>
        )}

        <Modal visible={visible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            {activeImg && (
              <>
                <Image source={activeImg} style={styles.bigImage} />
                <Text style={styles.modalText}>{texts[currentIndex]}</Text>
              </>
            )}
          </View>
        </Modal>
      </View>
            
    </>
  )
}

const styles = StyleSheet.create({
  imgGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    position: 'relative',
  },
  imgBox: {
    width: '48%',
    aspectRatio: 1,
    marginVertical: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  playBtn: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -50 }],
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#ff9800',
    borderRadius: 10,
    zIndex: 10,
  },
  playText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextBtn: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    alignSelf: 'center',
  },
  nextText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bigImage: {
    width: '80%',
    height: '50%',
    resizeMode: 'contain',
    borderRadius: 10
  },
  modalText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  }
})
