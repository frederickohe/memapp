import { useState } from "react";
import {
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
import { PIN_LENGTH } from "@/lib/devicePin";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SetPinScreen() {
  const router = useRouter();
  const saveLocalPin = useAuthStore((state) => state.saveLocalPin);
  const [pin, setPin] = useState("");

  const isComplete = pin.length === PIN_LENGTH;

  const handleStart = async () => {
    if (!isComplete) return;
    await saveLocalPin(pin);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.headerBlock}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrap}>
                  <SvgXml xml={ICON_BACK} width={7.33} height={10} />
                </View>
              </TouchableOpacity>

              <View style={styles.carousel} pointerEvents="none">
                <View style={[styles.carouselSeg, styles.carouselRed]} />
                <View style={[styles.carouselSeg, styles.carouselLime]} />
                <View style={[styles.carouselSeg, styles.carouselLime]} />
              </View>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleStart}
                activeOpacity={isComplete ? 0.7 : 1}
              >
                <View style={[styles.iconWrap, styles.iconForward]}>
                  <SvgXml xml={ICON_BACK} width={7.33} height={10} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.headerText}>
              <Text style={styles.title}>Set pin</Text>
              <Text style={styles.subtitle}>PIN code to use during login</Text>
            </View>
          </View>

          <View style={styles.boxesWrap}>
            <PinCodeEntry value={pin} onChange={setPin} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.startButton, !isComplete && styles.startButtonDisabled]}
              onPress={handleStart}
              disabled={!isComplete}
              activeOpacity={0.85}
            >
              <Text style={styles.startLabel}>Start</Text>
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
  headerBlock: {
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4D8E0",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconForward: {
    transform: [{ scaleX: -1 }],
  },
  carousel: {
    width: 65,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#192126",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 1,
    gap: 1,
    overflow: "hidden",
  },
  carouselSeg: {
    height: 3,
    borderRadius: 5,
  },
  carouselRed: {
    flex: 1.5,
    backgroundColor: "#FF0000",
  },
  carouselLime: {
    flex: 1,
    backgroundColor: "#BBF246",
  },
  headerText: {
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
});
