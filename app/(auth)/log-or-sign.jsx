import { useRouter } from "expo-router";
import {
  Image,
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
          {"Welcome to the \nYmca Member App"}
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
            onPress={() => {}}
          />
        </View>
      </View>
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
});
