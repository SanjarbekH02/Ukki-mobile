import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import FlashCards from '../../../components/YangiSozlar';
import KaraokePlayer from '../../../Screens/Karaoke';
import Styles from '../../../Styles/Styles';

export default function U3Step1({ setIsPlaying, isPlaying, next }) {
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true)
    const [dictionary, setDictionary] = useState(false)
    
    return (
        <>
            {dictionary ? (
                <FlashCards
                    setDictionary={setDictionary}
                    data={[
                        { word: "This", translation: "Bu", audioUrl: "https://ukkibackend.soof.uz/media/audio/bu.mp3" },
                        { word: "That", translation: "Sha/u", audioUrl: "https://ukkibackend.soof.uz/media/audio/sha.mp3" },
                        { word: "Is", translation: "Ekanligini bildirish", audioUrl: "https://ukkibackend.soof.uz/media/audio/is.mp3" },
                        { word: "School", translation: "Maktab", audioUrl: "https://ukkibackend.soof.uz/media/audio/maktab.mp3" },
                        { word: "Classroom", translation: "Sinf xonasi", audioUrl: "https://ukkibackend.soof.uz/media/audio/sinf.mp3" },
                        { word: "Bag", translation: "Sumka", audioUrl: "https://ukkibackend.soof.uz/media/audio/sumka.mp3" },
                        { word: "Book", translation: "Kitob", audioUrl: "https://ukkibackend.soof.uz/media/audio/kitob.mp3" },
                        { word: "Pencil", translation: "Qalam", audioUrl: "https://ukkibackend.soof.uz/media/audio/qalam.mp3" },
                        { word: "Pen", translation: "Ruchka", audioUrl: "https://ukkibackend.soof.uz/media/audio/ruchka.mp3" },
                        { word: "Eraser", translation: "O'chirgich", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'chirgich.mp3" },
                        { word: "Who's speaking?", translation: "Kim gapirmoqda?", audioUrl: "https://ukkibackend.soof.uz/media/audio/kim_gapirmoqda.mp3" },
                    ]}
                />
            ) : (
                isPlaying ? <KaraokePlayer next={next} /> : (
                    <View style={Styles.container}>
                        <Image style={[Styles.ImgFull, { height: '75%' }]} source={require('../../../assets/images/unit-3/unit-2-step-1.png')} />
                        <ThreeButtons 
                            setDictionary={setDictionary} 
                            infoClick={infoClick} 
                            clicked={clicked} 
                            setClicked={setClicked} 
                            setInfoClick={setInfoClick} 
                            audioUrl='https://ukkibackend.soof.uz/media/audio/unit2-step1-audio.mp3' 
                            setIsPlaying={setIsPlaying} 
                            playBtn={true} 
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 50,
                            left: 0,
                            right: 0,
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity 
                                style={{
                                    backgroundColor: '#FF6B35',
                                    paddingVertical: 18,
                                    paddingHorizontal: 60,
                                    borderRadius: 25,
                                    alignItems: 'center',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 6,
                                    elevation: 8
                                }}
                                onPress={() => setIsPlaying(true)}
                            >
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>▶ Play</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            )}
        </>
    )
}