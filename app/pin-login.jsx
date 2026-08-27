import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { SvgXml } from "react-native-svg";

import { ICON_BACK } from "@/components/authIcons";
import { PinCodeEntry } from "@/components/PinCodeEntry";
import { navigateToAuthenticatedApp, navigateToSignedOutApp } from "@/lib/authNavigation";
import { PIN_LENGTH } from "@/lib/devicePin";
import { useAuthStore } from "@/stores/useAuthStore";

export default function PinLoginScreen() {
  const router = useRouter();
  const unlockWithPin = useAuthStore((state) => state.unlockWithPin);
  const signOut = useAuthStore((state) => state.signOut);
  const logoutToWelcome = useAuthStore((state) => state.logoutToWelcome);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const isComplete = pin.length === PIN_LENGTH;
  const canSubmit = isComplete && !isLoading;

  const handleChange = (value) => {
    setPin(value);
    if (error) setError("");
  };

  const handleEnter = async () => {
    if (!canSubmit) return;
    const result = await unlockWithPin(pin);
    if (result.success) {
      navigateToAuthenticatedApp(router);
      return;
    }

    setPin("");
    if (result.reason === "refresh") {
      await signOut({ clearPin: false });
      setError("Your session expired. Log in with email and password.");
      router.replace("/(auth)/login?intent=login");
      return;
    }

    setError("Incorrect PIN. Try again.");
  };

  const handleBack = async () => {
    await logoutToWelcome();
    navigateToSignedOutApp(router);
  };

  const handleUsePassword = async () => {
    await signOut({ clearPin: true });
    navigateToSignedOutApp(router);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <View style={styles.backIcon}>
              <SvgXml xml={ICON_BACK} width={7.33} height={10} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Enter pin</Text>
            <Text style={styles.subtitle}>PIN code to use during login</Text>
          </View>

          <View style={styles.boxesWrap}>
            <PinCodeEntry value={pin} onChange={handleChange} error={error} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.startButton, !canSubmit && styles.startButtonDisabled]}
              onPress={handleEnter}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.startLabel}>Enter</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUsePassword} style={styles.forgotWrap}>
              <Text style={styles.forgot}>Forgot PIN? Use email and password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
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
    overflow: "hidden",
  },
  headerText: {
    marginTop: 48,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#192126",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
    color: "#000000",
  },
  boxesWrap: {
    marginTop: 32,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
    paddingBottom: 8,
  },
  startButton: {
    backgroundColor: "#192126",
    borderRadius: 999,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  startButtonDisabled: {
    opacity: 0.56,
  },
  startLabel: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#FFFFFF",
  },
  forgotWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  forgot: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: "#232A3A",
    textAlign: "center",
  },
});
