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
                        { word: "Come", translation: "kelmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/kelmoq.mp3" },
                        { word: "See", translation: "Qaramoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/qaramoq.mp3" },
                        { word: "Play", translation: "O'ynamoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'ynamoq.mp3" },
                        { word: "What ", translation: "Nima", audioUrl: "https://ukkibackend.soof.uz/media/audio/nima.mp3" },
                        { word: "We", translation: "Biz", audioUrl: "https://ukkibackend.soof.uz/media/audio/biz.mp3" },
                        { word: "Learn ", translation: "O'rganmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'rganmoq.mp3" },
                        { word: "Today", translation: "Bugun", audioUrl: "https://ukkibackend.soof.uz/media/audio/bugun.mp3" },
                        { word: "It's time", translation: "vaqti keldi", audioUrl: "https://ukkibackend.soof.uz/media/audio/vaqti keldi.mp3" },
                        { word: "Guess what", translation: "Topchi", audioUrl: "https://ukkibackend.soof.uz/media/audio/topchi .mp3" },
                        { word: "Come and see", translation: "Qani, kel, ko‘r", audioUrl: "https://ukkibackend.soof.uz/media/audio/qani kel, ko'r.mp3" },
                        { word: "Come and play", translation: "Qani kel, O‘yna!", audioUrl: "https://ukkibackend.soof.uz/media/audio/qani kel o'yna.mp3" },
                        { word: "What can we learn today?", translation: "Bugun nimalarni o’rganamiz?", audioUrl: "https://ukkibackend.soof.uz/media/audio/bugun nimalarni o'rganamiz.mp3" },
                        { word: "It’s time to learn today!", translation: "O’rganish vaqti keldi!", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'rganish vaqti keldi.mp3" },

                    ]}
                />
            ) : (
                isPlaying ? <KaraokePlayer next={next} /> : (
                    <View style={Styles.container}>
                        <Text style={Styles.title}>1.Hello</Text>
                        <Image style={Styles.ImgFull} source={require('../../../assets/images/1-sahifa.png')} />
                        {/* <Image style={Styles.ImgFull} source={require('../../../assets/images/image.png')} /> */}
                        <ThreeButtons setDictionary={setDictionary} infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} audioUrl='https://ukkibackend.soof.uz/media/audio/d69bc1ad-d5da-450a-93a8-ebea3b7971ab.mp3' setIsPlaying={setIsPlaying} playBtn={true} />
                    </View>
                )
            )}
        </>
    )
}
