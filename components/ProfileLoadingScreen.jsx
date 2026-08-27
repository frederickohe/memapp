import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SLIDES = [
  "Loading your profile…",
  "Fetching membership details…",
  "Preparing your dashboard…",
];

export default function ProfileLoadingScreen({ message }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();
    return () => spinLoop.stop();
  }, [spinAnim]);

  useEffect(() => {
    if (message) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSlideIndex((current) => (current + 1) % SLIDES.length);
        slideAnim.setValue(1);
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [fadeAnim, message, slideAnim]);

  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const slideTranslate = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [24, 0, -24],
  });

  const displayMessage = message || SLIDES[slideIndex];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode="cover"
        />

        <View style={styles.spinnerWrap}>
          <Animated.View
            style={[styles.spinnerRing, { transform: [{ rotate: spinRotate }] }]}
          />
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideTranslate }],
          }}
        >
          <Text style={styles.title}>{displayMessage}</Text>
        </Animated.View>

        <Text style={styles.subtitle}>
          Please wait while we load your account information.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20,
    marginBottom: 8,
  },
  spinnerWrap: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: "#e8e8e8",
    borderTopColor: "#1D3108",
    borderRightColor: "#8fa86a",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
});
