import { Stack } from "expo-router";
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
import { useAuthAccess } from "@/hooks/useAuthAccess";

applyGlobalLatoFont();
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

const SPLASH_SOURCE = require("@/assets/images/splash-screen.png");
const splashMeta =
  typeof Image.resolveAssetSource === "function"
    ? Image.resolveAssetSource(SPLASH_SOURCE)
    : null;
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
  const { hydrated, canAccessApp, canAccessOnboarding, canAccessAuth } =
    useAuthAccess();

  useEffect(() => {
    if (!fontsLoaded) return;

    SplashScreen.hideAsync();

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
  }, [fontsLoaded, fadeAnim, panAnim]);

  const splashTranslateX = panAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SPLASH_PAN_DISTANCE],
  });

  if (!fontsLoaded || !hydrated) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={canAccessApp}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="loading-profile"
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="news" />
          <Stack.Screen name="volunteer" />
          <Stack.Screen name="apply-volunteer-hours" />
          <Stack.Screen name="apply-volunteer-hours-form" />
          <Stack.Screen
            name="apply-volunteer-hours-success"
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="impact" />
          <Stack.Screen name="social" />
          <Stack.Screen name="connect" />
          <Stack.Screen name="connect-user" />
          <Stack.Screen name="connect-list" />
          <Stack.Screen name="connect-profile" />
          <Stack.Screen name="programs" />
          <Stack.Screen name="surveys" />
          <Stack.Screen name="affiliation" />
          <Stack.Screen name="payment-method" />
          <Stack.Screen name="pay-upi" />
          <Stack.Screen name="pay-card" />
          <Stack.Screen name="add-card" />
        </Stack.Protected>

        <Stack.Protected guard={canAccessOnboarding}>
          <Stack.Screen name="(onboarding)" />
        </Stack.Protected>

        <Stack.Protected guard={canAccessAuth}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
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
});
