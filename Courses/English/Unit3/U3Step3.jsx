import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import KaraokePlayer from '../../../Screens/Karaoke'

export default function U3Step3() {
  const [showKaraoke, setShowKaraoke] = useState(false)

  return (
    <View style={styles.container}>
      {!showKaraoke ? (
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => setShowKaraoke(true)}
        >
          <Text style={styles.playText}>▶ Play</Text>
        </TouchableOpacity>
      ) : (
        <KaraokePlayer />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  playButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#1db954',
    borderRadius: 30,
  },
  playText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
