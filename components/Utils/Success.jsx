// ConfettiEffect.js
import { Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function ConfettiEffect() {
    const { width } = Dimensions.get("window");

    return (
        <>
            <ConfettiCannon
                count={40}
                origin={{ x: 0, y: 0 }}
                fadeOut={true}
                fallSpeed={500}
                explosionSpeed={350}
            />
            <ConfettiCannon
                count={40}
                origin={{ x: width, y: 0 }}
                fadeOut={true}
                fallSpeed={500}
                explosionSpeed={500}
            />
        </>
    );
}
