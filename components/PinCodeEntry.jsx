import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useSplashVisible } from "@/hooks/useSplashVisible";
import { PIN_LENGTH } from "@/lib/devicePin";

export function PinCodeEntry({ value, onChange, error, autoFocus = true }) {
  const inputRef = useRef(null);
  const screenFocused = useIsFocused();
  const splashVisible = useSplashVisible();

  useEffect(() => {
    if (!autoFocus || !screenFocused || splashVisible) return undefined;
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [autoFocus, screenFocused, splashVisible]);

  return (
    <View>
      <Pressable style={styles.boxes} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => {
          const digit = value[index] ?? "";
          return (
            <View key={index} style={[styles.box, error && styles.boxError]}>
              {digit ? <Text style={styles.digit}>{digit}</Text> : null}
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={(next) =>
            onChange(next.replace(/[^0-9]/g, "").slice(0, PIN_LENGTH))
          }
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={PIN_LENGTH}
          caretHidden
          showSoftInputOnFocus={!splashVisible}
          style={styles.hiddenInput}
        />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  boxes: {
    flexDirection: "row",
    gap: 2,
    position: "relative",
  },
  box: {
    flex: 1,
    height: 48,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  boxError: {
    borderWidth: 1,
    borderColor: "#FF0000",
  },
  digit: {
    fontSize: 16,
    fontWeight: "500",
    color: "#232A3A",
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: "transparent",
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: "#c62828",
    textAlign: "center",
  },
});
