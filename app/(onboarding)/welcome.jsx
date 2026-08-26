import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { BackHandler, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { ICON_BACK } from "@/components/authIcons";
import { SignupButton } from "@/components/SignupButton";
import { SignupVideoCard } from "@/components/SignupVideoCard";
import { useAuthStore } from "@/stores/useAuthStore";

export default function WelcomeScreen() {
  const router = useRouter();
  const setSignupInProgress = useAuthStore((state) => state.setSignupInProgress);

  const goBackToLogOrSign = useCallback(() => {
    setSignupInProgress(false);
    requestAnimationFrame(() => {
      router.replace("/(auth)/log-or-sign");
    });
    return true;
  }, [router, setSignupInProgress]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        goBackToLogOrSign
      );
      return () => subscription.remove();
    }, [goBackToLogOrSign])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBackToLogOrSign}
          activeOpacity={0.7}
        >
          <View style={styles.backIcon}>
            <SvgXml xml={ICON_BACK} width={7.33} height={10} />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Welcome to the Ymca Family</Text>
      <View style={styles.body}>
        <SignupVideoCard />
        <View style={styles.copy}>
          <Text style={styles.line}>
            Over 7 years of experience and advanced knowledge in the world of
            sports
          </Text>
          <Text style={styles.line}>
            Official coach of Realsoft and Impulse companies
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <SignupButton
          label="Get Started"
          onPress={() => router.push("/(onboarding)/stepper")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
    paddingHorizontal: 24,
  },
  topBar: {
    minHeight: 40,
    justifyContent: "center",
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4D8E0",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 56,
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
  },
  body: {
    marginTop: 86,
    gap: 16,
  },
  copy: {
    gap: 8,
  },
  line: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: "#232A3A",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 16,
  },
});
