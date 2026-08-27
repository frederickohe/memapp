import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEVICE_PIN_KEY = "ymca.member.device-pin";
export const PIN_LENGTH = 4;

export async function getDevicePinRecord() {
  try {
    const raw = await AsyncStorage.getItem(DEVICE_PIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.hash || !parsed?.salt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function hasDevicePin() {
  return Boolean(await getDevicePinRecord());
}

export async function saveDevicePin(pin, accountKey = "") {
  const salt = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 12)}`;
  const hash = await hashPin(pin, salt);
  const record = {
    hash,
    salt,
    accountKey: normalizeAccountKey(accountKey),
    createdAt: Date.now(),
  };
  await AsyncStorage.setItem(DEVICE_PIN_KEY, JSON.stringify(record));
  return record;
}

export async function verifyDevicePin(pin) {
  const record = await getDevicePinRecord();
  if (!record) return false;
  const hash = await hashPin(pin, record.salt);
  return hash === record.hash;
}

export async function clearDevicePin() {
  await AsyncStorage.removeItem(DEVICE_PIN_KEY);
}

export function pinMatchesAccount(record, accountKey) {
  if (!record) return false;
  if (!record.accountKey) return true;
  return record.accountKey === normalizeAccountKey(accountKey);
}

function normalizeAccountKey(accountKey) {
  return String(accountKey || "").trim().toLowerCase();
}

async function hashPin(pin, salt) {
  const payload = `${salt}:${pin}`;
  if (typeof globalThis.crypto?.subtle?.digest === "function") {
    const encoded = new TextEncoder().encode(payload);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
    return bytesToHex(new Uint8Array(digest));
  }
  return fallbackHash(payload);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fallbackHash(text) {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let round = 0; round < 128; round += 1) {
    const chunk = `${round}:${text}`;
    for (let i = 0; i < chunk.length; i += 1) {
      h1 ^= chunk.charCodeAt(i);
      h1 = Math.imul(h1, 0x01000193);
      h2 ^= chunk.charCodeAt(i) + round + i;
      h2 = Math.imul(h2, 16777619);
    }
  }
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}
