import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OnboardingButton } from "@/components/OnboardingFormComponents";

const SUCCESS_ICON = require("@/assets/images/volunteer/submission-success.png");

export default function SurveySuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = Array.isArray(params.title) ? params.title[0] : params.title;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Image source={SUCCESS_ICON} style={styles.heroIcon} resizeMode="contain" />
        <Text style={styles.mainMessage}>Thank you</Text>
        <Text style={styles.subtitle}>
          {title
            ? `Your response to ${title} has been submitted.`
            : "Your feedback was submitted successfully."}{" "}
          We read every response to improve your YMCA experience.
        </Text>
      </View>
      <View style={styles.footer}>
        <OnboardingButton
          label="Back to Surveys"
          onPress={() => router.replace("/surveys")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  heroIcon: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  mainMessage: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
});
