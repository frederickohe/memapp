import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import OtpCodeEntry, { OTP_LENGTH } from "@/components/OtpCodeEntry";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/stores/useAuthStore";

export default function EnableTwoFactorScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const destination = useAuthStore((state) => state.twoFactorDestination);
  const confirmTwoFactor = useAuthStore((state) => state.confirmTwoFactor);
  const requestTwoFactor = useAuthStore((state) => state.requestTwoFactor);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [code, setCode] = useState("");

  const submitCode = async (fullCode) => {
    if (fullCode.length !== OTP_LENGTH || isLoading) return;
    clearError();
    const result = await confirmTwoFactor(fullCode);
    if (result.success) {
      router.back();
    }
  };

  const handleChange = (digits) => {
    setCode(digits);
    if (error) clearError();
    if (digits.length === OTP_LENGTH) {
      void submitCode(digits);
    }
  };

  const handleResend = async () => {
    clearError();
    setCode("");
    await requestTwoFactor();
  };

  const isComplete = code.length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.backIcon}>
              <SvgXml xml={ICON_BACK} width={7.33} height={10} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>{t("settings.twoFactorTitle")}</Text>
            <Text style={styles.subtitle}>
              {destination
                ? t("settings.twoFactorBody", { destination })
                : t("settings.twoFactorBodyPlain")}
            </Text>
          </View>

          <OtpCodeEntry value={code} onChange={handleChange} editable={!isLoading} />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>{t("settings.twoFactorMissing")} </Text>
            <TouchableOpacity onPress={handleResend} disabled={isLoading}>
              <Text style={styles.resendLink}>{t("settings.twoFactorResend")}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, (!isComplete || isLoading) && styles.confirmButtonDisabled]}
            onPress={() => void submitCode(code)}
            disabled={!isComplete || isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>{t("settings.twoFactorConfirm")}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
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
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B6C6E",
  },
  errorText: {
    marginTop: 16,
    fontSize: 13,
    color: "#c62828",
    textAlign: "center",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendLink: {
    fontSize: 14,
    color: "#0066cc",
  },
  confirmButton: {
    marginTop: 32,
    backgroundColor: "#000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
