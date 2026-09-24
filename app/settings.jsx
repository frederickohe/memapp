import { useState } from "react";
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
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { Trash2, UserRound } from "lucide-react-native";
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
import { navigateToSignedOutApp } from "@/lib/authNavigation";
import { useI18n } from "@/lib/i18n";
import { LEGAL_URLS } from "@/lib/legalUrls";
import { useAuthStore } from "@/stores/useAuthStore";

const LANGUAGE_ICON = require("@/assets/images/settings/icon-language.png");
const SUPPORT_NUMBER_DISPLAY = "+233 (0) 302 224700";
const SUPPORT_NUMBER_DIAL = "+233302224700";

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

function SettingsRow({ icon, label, value, trailing, onPress, danger, disabled }) {
  const body = (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      </View>
      {trailing}
    </View>
  );

  if (!onPress) return body;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} disabled={disabled}>
      {body}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { t, language } = useI18n();
  const devicePinEnabled = useAuthStore((state) => state.devicePinEnabled);
  const disableLocalPin = useAuthStore((state) => state.disableLocalPin);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleChatSupport = () => {
    Alert.alert(t("settings.chatTitle"), t("settings.chatSoon"));
  };

  const handleComingSoon = (titleKey, bodyKey) => {
    Alert.alert(t(titleKey), t(bodyKey));
  };

  const handleCallSupport = async () => {
    const url = `tel:${SUPPORT_NUMBER_DIAL}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(
          t("settings.unableToCall"),
          t("settings.callFallback", { number: SUPPORT_NUMBER_DISPLAY })
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        t("settings.unableToCall"),
        t("settings.callFallback", { number: SUPPORT_NUMBER_DISPLAY })
      );
    }
  };

  const handleAbout = () => {
    const version =
      Constants.expoConfig?.version || Constants.nativeAppVersion || "1.0.0";
    Alert.alert(
      t("settings.aboutTitle"),
      t("settings.aboutBody", { version })
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(t("settings.deleteConfirmTitle"), t("settings.deleteConfirmBody"), [
      { text: t("settings.deleteCancel"), style: "cancel" },
      {
        text: t("settings.deleteConfirm"),
        style: "destructive",
        onPress: () => {
          void performDeleteAccount();
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    if (deletingAccount) return;
    Alert.alert(t("settings.deleteTitle"), t("settings.deleteBody"), [
      { text: t("settings.deleteCancel"), style: "cancel" },
      {
        text: t("settings.deleteContinue"),
        style: "destructive",
        onPress: () => {
          setTimeout(confirmDeleteAccount, 350);
        },
      },
    ]);
  };

  const performDeleteAccount = async () => {
    setDeletingAccount(true);
    const result = await deleteAccount();
    setDeletingAccount(false);
    if (!result.success) {
      Alert.alert(
        t("settings.deleteFailed"),
        result.error?.message || t("settings.deleteFailed")
      );
      return;
    }
    navigateToSignedOutApp(router);
  };

  const openLegalPage = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert(t("settings.unableLink"), url);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(t("settings.unableLink"), url);
    }
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
          <Text style={styles.sectionTitle}>{t("settings.profile")}</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<UserRound size={18} color="#000000" />}
              label={t("settings.editProfile")}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() => router.push("/edit-profile")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.section")}</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={
                <Image
                  source={LANGUAGE_ICON}
                  style={styles.languageIcon}
                  resizeMode="contain"
                />
              }
              label={t("settings.language")}
              value={`(${language})`}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() => router.push("/select-language")}
            />
            <SettingsRow
              icon={<PinIcon />}
              label={t("settings.pin")}
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
              label={t("settings.touchId")}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() =>
                handleComingSoon("settings.touchSoonTitle", "settings.touchSoon")
              }
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_NOTIFICATION} width={20} height={20} />}
              label={t("settings.notifications")}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() =>
                handleComingSoon(
                  "settings.notifySoonTitle",
                  "settings.notifySoon"
                )
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.support")}</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<SvgXml xml={ICON_CHAT} width={20} height={20} />}
              label={t("settings.chat")}
              trailing={<SvgXml xml={ICON_CHEVRON_SM} width={20} height={20} />}
              onPress={handleChatSupport}
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_PHONE} width={20} height={20} />}
              label={SUPPORT_NUMBER_DISPLAY}
              value={t("settings.supportValue")}
              onPress={handleCallSupport}
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_INFO} width={20} height={20} />}
              label={t("settings.about")}
              trailing={<SvgXml xml={ICON_CHEVRON_SM} width={20} height={20} />}
              onPress={handleAbout}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.legal")}</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<SvgXml xml={ICON_INFO} width={20} height={20} />}
              label={t("settings.privacy")}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() => void openLegalPage(LEGAL_URLS.privacy)}
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_INFO} width={20} height={20} />}
              label={t("settings.terms")}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() => void openLegalPage(LEGAL_URLS.terms)}
            />
            <SettingsRow
              icon={<SvgXml xml={ICON_INFO} width={20} height={20} />}
              label={t("settings.deletePolicy")}
              trailing={<SvgXml xml={ICON_CHEVRON} width={24} height={24} />}
              onPress={() => void openLegalPage(LEGAL_URLS.accountDeletion)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.account")}</Text>
          <View style={styles.group}>
            <SettingsRow
              icon={<Trash2 size={18} color="#B42318" />}
              label={deletingAccount ? t("settings.deleteWorking") : t("settings.deleteAccount")}
              danger
              disabled={deletingAccount}
              onPress={handleDeleteAccount}
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
  rowLabelDanger: {
    color: "#B42318",
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
