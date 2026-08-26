import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { ICON_LOADER } from "@/components/signupIcons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSignupStore } from "@/stores/useSignupStore";

const LOGO = require("@/assets/images/auth/ymca-africa-alliance.png");

let signupRequestStarted = false;

export default function ProcessingScreen() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);
  const token = useAuthStore((state) => state.token);
  const toFormPayload = useSignupStore((state) => state.toFormPayload);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const submit = async () => {
      if (token) {
        router.replace("/(onboarding)/success");
        return;
      }

      if (signupRequestStarted) return;
      signupRequestStarted = true;

      const form = toFormPayload();
      if (form.email) useAuthStore.getState().setEmail(form.email);
      if (form.phone) useAuthStore.getState().setPhone(form.phone);

      const result = await signUp(form);
      if (result.success) {
        router.replace("/(onboarding)/success");
        return;
      }

      signupRequestStarted = false;
      Alert.alert(
        "Sign up failed",
        result.error?.message || "Unable to complete sign up. Please try again.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    };

    submit();
  }, [router, signUp, toFormPayload, token]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      <View style={styles.loaderWrap}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <SvgXml xml={ICON_LOADER} width={100} height={100} />
        </Animated.View>
      </View>
      <Text style={styles.title}>Please Wait</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
    alignItems: "center",
  },
  logo: {
    marginTop: 49,
    width: 120,
    height: 48,
  },
  loaderWrap: {
    marginTop: 95,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 136,
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 24,
  },
});
