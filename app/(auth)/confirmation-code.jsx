import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { getPostAuthRoute, useAuthStore } from "@/stores/useAuthStore";

const OTP_LENGTH = 5;

export default function ConfirmationCodeScreen() {
  const router = useRouter();
  const { intent: intentParam } = useLocalSearchParams();
  const intent = Array.isArray(intentParam) ? intentParam[0] : intentParam ?? "signup";
  const phone = useAuthStore((state) => state.phone);
  const email = useAuthStore((state) => state.email);
  const verifyOtpCode = useAuthStore((state) => state.verifyOtpCode);
  const sendOtp = useAuthStore((state) => state.sendOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [code, setCode] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const submitCode = async (fullCode) => {
    if (fullCode.length !== OTP_LENGTH || isLoading) return;

    clearError();
    const result = await verifyOtpCode(fullCode);
    if (result.success) {
      router.replace(getPostAuthRoute(intent));
    }
  };

  const handleCodeChange = (value) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setCode(digits);
    if (error) clearError();

    if (digits.length === OTP_LENGTH) {
      submitCode(digits);
    }
  };

  const handleConfirmation = async () => {
    await submitCode(code);
  };

  const handleResend = async () => {
    clearError();
    setCode("");
    inputRef.current?.focus();
    await sendOtp({ phone, email });
  };

  const isCodeComplete = code.length === OTP_LENGTH;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View>
              <Text style={styles.title}>Confirmation Code</Text>

              <Pressable style={styles.codeInputContainer} onPress={() => inputRef.current?.focus()}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                  const digit = code[index] ?? "";
                  const isActive = code.length === index;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.codeInput,
                        isActive && styles.codeInputActive,
                        digit !== "" && styles.codeInputFilled,
                      ]}
                    >
                      <Text style={[styles.codeDigit, !digit && styles.codeDigitEmpty]}>
                        {digit || "-"}
                      </Text>
                    </View>
                  );
                })}

                <TextInput
                  ref={inputRef}
                  value={code}
                  onChangeText={handleCodeChange}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
                  maxLength={OTP_LENGTH}
                  caretHidden
                  style={styles.hiddenInput}
                  editable={!isLoading}
                />
              </Pressable>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive a code? </Text>
                <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!isCodeComplete || isLoading) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmation}
              disabled={!isCodeComplete || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmation</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
  backButton: {
    fontSize: 24,
    color: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
    marginBottom: 32,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 24,
    position: "relative",
  },
  codeInput: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  codeInputActive: {
    borderColor: "#000",
  },
  codeInputFilled: {
    borderColor: "#bbb",
  },
  codeDigit: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
  },
  codeDigitEmpty: {
    color: "#ccc",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: "transparent",
  },
  errorText: {
    fontSize: 13,
    color: "#c62828",
    textAlign: "center",
    marginBottom: 12,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
  },
  resendLink: {
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "400",
  },
  confirmButton: {
    backgroundColor: "#000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
  },
});
