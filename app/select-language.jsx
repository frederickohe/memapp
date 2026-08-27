import { useCallback, useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";

import { ICON_BACK } from "@/components/authIcons";
import { RADIO_EMPTY } from "@/components/signupIcons";
import { RADIO_SELECTED_RED } from "@/components/settingsIcons";
import {
  APP_LANGUAGES,
  DEFAULT_SETTINGS,
  loadAppSettings,
  saveAppSettings,
} from "@/lib/appSettings";

function LanguageOption({ flag, label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.option, selected ? styles.optionSelected : styles.optionIdle]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={flag} style={styles.flag} resizeMode="cover" />
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
        {label}
      </Text>
      <View style={styles.radio}>
        {selected ? (
          <View style={styles.radioSelectedAsset}>
            <SvgXml xml={RADIO_SELECTED_RED} width={52} height={52} />
          </View>
        ) : (
          <View style={styles.radioIdleAsset}>
            <SvgXml xml={RADIO_EMPTY} width={24} height={24} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SelectLanguageScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState(DEFAULT_SETTINGS.language);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadAppSettings().then((prefs) => {
        if (active) setLanguage(prefs.language);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const handleSelect = async (id) => {
    setLanguage(id);
    const prefs = await loadAppSettings();
    await saveAppSettings({ ...prefs, language: id });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.headerBlock}>
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
            <Text style={styles.title}>App language</Text>
            <Text style={styles.subtitle}>
              You can change from the Settings section
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {APP_LANGUAGES.map((item) => (
            <LanguageOption
              key={item.id}
              flag={item.flag}
              label={item.label}
              selected={language === item.id}
              onPress={() => handleSelect(item.id)}
            />
          ))}
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
    paddingTop: 16,
    gap: 32,
  },
  headerBlock: {
    gap: 16,
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
  list: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 26,
    minHeight: 48,
    overflow: "visible",
  },
  optionIdle: {
    backgroundColor: "#FFFFFF",
  },
  optionSelected: {
    backgroundColor: "#000000",
  },
  flag: {
    width: 16,
    height: 16,
    borderRadius: 99,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  optionLabelSelected: {
    color: "#FFFFFF",
  },
  radio: {
    width: 24,
    height: 24,
    overflow: "visible",
  },
  radioIdleAsset: {
    width: 24,
    height: 24,
  },
  radioSelectedAsset: {
    position: "absolute",
    top: -8,
    left: -14,
    width: 52,
    height: 52,
  },
});
