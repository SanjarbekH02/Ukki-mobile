import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import FlashCards from '../../../components/YangiSozlar';
import KaraokePlayer from '../../../Screens/Karaoke';
import Styles from '../../../Styles/Styles';

export default function Step1({ setIsPlaying, isPlaying, next }) {
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true)
    const [dictionary, setDictionary] = useState(false)
    return (
        <>
            {dictionary ? (
                <FlashCards
                setDictionary={setDictionary}
                    data={[
                        { word: "Come", translation: "Kel", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-1.mp3" },
                        { word: "And", translation: "va", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        { word: "See", translation: "qara", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        { word: "Play", translation: "o'yna", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        { word: "what", translation: "nima", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        { word: "Learn", translation: "o'rganmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        { word: "Today", translation: "bugun", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        // { word: "Bye", translation: "Hayr", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                        { word: "It's time", translation: "vaqti keldi", audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-03-2.mp3" },
                    ]}
                />
            ) : (
                isPlaying ? <KaraokePlayer next={next} /> : (
                    <View style={Styles.container}>
                        <Text style={Styles.title}>1.Hello</Text>
                        <Image style={Styles.ImgFull} source={require('../../../assets/images/1-sahifa.png')} />
                        <Image style={Styles.ImgFull} source={require('../../../assets/images/image.png')} />
                        <ThreeButtons setDictionary={setDictionary} infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} audioUrl='https://ukkibackend.soof.uz/media/audio/d69bc1ad-d5da-450a-93a8-ebea3b7971ab.mp3' setIsPlaying={setIsPlaying} playBtn={true} />
                    </View>
                )
            )}
        </>
    )
}
