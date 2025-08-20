import { StyleSheet } from 'react-native'
import KaraokePlayer from '../../../Screens/Karaoke'

export default function Step14({next}) {
    return (
        <>
            <KaraokePlayer
            next={next}
                audioUri="https://ukkibackend.soof.uz/media/audio/e897f0b6-13e9-40e3-8ef4-566a6e782b4b.mp3"
                lrcText={`
                    [00:10.31]Red, [00:12.71]yellow, [00:13.51]green, [00:13.77]and [00:14.03]blue, [00:14.82]Pink,[00:15.36]orange, [00:15.62]and [00:15.91]purple.
[00:17.22]What’s [00:18.03]your [00:18.57]favorite [00:19.89]color? 
[00:22.54]Red, [00:23.34]yellow, [00:23.88]green, [00:24.41]and [00:24.68]blue, [00:25.47]Pink, [00:26.00]orange, [00:26.27]and [00:26.79]purple.
[00:27.86]What’s [00:28.66]your [00:29.45]favorite [00:29.98]color?
[00:33.17]My [00:33.44]favorite [00:34.77]color’s [00:36.09]red. [00:37.16]Yes! [00:38.72]My [00:38.98]favorite[00:40.04]color’s [00:41.37]red.
[00:51.99]Red, [00:52.79]yellow, [00:53.59]green, [00:53.85]and [00:54.12]blue, [00:54.66]Pink, [00:55.46]orange, [00:55.72]and [00:55.98]purple.
[00:57.31]What’s [00:58.11]your [00:58.64]favorite [00:59.69]color? 
[01:02.84]Red, [01:03.38]yellow, [01:03.91]green, [01:04.44]and [01:04.72]blue, [01:05.51]Pink, [01:06.05]orange, [01:06.31]and [01:06.59]purple.
[01:07.90]What’s [01:08.70]your [01:09.50]favorite [01:10.30]color?
[01:13.18]My [01:13.44]favorite [01:14.51]color’s [01:15.84]green. [01:17.17]Yes! [01:18.49]My [01:18.77]favorite [01:19.83]color’s [01:21.15]green.
[01:32.05]Red, [01:32.57]yellow, [01:33.39]green, [01:33.65]and [01:33.91]blue, [01:34.71]Pink, [01:35.51]orange, [01:35.78]and [01:36.04]purple.
[01:37.10]What’s [01:37.90]your [01:38.70]favorite [01:39.76]color?
[01:42.69]Red, [01:43.48]yellow, [01:44.01]green, [01:44.29]and [01:44.55]blue, [01:45.34]Pink, [01:45.88]orange, [01:46.40]and [01:46.67]purple.
[01:47.97]What’s [01:48.77]your [01:49.30]favorite [01:50.36]color? 
[01:53.01]My [01:53.55]favorite [01:54.61]color’s [01:55.94]purple. [01:57.27]Yes! [01:58.33]My [01:58.86]favorite [01:59.92]color’s[02:01.25]purple.`}
            />
        </>
    )
}

const styles = StyleSheet.create({})