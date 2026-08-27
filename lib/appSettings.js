import AsyncStorage from "@react-native-async-storage/async-storage";

export const SETTINGS_KEY = "ymca.member.settings";

export const DEFAULT_SETTINGS = {
  touchIdEnabled: true,
  notificationsEnabled: true,
  language: "English",
};

export const APP_LANGUAGES = [
  { id: "French", label: "Français", flag: require("@/assets/images/settings/flag-fr.png") },
  { id: "English", label: "English", flag: require("@/assets/images/settings/flag-gb.png") },
  { id: "Twi", label: "Twi", flag: require("@/assets/images/settings/flag-gh.png") },
];

export async function loadAppSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveAppSettings(next) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}
