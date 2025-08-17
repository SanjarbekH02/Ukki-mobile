import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    Vibration,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function ErrorOverlay({
  visible = true,
  duration = 1500, // ms
  message = "Try again",
}) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (Platform.OS === "android") {
        Vibration.vibrate(200);
      } else {
        Vibration.vibrate([0, 200]);
      }

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ]),
        { iterations: 2 } 
      ).start();
    }
  }, [visible]);

  if (!visible) return null;

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.9],
  });

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none" 
    >
      <Animated.View style={[styles.glowContainer, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={["rgba(255,0,0,0.8)", "transparent"]}
          style={styles.top}
        />
        <LinearGradient
          colors={["rgba(255,0,0,0.8)", "transparent"]}
          style={styles.bottom}
        />
        <LinearGradient
          colors={["rgba(255,0,0,0.8)", "transparent"]}
          style={styles.left}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <LinearGradient
          colors={["rgba(255,0,0,0.8)", "transparent"]}
          style={styles.right}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
        />
      </Animated.View>

      {/* Markazdagi yozuv */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </View>
  );
}

const borderThickness = 20;

const styles = StyleSheet.create({
  glowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 1000,
  },
  top: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height: borderThickness,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width,
    height: borderThickness,
    transform: [{ rotate: "180deg" }],
  },
  left: {
    position: "absolute",
    top: 0,
    left: 0,
    width: borderThickness,
    height,
  },
  right: {
    position: "absolute",
    top: 0,
    right: 0,
    width: borderThickness,
    height,
  },
  messageContainer: {
    position: "absolute",
    top: "10%",
    left: "40%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  messageText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "red",
  },
});
