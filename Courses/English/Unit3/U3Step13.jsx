import { useState } from "react";
import { Image, Text, View } from "react-native";
import WordPractice from "../../../components/Utils/Talaffuz";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import WordGameAssist from "../../../components/Utils/WordGame";
import FlashCards from "../../../components/YangiSozlar";
import KaraokePlayer from "../../../Screens/Karaoke";
import Styles from "../../../Styles/Styles";

export default function U3Step10({ setIsPlaying, isPlaying, next }) {
    const [infoClick, setInfoClick] = useState(true);
    const [clicked, setClicked] = useState(true);
    const [dictionary, setDictionary] = useState(false);
    const [wordgame, setWordgame] = useState(true);
    const [talaffuz, setTalaffuz] = useState(false);

    return (
        <>
            {dictionary ? (
                <>
                    {wordgame ? (
                        <FlashCards
                            setDictionary={setWordgame}
                            data={[
                                {
                                    word: "count",
                                    translation: "sanamoq",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/sanamoq.mp3",
                                },
                                {
                                    word: "with me",
                                    translation: "men bilan",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/men bilan.mp3",
                                },
                                {
                                    word: "how many",
                                    translation: "nechta",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/nechta.mp3",
                                },
                                {
                                    word: "see",
                                    translation: "ko'rmoq",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/ko'rmoq.mp3",
                                },
                                {
                                    word: "pensils",
                                    translation: "qalamlar",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/qalamlar.mp3",
                                },
                            ]}
                        />
                    ) : talaffuz ? (
                        <WordPractice
                            setWordgame={setWordgame}
                            setDictionary={setDictionary}
                            setTalaffuz={setTalaffuz}
                            words={[
                                {
                                    text: "count",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/sanamoq.mp3",
                                },
                                {
                                    text: "with me",
                                    audioUrl:
                                        "https://ukkibackend.soof.uz/media/audio/men bilan.mp3",
                                },
                                {
                                    text: "how many",
                                    audioUrl: "https://ukkibackend.soof.uz/media/audio/nechta.mp3",
                                },
                                {
                                    text: "see",
                                    audioUrl: "https://ukkibackend.soof.uz/media/audio/ko'rmoq.mp3",
                                },
                                {
                                    text: "pensils",
                                    audioUrl: "https://ukkibackend.soof.uz/media/audio/qalamlar.mp3",
                                },
                            ]}
                        />
                    ) : (
                        <WordGameAssist
                            setDictionary={setTalaffuz}
                            words={[
                                "count",
                                "with me",
                                "how many",
                                "see",
                                "pensils",
                            ]}
                            audios={[
                                "https://ukkibackend.soof.uz/media/audio/sanamoq.mp3",
                                "https://ukkibackend.soof.uz/media/audio/men bilan.mp3",
                                "https://ukkibackend.soof.uz/media/audio/nechta.mp3",
                                "https://ukkibackend.soof.uz/media/audio/ko'rmoq.mp3",
                                "https://ukkibackend.soof.uz/media/audio/qalamlar.mp3",
                            ]}
                        />
                    )}
                </>
            ) : isPlaying ? (
                <KaraokePlayer
                    audioUri="https://ukkibackend.soof.uz/media/audio/CD1-49.mp3"
                    lrcText={`[00:14.80]What’s [00:15.10]this? [00:16.45]What’s [00:17.00]this? | Bu nima? Bu nima?
[00:17.80]Can [00:18.30]you [00:18.70]guess? [00:19.55]Can [00:20.00]you [00:20.50]guess? | Topa olasanmi? Topa olasanmi?
[00:21.80]What’s [00:22.25]this? [00:23.50]What’s [00:24.05]this? | Bu nima? Bu nima?
[00:25.10]Can [00:25.30]you [00:25.50]guess? [00:26.70]Can [00:27.30]you [00:27.55]guess? | Topa olasanmi? Topa olasanmi?
[00:29.30]Is [00:29.60]it [00:29.75]a [00:30.20]computer? [00:32.70]Is [00:33.00]it [00:33.15]a [00:33.60]computer? | Bu kompyuter(mi)? Bu kompyuter(mi)?
[00:35.90]No, [00:36.20]it [00:36.40]isn’t. [00:37.70]No, [00:38.00]it [00:38.20]isn’t. | Yoʻq, u emas. Yoʻq, u emas
[00:39.40]Guess [00:39.90]again! [00:41.30]Guess [00:41.80]again! | Yana topishga urin! Yana topishga urin!
[00:43.00]What’s [00:43.30]this? [00:44.70]What’s [00:45.10]this? | Bu nima? Bu nima?
[00:46.20]Can [00:46.50]you [00:47.05]guess? [00:48.05]Can [00:48.55]you [00:48.70]guess? | Topa olasanmi? Topa olasanmi?
[00:50.20]What’s [00:50.50]this? [00:51.80]What’s [00:52.20]this? | Bu nima? Bu nima?
[00:53.15]Can [00:53.70]you [00:54.05]guess? [00:54.90]Can [00:55.30]you [00:56.00]guess? | Topa olasanmi? Topa olasanmi?
[00:57.60]Is [00:58.00]it [00:58.05]an [00:58.20]art [00:59.10]set? [01:01.00]Is [01:01.40]it [01:01.55]an [01:02.00]art [01:02.40]set? | Bu rasm chizish toʻplami(mi)? Bu rasm chizish toʻplami(mi)?
[01:04.10]No, [01:04.50]it [01:04.60]isn’t. [01:05.90]No, [01:06.15]it [01:06.30]isn’t. | Yoʻq, u emas. Yoʻq, u emas.
[01:07.70]Guess [01:08.15]again! [01:09.40]Guess [01:09.85]again! | Yana topishga urin! Yana topishga urin!
[01:11.25]What’s [01:11.70]this? [01:12.90]What’s [01:13.20]this? | Bu nima? Bu nima? 
[01:14.30]Can [01:14.55]you [01:15.15]guess? [01:16.10]Can [01:16.45]you [01:17.00]guess? | Topa olasanmi? Topa olasanmi?
[01:18.20]What’s [01:18.60]this? [01:20.00]What’s [01:20.40]this? | Bu nima? Bu nima?
[01:21.30]Can [01:21.95]you [01:22.20]guess? [01:23.10]Can [01:23.50]you [01:24.00]guess? | Topa olasanmi? Topa olasanmi?
[01:26.00]Is [01:26.20]it [01:26.40]a [01:26.90]teddy [01:27.25]bear? [01:29.20]Is [01:29.75]it [01:29.85]a [01:30.15]teddy [01:30.75]bear? | Bu yumshoq ayiqcha(mi)? Bu yumshoq ayiqcha(mi)?
[01:32.25]Yes, [01:32.60]it [01:32.90]is. [01:34.05]Yes, [01:34.45]it [01:34.70]is. | Ha, u. Ha, u.
[01:36.00]It’s [01:36.25]a [01:36.50]purple [01:37.20]teddy [01:37.90]bear. | Bu binafsha rangli yumshoq ayiqcha.
[01:39.50]Happy [01:40.00]birthday [01:40.90]to [01:41.00]you, [01:43.05]happy [01:43.40]birthday [01:44.20]to [01:44.65]you, | Tugʻilgan kuning muborak, tugʻilgan kuning muborak,
[01:46.45]Happy [01:47.00]birthday, [01:48.45]happy [01:48.75]birthday, [01:50.00]happy [01:50.40]birthday [01:51.30]to [01:51.70]you! | Tugʻilgan kuning, tugʻilgan kuning, tugʻilgan kuning muborak!
[01:53.60]Happy [01:54.15]birthday [01:54.90]to [01:55.30]you, [01:57.20]happy [01:57.75]birthday [01:58.40]to [01:58.75]you, | Tugʻilgan kuning muborak, tugʻilgan kuning muborak,
[02:00.55]Happy [02:01.10]birthday, [02:02.45]happy [02:02.85]birthday, [02:04.10]happy [02:04.40]birthday [02:05.40]to [02:06.00]you! | Tugʻilgan kuning, tugʻilgan kuning, tugʻilgan kuning muborak!
`}
                    next={next}
                />
            ) : (
                <View style={Styles.container}>
                    <Text style={Styles.title}>Sing the song.</Text>
                    <Image
                        style={Styles.ImgFull}
                        source={require("../../../assets/images/cd49.jpg")}
                    />
                    {/* <Image style={Styles.ImgFull} source={require('../../../assets/images/image.png')} /> */}
                    <ThreeButtons
                        setDictionary={setDictionary}
                        infoClick={infoClick}
                        clicked={clicked}
                        setClicked={setClicked}
                        setInfoClick={setInfoClick}
                        audioUrl="https://ukkibackend.soof.uz/media/audio/d69bc1ad-d5da-450a-93a8-ebea3b7971ab.mp3"
                        setIsPlaying={setIsPlaying}
                        playBtn={true}
                    />
                </View>
            )}
        </>
    );
}
