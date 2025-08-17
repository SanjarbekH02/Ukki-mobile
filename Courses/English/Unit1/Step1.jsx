import { Image, Text, View } from 'react-native';
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import KaraokePlayer from '../../../Screens/Karaoke';
import Styles from '../../../Styles/Styles';

export default function Step1({setIsPlaying, isPlaying, next}) {
    return (
        <>
            {isPlaying ? <KaraokePlayer next={next}/> : (
                <View style={Styles.container}>
                    <Text style={Styles.title}>1.Hello</Text>
                    <Image style={Styles.ImgFull} source={require('../../../assets/images/1-sahifa.png')} />
                    <Image style={Styles.ImgFull} source={require('../../../assets/images/image.png')} />
                    <ThreeButtons setIsPlaying={setIsPlaying} playBtn={true} />
                </View>
            )}
        </>
    )
}
