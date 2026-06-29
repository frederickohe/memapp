import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "react-native-reanimated";
import { LATO_FONTS, applyGlobalLatoFont } from "@/components/latoFont";

// Make Lato the app-wide default font for every Text / TextInput.
applyGlobalLatoFont();
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

// Landscape splash image. Scale it to fill the screen height, which makes it
// wider than the screen so it can be panned left-to-right to reveal the full image.
const SPLASH_SOURCE = require("@/assets/images/splash-screen.png");
const splashMeta = Image.resolveAssetSource(SPLASH_SOURCE);
const splashRatio =
  splashMeta && splashMeta.width && splashMeta.height
    ? splashMeta.width / splashMeta.height
    : 1024 / 537;
const SPLASH_IMAGE_WIDTH = Math.max(width, splashRatio * height);
const SPLASH_PAN_DISTANCE = Math.max(0, SPLASH_IMAGE_WIDTH - width);
const SPLASH_PAN_DURATION = 6000;

export const unstable_settings = {
  anchor: "(auth)",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts(LATO_FONTS);
  const [splashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const panAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsLoaded) return;

    // Hide the native splash once fonts are ready, then run the custom splash.
    SplashScreen.hideAsync();

    // Slowly pan the landscape image from left to right so the user sees all of
    // it, then fade the splash out.
    const animation = Animated.timing(panAnim, {
      toValue: 1,
      duration: SPLASH_PAN_DURATION,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    animation.start(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setSplashVisible(false);
      });
    });

    return () => animation.stop();
  }, [fontsLoaded]);

  const splashTranslateX = panAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SPLASH_PAN_DISTANCE],
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="news" options={{ headerShown: false }} />
        <Stack.Screen name="impact" options={{ headerShown: false }} />
        <Stack.Screen name="connect" options={{ headerShown: false }} />
        <Stack.Screen name="connect-user" options={{ headerShown: false }} />
        <Stack.Screen name="connect-list" options={{ headerShown: false }} />
        <Stack.Screen name="connect-profile" options={{ headerShown: false }} />
        <Stack.Screen name="programs" options={{ headerShown: false }} />
        <Stack.Screen name="surveys" options={{ headerShown: false }} />
        <Stack.Screen name="affiliation" options={{ headerShown: false }} />
        <Stack.Screen name="payment-method" options={{ headerShown: false }} />
        <Stack.Screen name="pay-upi" options={{ headerShown: false }} />
        <Stack.Screen name="pay-card" options={{ headerShown: false }} />
        <Stack.Screen name="add-card" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />

      {splashVisible && (
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <Animated.Image
            source={SPLASH_SOURCE}
            style={[
              styles.splashImage,
              {
                width: SPLASH_IMAGE_WIDTH,
                height,
                transform: [{ translateX: splashTranslateX }],
              },
            ]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
            locations={[0, 0.675, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.splashOverlay}
          />
          <View style={styles.splashTextWrapper}>
            <Text style={styles.splashWelcome}>Welcome to</Text>
            <Text style={styles.splashTitle}>YMCA Ghana</Text>
            <Text style={styles.splashSubtitle}>
              National Youth Conference
            </Text>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "#000000",
    overflow: "hidden",
    zIndex: 9999,
  },
  splashImage: {
    height: "100%",
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  splashTextWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingHorizontal: 28,
    paddingBottom: 64,
  },
  splashWelcome: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 6,
  },
  splashTitle: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  splashSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1,
    marginTop: 8,
  },
});
