import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { SignupButton } from "@/components/SignupButton";
import { isValidEmail, MIN_PASSWORD_LENGTH } from "@/lib/authValidation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSignupStore } from "@/stores/useSignupStore";

export default function Form0Screen() {
  const router = useRouter();
  const setEmail = useAuthStore((state) => state.setEmail);
  const setSignupInProgress = useAuthStore((state) => state.setSignupInProgress);
  const setField = useSignupStore((state) => state.setField);
  const stored = useSignupStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canContinue = Boolean(
    isValidEmail(stored.username) &&
      stored.firstName.trim() &&
      stored.lastName.trim() &&
      stored.password.length >= MIN_PASSWORD_LENGTH &&
      stored.password === stored.confirmPassword
  );

  const handleNext = () => {
    if (!canContinue) return;
    setEmail(stored.username.trim());
    setSignupInProgress(true);
    requestAnimationFrame(() => {
      router.replace("/(onboarding)/stepper");
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <View style={styles.backIcon}>
                <SvgXml xml={ICON_BACK} width={7.33} height={10} />
              </View>
            </TouchableOpacity>
            <View style={styles.carousel} pointerEvents="none">
              <View style={styles.carouselFill} />
            </View>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>Registration</Text>
            <Text style={styles.subtitle}>
              Fill in the fields with information about yourself
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputRow}>
              <Text style={styles.atPrefix}>@</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B1B2B4"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={stored.username}
                onChangeText={(value) => setField("username", value)}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.group}>
              <View style={[styles.inputRow, stored.firstName && styles.inputRowFilled]}>
                {stored.firstName ? (
                  <View style={styles.filledStack}>
                    <Text style={styles.floatingLabel}>First name</Text>
                    <TextInput
                      style={styles.filledInput}
                      value={stored.firstName}
                      onChangeText={(value) => setField("firstName", value)}
                    />
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    placeholderTextColor="#B1B2B4"
                    value={stored.firstName}
                    onChangeText={(value) => setField("firstName", value)}
                  />
                )}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor="#B1B2B4"
                  value={stored.lastName}
                  onChangeText={(value) => setField("lastName", value)}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.group}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Set password"
                  placeholderTextColor="#B1B2B4"
                  secureTextEntry={!showPassword}
                  value={stored.password}
                  onChangeText={(value) => setField("password", value)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((value) => !value)}
                  hitSlop={8}
                >
                  <View style={styles.eyeIcon}>
                    <SvgXml xml={ICON_EYE} width={18} height={18} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Rewrite password"
                  placeholderTextColor="#B1B2B4"
                  secureTextEntry={!showConfirm}
                  value={stored.confirmPassword}
                  onChangeText={(value) => setField("confirmPassword", value)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((value) => !value)}
                  hitSlop={8}
                >
                  <View style={styles.eyeIcon}>
                    <SvgXml xml={ICON_EYE} width={18} height={18} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {stored.username.trim().length > 0 && !isValidEmail(stored.username) ? (
            <Text style={styles.mismatch}>Enter a valid email address</Text>
          ) : null}

          {stored.password.length > 0 &&
          stored.password.length < MIN_PASSWORD_LENGTH ? (
            <Text style={styles.mismatch}>
              Password must be at least {MIN_PASSWORD_LENGTH} characters
            </Text>
          ) : null}

          {stored.confirmPassword.length > 0 &&
          stored.password !== stored.confirmPassword ? (
            <Text style={styles.mismatch}>Passwords do not match</Text>
          ) : null}

          <View style={styles.footer}>
            <SignupButton
              label="Next"
              onPress={handleNext}
              disabled={!canContinue}
            />
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  topBar: {
    minHeight: 40,
    justifyContent: "center",
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
  carousel: {
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    marginLeft: -32.5,
    top: 38,
    width: 65,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#192126",
    overflow: "hidden",
  },
  carouselFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FF0000",
    borderRadius: 5,
  },
  headerText: {
    marginTop: 48,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#232A3A",
    textAlign: "center",
  },
  form: {
    marginTop: 24,
    gap: 16,
  },
  group: {
    gap: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#D4D8E0",
    width: "100%",
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
  inputRowFilled: {
    paddingVertical: 7,
    minHeight: 48,
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
  filledStack: {
    flex: 1,
  },
  floatingLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: "#B1B2B4",
  },
  filledInput: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    color: "#000000",
    padding: 0,
  },
  eyeIcon: {
    width: 18,
    height: 18,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
  },
  mismatch: {
    marginTop: 8,
    fontSize: 13,
    color: "#c62828",
    textAlign: "center",
  },
});
