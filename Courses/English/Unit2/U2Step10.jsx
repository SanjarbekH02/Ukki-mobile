import { useState } from 'react';
import { Image, Text, View } from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import FlashCards from '../../../components/YangiSozlar';
import KaraokePlayer from '../../../Screens/Karaoke';
import Styles from '../../../Styles/Styles';

export default function U2Step10({ setIsPlaying, isPlaying, next }) {
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true)
    const [dictionary, setDictionary] = useState(false)
    return (
        <>
            {dictionary ? (
                <FlashCards
                    setDictionary={setDictionary}
                    data={[
                        { word: "Books", translation: "kitoblar ", audioUrl: "https://ukkibackend.soof.uz/media/audio/kitob.mp3" },
                        { word: "Count", translation: "Sanamoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/sanamoq.mp3" },
                        { word: "With me", translation: "Men bilan", audioUrl: "https://ukkibackend.soof.uz/media/audio/men bilan.mp3" },
                        { word: "How many ", translation: "Nechta", audioUrl: "https://ukkibackend.soof.uz/media/audio/nechta.mp3" },
                        { word: "See", translation: "Ko’rmoq", audioUrl: "https://ukkibackend.soof.uz/media/audio/ko'rmoq.mp3" },
                        { word: "Erasers ", translation: "o’chirg’ichlar", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'chirgichlarrr.mp3" },
                        { word: "Pencils", translation: "qalamlar", audioUrl: "https://ukkibackend.soof.uz/media/audio/qalamlar.mp3" },
                       

                    ]}
                />
            ) : (
                isPlaying ? <KaraokePlayer

                    audioUri="https://ukkibackend.soof.uz/media/audio/66db7258-9489-4bdb-a011-1def5f946869.mp3"
                    lrcText={`[00:07.92]Books, [00:08.72]books. [00:09.77]Count [00:10.05]with [00:10.31]me.
[00:11.64]Books, [00:12.43]books. [00:13.50]Count [00:14.03]with [00:14.30]me.
[00:15.36]How [00:15.89]many [00:16.42]books [00:17.49]can [00:17.75]you [00:18.29]see?
[00:20.40]One, [00:21.20]two, [00:22.26]three, [00:23.06]four.
[00:26.99]Four! [00:28.05]Four, [00:29.11]four, [00:29.90]four [00:30.96]books.
[00:34.79]Erasers, [00:35.33]erasers. [00:36.38]Count [00:36.92]with [00:37.19]me.
[00:38.51]Erasers, [00:39.04]erasers. [00:40.37]Count [00:40.64]with [00:40.92]me.
[00:42.25]How [00:42.78]many [00:43.33]erasers [00:44.38]can [00:44.65]you [00:45.18]see?
[00:47.31]One, [00:48.11]two, [00:48.90]three, [00:49.96]four, [00:50.76]five.
[00:54.74]Five! [00:55.81]Five, [00:56.61]five, [00:57.64]five [00:58.70]erasers.
[01:02.43]Pencils, [01:03.21]pencils. [01:04.28]Count [01:04.81]with [01:05.08]me.
[01:06.42]Pencils, [01:07.22]pencils. [01:08.28]Count [01:08.54]with [01:09.07]me.
[01:10.14]How [01:10.41]many [01:10.93]pencils [01:12.00]can [01:12.53]you [01:13.06]see?
[01:14.92]One, [01:15.72]two, [01:16.77]three, [01:17.84]four, [01:18.64]five, [01:19.71]six.
[01:23.68]Six! [01:24.48]Six, [01:25.55]six, [01:26.34]six [01:27.40]pencils.`}

                    next={next} /> : (
                    <View style={Styles.container}>
                        <Text style={Styles.title}>Sing the song.</Text>
                        <Image style={Styles.ImgFull} source={require('../../../assets/images/sirk.jpg')} />
                        {/* <Image style={Styles.ImgFull} source={require('../../../assets/images/image.png')} /> */}
                        <ThreeButtons setDictionary={setDictionary} infoClick={infoClick} clicked={clicked} setClicked={setClicked} setInfoClick={setInfoClick} audioUrl='https://ukkibackend.soof.uz/media/audio/d69bc1ad-d5da-450a-93a8-ebea3b7971ab.mp3' setIsPlaying={setIsPlaying} playBtn={true} />
                    </View>
                )
            )}
        </>
    )
}
