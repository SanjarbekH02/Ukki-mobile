// import { Audio } from 'expo-av';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useEffect, useRef, useState } from 'react';
// import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
// import ComponentTop from '../components/Utils/ComponentTop';

// const { width } = Dimensions.get('window');

// export default function KaraokePlayer({
//     audioUri = "https://ukkibackend.soof.uz/media/audio/632fc43a-d639-4c78-bf70-980be1cc6f15.mp3",
//     lrcText = `
// [00:10.03]Guess [00:10.45]what! [00:12.12]Come  [00:12.59]and [00:12.71]see. | Top-chi qani, kel, Ko'r!
// [00:14.21]Guess [00:14.70]what! [00:16.36]Come [00:16.60]and [00:16.83]play. | Top-chi qani, kel, o'yna.
// [00:18.55]Guess [00:19.03]what! [00:20.73]What [00:21.73]can [00:22.06]we [00:22.31]learn [00:22.76]today? | Top-chi qani, bugun nimalarni bilamiz?
// [00:31.49]Guess [00:31.89]what! [00:33.55]Come [00:33.79]and [00:34.03]see. | Top-chi qani, kel, Ko'r!
// [00:35.64]Guess [00:36.08]what! [00:37.79]Come [00:38.07]and [00:38.30]play. | Top-chi qani, kel, o'yna.
// [00:39.97]Guess [00:40.42]what! [00:42.17]it's [00:42.44]time [00:43.41]to [00:43.68]learn [00:44.16]today! | Top-chi qani, bugun o'rganish vaqti keldimi!
// [00:46.51]Guess [00:46.87]what! | Topgin-chi
//     `,
//     autoPlay = true,
// }) {
//     const soundRef = useRef(null);
//     const [status, setStatus] = useState(null);
//     const [lyrics, setLyrics] = useState([]); // har bir qator so‘zlari va vaqtlar
//     const [currentTime, setCurrentTime] = useState(0);

//     useEffect(() => {
//         setLyrics(parseLRCtoWords(lrcText || ''));
//     }, [lrcText]);

//     useEffect(() => {
//         loadSound();
//         return () => {
//             unloadSound();
//         };
//     }, [audioUri]);

//     async function loadSound() {
//         try {
//             await unloadSound();
//             const { sound } = await Audio.Sound.createAsync(
//                 { uri: audioUri },
//                 { shouldPlay: autoPlay },
//                 onPlaybackStatusUpdate
//             );
//             soundRef.current = sound;
//         } catch (e) {
//             console.warn('Audio yuklashda xatolik', e);
//         }
//     }

//     async function unloadSound() {
//         try {
//             if (soundRef.current) {
//                 await soundRef.current.unloadAsync();
//                 soundRef.current = null;
//                 setStatus(null);
//             }
//         } catch (e) { }
//     }

//     function onPlaybackStatusUpdate(playbackStatus) {
//         setStatus(playbackStatus);
//         if (playbackStatus?.positionMillis != null) {
//             setCurrentTime(playbackStatus.positionMillis / 1000);
//         }
//     }

//     function renderLine(line, idx) {
//         return (
//             <View key={idx} style={styles.lineWrap}>
//                 <Text style={styles.lineText}>
//                     {line.words.map((w, i) => {
//                         const isActive = currentTime >= w.time;
//                         return (
//                             <Text
//                                 key={i}
//                                 style={{
//                                     color: isActive ? '#C200F3' : '#000',
//                                     fontWeight: isActive ? 'bold' : 'normal'
//                                 }}
//                             >
//                                 {w.text + ' '}
//                             </Text>
//                         );
//                     })}
//                 </Text>
//                 {line.translation ? (
//                     <Text style={styles.translationText}>{line.translation}</Text>
//                 ) : null}
//             </View>
//         );
//     }

//     return (
//         <LinearGradient
//             colors={['#f2f2fe', '#f9eaef', '#fef3ee']}
//             style={{ flex: 1 }}
//         >
//             <ComponentTop text='Karaoke' />
//             <ScrollView
//                 contentContainerStyle={{
//                     flexGrow: 1,
//                     justifyContent: 'center',
//                     padding: 20
//                 }}
//             >
//                 {lyrics.map((line, idx) => renderLine(line, idx))}
//             </ScrollView>
//         </LinearGradient>
//     );
// }


// function parseLRCtoWords(text) {
//     if (!text) return [];
//     const lineRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\]([^\[]+)/g;

//     const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
//     let result = [];

//     lines.forEach(rawLine => {
//         let words = [];
//         let translation = '';

//         // Agar tarjima bo'lsa ajratamiz
//         const [mainPart, transPart] = rawLine.split('|').map(s => s.trim());
//         if (transPart) translation = transPart;

//         let matches = [...mainPart.matchAll(lineRegex)];

//         matches.forEach(m => {
//             const mm = parseInt(m[1], 10);
//             const ss = parseInt(m[2], 10);
//             const frac = m[3] ? parseInt(m[3].padEnd(2, '0'), 10) : 0;
//             const time = mm * 60 + ss + frac / 100;

//             const wordText = m[4].trim();
//             if (wordText) {
//                 words.push({
//                     text: wordText,
//                     time
//                 });
//             }
//         });

//         if (words.length > 0) {
//             result.push({
//                 startTime: words[0].time,
//                 words,
//                 translation
//             });
//         }
//     });

//     return result;
// }

// const styles = StyleSheet.create({
//     lineWrap: { paddingVertical: 8 },
//     lineText: { fontSize: 24, textAlign: 'center', flexWrap: 'wrap' },
//     translationText: {
//         color: '#000000B2',
//         fontSize: 18,
//         marginTop: 2,
//         textAlign: 'center'
//     }
// });


import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ComponentTop from '../components/Utils/ComponentTop';

const { width } = Dimensions.get('window');

export default function KaraokePlayer({
    audioUri = "https://ukkibackend.soof.uz/media/audio/632fc43a-d639-4c78-bf70-980be1cc6f15.mp3",
    lrcText = `
[00:10.03]Guess [00:10.45]what! [00:12.12]Come  [00:12.59]and [00:12.71]see. | Top-chi qani, kel, Ko'r!
[00:14.21]Guess [00:14.70]what! [00:16.36]Come [00:16.60]and [00:16.83]play. | Top-chi qani, kel, o'yna.
[00:18.55]Guess [00:19.03]what! [00:20.73]What [00:21.73]can [00:22.06]we [00:22.31]learn [00:22.76]today? | Top-chi qani, bugun nimalarni bilamiz?
[00:31.49]Guess [00:31.89]what! [00:33.55]Come [00:33.79]and [00:34.03]see. | Top-chi qani, kel, Ko'r!
[00:35.64]Guess [00:36.08]what! [00:37.79]Come [00:38.07]and [00:38.30]play. | Top-chi qani, kel, o'yna.
[00:39.97]Guess [00:40.42]what! [00:42.17]it's [00:42.44]time [00:43.41]to [00:43.68]learn [00:44.16]today! | Top-chi qani, bugun o'rganish vaqti keldimi!
[00:46.51]Guess [00:46.87]what! | Topgin-chi
`,
    autoPlay = true,
    next
}) {
    const soundRef = useRef(null);
    const [status, setStatus] = useState(null);
    const [lyrics, setLyrics] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setLyrics(parseLRCtoWords(lrcText || ''));
    }, [lrcText]);

    useEffect(() => {
        loadSound();
        return () => {
            unloadSound();
        };
    }, [audioUri]);

    async function loadSound() {
        try {
            await unloadSound();
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: autoPlay },
                onPlaybackStatusUpdate
            );
            soundRef.current = sound;
            setIsFinished(false);
        } catch (e) {
            console.warn('Audio yuklashda xatolik', e);
        }
    }

    async function unloadSound() {
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
                setStatus(null);
            }
        } catch (e) { }
    }

    function onPlaybackStatusUpdate(playbackStatus) {
        setStatus(playbackStatus);
        if (playbackStatus?.positionMillis != null) {
            setCurrentTime(playbackStatus.positionMillis / 1000);
        }
        if (playbackStatus?.didJustFinish) {
            setIsFinished(true);
        }
    }

    function renderLine(line, idx) {
        return (
            <View key={idx} style={styles.lineWrap}>
                <Text style={styles.lineText}>
                    {line.words.map((w, i) => {
                        const isActive = currentTime >= w.time;
                        return (
                            <Text
                                key={i}
                                style={{
                                    color: isActive ? '#C200F3' : '#000',
                                    fontWeight: isActive ? 'bold' : 'normal'
                                }}
                            >
                                {w.text + ' '}
                            </Text>
                        );
                    })}
                </Text>
                {line.translation ? (
                    <Text style={styles.translationText}>{line.translation}</Text>
                ) : null}
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#f2f2fe', '#f9eaef', '#fef3ee']}
            style={{ flex: 1 }}
        >
            <ComponentTop text='Karaoke' />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    padding: 20
                }}
            >
                {lyrics.map((line, idx) => renderLine(line, idx))}

                {isFinished && (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#C200F3' }]}
                            onPress={() => loadSound()}
                        >
                            <Text style={styles.buttonText}>Takrorlash</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#FF4444' }]}
                            onPress={next}
                        >
                            <Text style={styles.buttonText}>Tugatish</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

function parseLRCtoWords(text) {
    if (!text) return [];
    const lineRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,2}))?\]([^\[]+)/g;
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    let result = [];

    lines.forEach(rawLine => {
        let words = [];
        let translation = '';
        const [mainPart, transPart] = rawLine.split('|').map(s => s.trim());
        if (transPart) translation = transPart;
        let matches = [...mainPart.matchAll(lineRegex)];

        matches.forEach(m => {
            const mm = parseInt(m[1], 10);
            const ss = parseInt(m[2], 10);
            const frac = m[3] ? parseInt(m[3].padEnd(2, '0'), 10) : 0;
            const time = mm * 60 + ss + frac / 100;
            const wordText = m[4].trim();
            if (wordText) {
                words.push({ text: wordText, time });
            }
        });

        if (words.length > 0) {
            result.push({ startTime: words[0].time, words, translation });
        }
    });

    return result;
}

const styles = StyleSheet.create({
    lineWrap: { paddingVertical: 8 },
    lineText: { fontSize: 24, textAlign: 'center', flexWrap: 'wrap' },
    translationText: {
        color: '#000000B2',
        fontSize: 18,
        marginTop: 2,
        textAlign: 'center'
    },
    buttonsContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
