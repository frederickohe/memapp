import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "memapp.pendingSurveyId";

let memoryId = null;

export function surveyIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/surveys\/([^/?#]+)/i);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function rememberPendingSurvey(formId) {
  if (!formId) return;
  memoryId = formId;
  await AsyncStorage.setItem(STORAGE_KEY, formId);
}

export async function peekPendingSurvey() {
  if (memoryId) return memoryId;
  memoryId = await AsyncStorage.getItem(STORAGE_KEY);
  return memoryId;
}

export async function consumePendingSurvey() {
  const id = await peekPendingSurvey();
  memoryId = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
  return id;
}
