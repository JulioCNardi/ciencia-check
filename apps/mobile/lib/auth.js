import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "ciencia-check:session";

export async function saveSession(session) {
  await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function loadSession() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(KEY);
}
