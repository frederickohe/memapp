import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context"

export default function ConfirmationCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    const cleanValue = value.replace(/[^0-9]/g, "");
    newCode[index] = cleanValue;
    setCode(newCode);

    // Auto move to next input if a digit is entered
    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.nativeEvent.key === "Backspace") {
      if (!code[index] && index > 0) {
        // If current field is empty, clear the previous field and focus it
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleConfirmation = () => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      // Navigate to main app
      router.replace("/(onboarding)/welcome");
    }
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

              <View style={styles.phoneDisplay}>
                <Text style={styles.phone}>+1 000 99 972 32 26</Text>
                <TouchableOpacity>
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              </View>

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

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive a code? </Text>
                <TouchableOpacity>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !isCodeComplete && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirmation}
              disabled={!isCodeComplete}
            >
              <Text style={styles.confirmButtonText}>Confirmation</Text>
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
    marginBottom: 24,
  },
  phoneDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  phone: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  editIcon: {
    fontSize: 18,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
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
