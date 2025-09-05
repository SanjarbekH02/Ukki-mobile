import { Audio } from "expo-av";

let soundObject = null;

export const audioPlay = async (url, onFinish) => {
    try {
        if (soundObject) {
            await soundObject.stopAsync();
            await soundObject.unloadAsync();
            soundObject = null;
        }

        const { sound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: true }
        );

        soundObject = sound;
        soundObject.setOnPlaybackStatusUpdate(async (status) => {
            if (status.didJustFinish) {
                if (onFinish) onFinish();
                await soundObject.unloadAsync();
                soundObject = null;
            }
        });
    } catch (error) {
        console.error("Audio play error:", error);
    }
};
