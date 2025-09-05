import { StyleSheet, View } from 'react-native'
import WordGameAssist from '../../../components/Utils/WordGame'

export default function Step8({next}) {
    const words = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten"
    ]
     const audioList = [
        "https://ukkibackend.soof.uz/media/audio/CD1-09-1.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-2.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-3.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-4.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-5.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-6.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-7.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-8.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-9.mp3",
        "https://ukkibackend.soof.uz/media/audio/CD1-09-10.mp3"
    ]
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <WordGameAssist next={next} words={words} audios={audioList} />
    </View>
  )
}

const styles = StyleSheet.create({})