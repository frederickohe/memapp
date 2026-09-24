import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { useAuthStore } from "@/stores/useAuthStore";
import {
  ICON_DONATE,
  ICON_LOGIN,
  ICON_SIGN_UP,
  RADIO_SELECTED,
  RADIO_UNSELECTED,
} from "@/components/authIcons";

const LOGO = require("@/assets/images/auth/ymca-africa-alliance.png");

function OptionButton({
  iconXml,
  iconSize = 24,
  label,
  selected = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, selected ? styles.buttonSelected : styles.buttonIdle]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconWrap, { width: iconSize, height: iconSize }]}>
        <SvgXml xml={iconXml} width={iconSize} height={iconSize} />
      </View>
      <Text
        style={[styles.buttonLabel, selected && styles.buttonLabelSelected]}
      >
        {label}
      </Text>
      <View style={styles.radio}>
        {selected ? (
          <View style={styles.radioSelectedAsset}>
            <SvgXml xml={RADIO_SELECTED} width={52} height={52} />
          </View>
        ) : (
          <View style={styles.radioUnselectedAsset}>
            <SvgXml xml={RADIO_UNSELECTED} width={20} height={20} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function LogOrSignScreen() {
  const router = useRouter();
  const [donateSoon, setDonateSoon] = useState(false);
  const setAuthIntent = useAuthStore((state) => state.setAuthIntent);
  const setSignupInProgress = useAuthStore((state) => state.setSignupInProgress);
  const signOut = useAuthStore((state) => state.signOut);
  const resumePinLogin = useAuthStore((state) => state.resumePinLogin);
  const token = useAuthStore((state) => state.token);
  const devicePinEnabled = useAuthStore((state) => state.devicePinEnabled);

  const handleSignUp = async () => {
    if (token) {
      await signOut();
    }
    setAuthIntent("signup");
    setSignupInProgress(true);
    requestAnimationFrame(() => {
      router.replace("/(onboarding)/welcome");
    });
  };

  const handleLogin = () => {
    setAuthIntent("login");
    if (devicePinEnabled && token) {
      resumePinLogin();
      router.replace("/pin-login");
      return;
    }
    router.push("/(auth)/login?intent=login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <Text style={styles.welcomeText}>
          {"Welcome to the \nYMCA Member App"}
        </Text>

        <View style={styles.actions}>
          <View style={styles.authActions}>
            <OptionButton
              iconXml={ICON_SIGN_UP}
              label="Sign Up"
              onPress={handleSignUp}
            />
            <OptionButton
              iconXml={ICON_LOGIN}
              label="Login"
              selected
              onPress={handleLogin}
            />
          </View>

          <OptionButton
            iconXml={ICON_DONATE}
            iconSize={20}
            label="Donate"
            onPress={() => setDonateSoon(true)}
          />
        </View>
      </View>

      <Modal
        visible={donateSoon}
        transparent
        animationType="fade"
        onRequestClose={() => setDonateSoon(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDonateSoon(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalIcon}>
              <SvgXml xml={ICON_DONATE} width={22} height={22} />
            </View>
            <Text style={styles.modalTitle}>Coming soon</Text>
            <Text style={styles.modalBody}>
              Donations are not open yet. We will let you know as soon as giving is available in the app.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.85}
              onPress={() => setDonateSoon(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 61,
  },
  logo: {
    width: 190,
    height: 76,
    alignSelf: "center",
    borderRadius: 5,
  },
  welcomeText: {
    marginTop: 61,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 21,
    color: "#232A3A",
    textAlign: "center",
  },
  actions: {
    marginTop: 106,
    width: "100%",
    gap: 71,
  },
  authActions: {
    width: "100%",
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 26,
    width: "100%",
    minHeight: 48,
    overflow: "visible",
  },
  buttonIdle: {
    backgroundColor: "#FFFFFF",
  },
  buttonSelected: {
    backgroundColor: "#000000",
  },
  iconWrap: {
    overflow: "hidden",
  },
  buttonLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 24,
    color: "#000000",
  },
  buttonLabelSelected: {
    color: "#FFFFFF",
  },
  radio: {
    width: 24,
    height: 24,
    overflow: "visible",
  },
  radioUnselectedAsset: {
    position: "absolute",
    top: 2,
    left: 2,
    width: 20,
    height: 20,
  },
  radioSelectedAsset: {
    position: "absolute",
    top: -8,
    left: -14,
    width: 52,
    height: 52,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 17, 17, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: "center",
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F4F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#111111",
  },
  modalBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
    textAlign: "center",
  },
  modalButton: {
    marginTop: 18,
    width: "100%",
    height: 46,
    borderRadius: 23,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
