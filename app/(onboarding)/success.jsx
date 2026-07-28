import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigateToAuthenticatedApp } from "@/lib/authNavigation";

const CIRCLE_SIZE = 130;

/**
 * Success Screen — shown after all onboarding forms are completed.
 * 
 * Phase 1 (0–2.2s): Green-tinted spinner with "Setting up your account…" text.
 * Phase 2 (2.2s+):  Spinner fades out, green circle pops in with animated ✓,
 *                   followed by success text. Auto-navigates to main tabs at ~5.4s.
 */
export default function SuccessScreen() {
  const router = useRouter();

  const [phase, setPhase] = useState("loading"); // "loading" | "success"

  // ── Spinner ──
  const spinAnim = useRef(new Animated.Value(0)).current;

  // ── Success circle & check ──
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;

  // Checkmark: we use two Animated.Values to drive the scaleX of each leg
  const checkShort = useRef(new Animated.Value(0)).current; // short downstroke (first)
  const checkLong = useRef(new Animated.Value(0)).current;  // long upstroke (second)

  // Text
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Container fade-in
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in container
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    // Start spinner loop
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 850,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // Transition to success after 2.2s
    const timer = setTimeout(() => {
      spinLoop.stop();
      setPhase("success");

      Animated.sequence([
        // Circle pops in
        Animated.parallel([
          Animated.spring(circleScale, {
            toValue: 1,
            tension: 55,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(circleOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Small pause then draw short leg first
        Animated.delay(100),
        Animated.timing(checkShort, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Then draw long leg second
        Animated.timing(checkLong, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Fade in success text
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Navigate to main app after ~3.2s of success animation
      const navTimer = setTimeout(() => {
        navigateToAuthenticatedApp(router);
      }, 3200);
      return () => clearTimeout(navTimer);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Calculate local translations to pivot scale from center to left edge
  const checkShortTranslate = checkShort.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0], // W_s / 2 = 36 / 2
  });

  const checkLongTranslate = checkLong.interpolate({
    inputRange: [0, 1],
    outputRange: [-34, 0], // W_l / 2 = 68 / 2
  });

  return (
    <SafeAreaView style={styles.container}>

      <View>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          </View>
      </View>
      <Animated.View style={[styles.inner, { opacity: containerOpacity }]}>

        {/* ── LOADING PHASE ── */}
        {phase === "loading" && (
          <View style={styles.phaseBox}>
            <View style={styles.spinnerWrapper}>
              <Animated.View
                style={[styles.spinnerRing, { transform: [{ rotate: spinRotate }] }]}
              />
            </View>
            <Text style={styles.loadingTitle}>Setting up your account…</Text>
            <Text style={styles.loadingBody}>
              Please wait a moment while we get everything ready for you.
            </Text>
          </View>
        )}

        {/* ── SUCCESS PHASE ── */}
        {phase === "success" && (
          <View style={styles.phaseBox}>
            {/* Green circle */}
            <Animated.View
              style={[
                styles.successCircle,
                {
                  opacity: circleOpacity,
                  transform: [{ scale: circleScale }],
                },
              ]}
            >
              {/* Short leg (draws down-right to the joint) */}
              <Animated.View
                style={[
                  styles.checkmarkLeg,
                  {
                    width: 36,
                    left: 22,
                    top: 56,
                    transform: [
                      { rotate: "45deg" },
                      { translateX: checkShortTranslate },
                      { scaleX: checkShort },
                    ],
                  },
                ]}
              />

              {/* Long leg (draws up-right from the joint) */}
              <Animated.View
                style={[
                  styles.checkmarkLeg,
                  {
                    width: 68,
                    left: 43,
                    top: 45,
                    transform: [
                      { rotate: "-45deg" },
                      { translateX: checkLongTranslate },
                      { scaleX: checkLong },
                    ],
                  },
                ]}
              />
            </Animated.View>

            {/* ── Success text ── */}
            <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
              <Text style={styles.successTitle}>You're all set! 🎉</Text>
              <Text style={styles.successBody}>
                Your YMCA account has been created successfully.{"\n"}Welcome to the family!
              </Text>
            </Animated.View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  phaseBox: {
    alignItems: "center",
    gap: 28,
  },

  // ─ Spinner ─
  spinnerWrapper: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerRing: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: "#e0e0e0",
    borderTopColor: "#4CAF50",
    borderRightColor: "#a5d6a7",
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
  },
  loadingBody: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    lineHeight: 21,
  },

  // ─ Success circle ─
  successCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#43A047",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#43A047",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 12,
  },

  // ─ Checkmark legs ─
  checkmarkLeg: {
    position: "absolute",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },

  // ─ Text ─
  textBlock: {
    alignItems: "center",
    gap: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "400",
    color: "#111",
    textAlign: "center",
  },
  successBody: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },
    logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    marginBottom: 12,
  },
});
