import { useRouter } from "expo-router";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignupButton } from "@/components/SignupButton";

const LOGO = require("@/assets/images/auth/ymca-africa-alliance.png");

function SuccessMark() {
  return (
    <View style={styles.mark}>
      <View style={[styles.starArm, styles.starArmRotated]} />
      <View style={styles.starArm} />
      <View style={styles.checkShort} />
      <View style={styles.checkLong} />
    </View>
  );
}

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      <View style={styles.iconWrap}>
        <SuccessMark />
      </View>
      <Text style={styles.title}>{"Account Created\nSuccessfully!"}</Text>
      <View style={styles.footer}>
        <SignupButton
          label="Next"
          onPress={() => router.replace("/(onboarding)/entrance")}
        />
      </View>
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
  iconWrap: {
    marginTop: 125,
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
  },
  mark: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
  },
  starArm: {
    position: "absolute",
    width: 68,
    height: 68,
    backgroundColor: "#BBF246",
    borderRadius: 14,
  },
  starArmRotated: {
    transform: [{ rotate: "45deg" }],
  },
  checkShort: {
    position: "absolute",
    width: 18,
    height: 6,
    backgroundColor: "#191D1A",
    borderRadius: 3,
    left: 26,
    top: 50,
    transform: [{ rotate: "45deg" }],
  },
  checkLong: {
    position: "absolute",
    width: 34,
    height: 6,
    backgroundColor: "#191D1A",
    borderRadius: 3,
    left: 36,
    top: 44,
    transform: [{ rotate: "-45deg" }],
  },
  title: {
    marginTop: 112,
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    lineHeight: 30,
    paddingHorizontal: 24,
  },
  footer: {
    marginTop: "auto",
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
