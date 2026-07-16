import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    const cleanValue = value.replace(/[^0-9]/g, "");
    newCode[index] = cleanValue;
    setCode(newCode);

    if (cleanValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.nativeEvent.key === "Backspace") {
      if (!code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleConfirmation = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== OTP_LENGTH) return;

    clearError();
    const result = await verifyOtpCode(fullCode);
    if (result.success) {
      router.replace(getPostAuthRoute(intent));
    }
  };

  const handleResend = async () => {
    clearError();
    await sendOtp({ phone, email });
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View>
              <Text style={styles.title}>Confirmation Code</Text>

              <View style={styles.codeInputContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    key={index}
                    style={styles.codeInput}
                    maxLength={1}
                    keyboardType="numeric"
                    value={digit}
                    onChangeText={(value) => handleCodeChange(index, value)}
                    onKeyPress={(event) => handleKeyPress(index, event)}
                    placeholder="-"
                    placeholderTextColor="#ccc"
                  />
                ))}
              </View>

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
  },
  codeInput: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "400",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
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
