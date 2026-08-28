import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { SvgXml } from "react-native-svg";

import { ICON_BACK } from "@/components/authIcons";
import {
  ICON_CHAT,
  ICON_CHEVRON,
  ICON_CHEVRON_SM,
  ICON_FINGERPRINT,
  ICON_INFO,
  ICON_NOTIFICATION,
  ICON_PHONE,
} from "@/components/settingsIcons";
import {
  DEFAULT_SETTINGS,
  loadAppSettings,
  saveAppSettings,
} from "@/lib/appSettings";
import { useAuthStore } from "@/stores/useAuthStore";

const LANGUAGE_ICON = require("@/assets/images/settings/icon-language.png");
const SUPPORT_NUMBER = "1186";

function PinIcon() {
  return (
    <View style={styles.pinIcon}>
      <View style={styles.pinPad}>
        <View style={styles.pinDots}>
          <View style={styles.pinDot} />
          <View style={styles.pinDot} />
          <View style={styles.pinDot} />
        </View>
      </View>
    </View>
  );
}

function SettingsSwitch({ value, onValueChange }) {
  return (
    <TouchableOpacity
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.85}
      style={[styles.switchTrack, value ? styles.switchTrackOn : styles.switchTrackOff]}
    >
      <View
        style={[styles.switchKnob, value ? styles.switchKnobOn : styles.switchKnobOff]}
      />
    </TouchableOpacity>
  );
}

function SettingsRow({ icon, label, value, trailing, onPress }) {
  const body = (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      {trailing}
    </View>
  );

  if (!onPress) return body;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      {body}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState(DEFAULT_SETTINGS);
  const devicePinEnabled = useAuthStore((state) => state.devicePinEnabled);
  const disableLocalPin = useAuthStore((state) => state.disableLocalPin);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAppSettings().then((next) => {
        if (active) setPrefs(next);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const updatePref = (key, value) => {
    setPrefs((current) => {
      const next = { ...current, [key]: value };
      saveAppSettings(next).catch(() => {});
      return next;
    });
  };

  const handleChatSupport = () => {
    Alert.alert("Chat support", "Chat support will be available soon.");
  };

  const handleCallSupport = async () => {
    const url = `tel:${SUPPORT_NUMBER}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert("Unable to call", `Call ${SUPPORT_NUMBER} for support.`);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to call", `Call ${SUPPORT_NUMBER} for support.`);
    }
  };

  const handleAbout = () => {
    const version =
      Constants.expoConfig?.version || Constants.nativeAppVersion || "1.0.0";
    Alert.alert("About", `YMCA Ghana App\nVersion ${version}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <View style={styles.backIcon}>
              <SvgXml xml={ICON_BACK} width={7.33} height={10} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={
                <Image
                  source={LANGUAGE_ICON}
                  style={styles.languageIcon}
                  resizeMode="contain"
                />
              }
              label="App language"
              value={`(${prefs.language})`}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() => router.push("/select-language")}
            />
            <SettingsRow
              icon={<PinIcon />}
              label="PIN"
              trailing={
                <SettingsSwitch
                  value={devicePinEnabled}
                  onValueChange={(value) => {
                    if (value) {
                      router.push("/set-pin");
                      return;
                    }
                    disableLocalPin();
                  }}
                />
              }
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_FINGERPRINT} width={20} height={20} />}
              label="Touch ID"
              trailing={
                <SettingsSwitch
                  value={prefs.touchIdEnabled}
                  onValueChange={(value) => updatePref("touchIdEnabled", value)}
                />
              }
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_NOTIFICATION} width={20} height={20} />}
              label="Notifications"
              trailing={
                <SettingsSwitch
                  value={prefs.notificationsEnabled}
                  onValueChange={(value) =>
                    updatePref("notificationsEnabled", value)
                  }
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<SvgXml xml={ICON_CHAT} width={20} height={20} />}
              label="Chat support"
              trailing={<SvgXml xml={ICON_CHEVRON_SM} width={20} height={20} />}
              onPress={handleChatSupport}
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_PHONE} width={20} height={20} />}
              label="1186"
              value="Support"
              onPress={handleCallSupport}
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_INFO} width={20} height={20} />}
              label="About"
              trailing={<SvgXml xml={ICON_CHEVRON_SM} width={20} height={20} />}
              onPress={handleAbout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#B1B2B4",
  },
  group: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 46,
  },
  rowIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  languageIcon: {
    width: 16,
    height: 16,
  },
  rowText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  rowValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#B1B2B4",
  },
  pinIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pinPad: {
    width: 16,
    height: 10,
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  pinDots: {
    flexDirection: "row",
    gap: 1,
  },
  pinDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#000000",
  },
  switchTrack: {
    width: 43,
    height: 22,
    borderRadius: 16,
    padding: 1,
    justifyContent: "center",
  },
  switchTrackOff: {
    backgroundColor: "#F4F4F6",
    borderWidth: 1,
    borderColor: "#D4D8E0",
    padding: 0,
  },
  switchTrackOn: {
    backgroundColor: "#000000",
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  switchKnobOff: {
    alignSelf: "flex-start",
    backgroundColor: "#000000",
  },
  switchKnobOn: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
  },
});
