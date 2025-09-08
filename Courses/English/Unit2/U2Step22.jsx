import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import ThreeButtons from '../../../components/Utils/ThreeButtons';
import Styles from '../../../Styles/Styles';

export default function U2Step22({next}) {
  const [playing, setPlaying] = useState(false);
  const [infoClick, setInfoClick] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [dictionary, setDictionary] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e7e7e7ff' }}>
         <ThreeButtons
                setDictionary={setDictionary}
                infoClick={infoClick}
                clicked={clicked}
                setClicked={setClicked}
                setInfoClick={setInfoClick}
                audioUrl="https://ukkibackend.soof.uz/media/audio/3f1db8dd-f552-4fd7-a4b4-4b522a8a2878.mp3"
            />
      <YoutubePlayer
        height={300} 
        width={'100%'}
        play={playing}
        videoId={"adVEWb4r4CI"} 
        onChangeState={event => console.log(event)}
      />
      <TouchableOpacity onPress={next} style={Styles.NextButton}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
