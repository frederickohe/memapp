import { useEffect, useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export const OTP_LENGTH = 5;

export default function OtpCodeEntry({ value, onChange, editable = true }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable style={styles.codeInputContainer} onPress={() => inputRef.current?.focus()}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => {
        const digit = value[index] ?? "";
        const isActive = value.length === index;

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
        value={value}
        onChangeText={(next) => onChange(next.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        maxLength={OTP_LENGTH}
        caretHidden
        style={styles.hiddenInput}
        editable={editable}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
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
    backgroundColor: "#ffffff",
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
});
