import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 3001;
const REQUEST_TIMEOUT_MS = 8000;

function getDevHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    Constants.expoGoConfig?.debuggerHost;
  if (!hostUri) return null;
  return String(hostUri).split(":")[0] || null;
}

function resolveApiUrl() {
  // Web no mesmo PC
  if (Platform.OS === "web") {
    return `http://localhost:${API_PORT}`;
  }

  // Expo Go / device: usa o IP da máquina no Wi‑Fi (não localhost)
  const host = getDevHost();
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:${API_PORT}`;
  }

  // Emulador Android
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${API_PORT}`;
  }

  const fromExtra = Constants.expoConfig?.extra?.apiUrl;
  return fromExtra || `http://localhost:${API_PORT}`;
}

const API_URL = resolveApiUrl();

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `Erro HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error(
        `API sem resposta em ${API_URL}. Rode "npm run api" no PC e use o mesmo Wi‑Fi.`
      );
    }
    if (err?.message === "Network request failed" || err?.message?.includes("Failed to fetch")) {
      throw new Error(
        `Não foi possível conectar em ${API_URL}. Confira se a API está no ar.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  url: API_URL,
  auth: (nickname, classCode) =>
    request("/api/auth", {
      method: "POST",
      body: JSON.stringify({ nickname, classCode }),
    }),
  me: (studentId) => request(`/api/student/me?studentId=${studentId}`),
  missions: (studentId) => request(`/api/missions?studentId=${studentId}`),
  challenges: (studentId) =>
    request(`/api/challenges?studentId=${studentId || ""}`),
  challenge: (id) => request(`/api/challenges/${id}`),
  submit: (payload) =>
    request("/api/challenges/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  leaderboard: (classCode) =>
    request(`/api/leaderboard?classCode=${encodeURIComponent(classCode)}`),
  learn: () => request("/api/learn"),
};
