import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { ICON_BACK, ICON_EYE } from "@/components/authIcons";
import { navigateToAuthenticatedApp } from "@/lib/authNavigation";
import {
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
} from "@/lib/authValidation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleLogin = async () => {
    const email = normalizeEmail(username);
    if (!isValidEmail(email)) {
      setLocalError("Enter the email address for your account");
      return;
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      setLocalError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setLocalError("");
    clearError();
    const result = await signIn(email, password);
    if (result.success) {
      navigateToAuthenticatedApp(router);
    }
  };

  const canSubmit = Boolean(username.trim() && password && !isLoading);
  const displayError = localError || error;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
            <Text style={styles.title}>Log - In</Text>
            <Text style={styles.subtitle}>
              Fill in the fields with your account information
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputRow}>
              <Text style={styles.atPrefix}>@</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B1B2B4"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  if (localError) setLocalError("");
                }}
              />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B1B2B4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (localError) setLocalError("");
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((visible) => !visible)}
                style={styles.eyeButton}
                hitSlop={8}
              >
                <View style={styles.eyeIcon}>
                  <SvgXml xml={ICON_EYE} width={18} height={18} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}

          <TouchableOpacity onPress={() => {}} style={styles.forgotWrap}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.enterButton, !canSubmit && styles.enterButtonDisabled]}
              onPress={handleLogin}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.enterButtonText}>Enter</Text>
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
    backgroundColor: "#F4F4F6",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: "#232A3A",
    textAlign: "center",
    width: "100%",
  },
  form: {
    marginTop: 131,
    width: "100%",
    gap: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    gap: 8,
  },
  atPrefix: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 24,
    color: "#000000",
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 24,
    color: "#000000",
    padding: 0,
  },
  eyeButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  eyeIcon: {
    width: 18,
    height: 18,
    overflow: "hidden",
  },
  errorText: {
    marginTop: 12,
    fontSize: 13,
    color: "#c62828",
    textAlign: "center",
  },
  forgotWrap: {
    marginTop: 65,
    width: "100%",
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: "#232A3A",
    textAlign: "center",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
    width: "100%",
  },
  enterButton: {
    backgroundColor: "#000000",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  enterButtonDisabled: {
    opacity: 0.4,
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
