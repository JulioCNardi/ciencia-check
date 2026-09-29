import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { api } from "../lib/api";
import { saveSession } from "../lib/auth";
import { colors } from "../constants/theme";

export default function LoginScreen() {
  const [nickname, setNickname] = useState("");
  const [classCode, setClassCode] = useState("DEMO2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEnter() {
    setError("");
    setLoading(true);
    try {
      const data = await api.auth(nickname.trim(), classCode.trim());
      await saveSession({
        student: data.student,
        className: data.className,
      });
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(e.message || "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.hero}>
        <Text style={styles.brand}>Ciencia Check</Text>
        <Text style={styles.tagline}>
          Aprenda a checar notícias científicas jogando — método científico na prática.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Seu apelido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: AnaDetetive"
          placeholderTextColor={colors.muted}
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Código da turma</Text>
        <TextInput
          style={styles.input}
          placeholder="DEMO2026"
          placeholderTextColor={colors.muted}
          value={classCode}
          onChangeText={setClassCode}
          autoCapitalize="characters"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleEnter}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Começar missão</Text>
          )}
        </Pressable>

        <Text style={styles.hint}>Protótipo APEX · turma demo: DEMO2026</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  hero: { paddingHorizontal: 24, paddingTop: 72, paddingBottom: 28 },
  brand: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#D7E8DE",
    maxWidth: 320,
  },
  form: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.ink, fontWeight: "800", fontSize: 16 },
  error: { color: colors.danger, marginTop: 12, fontWeight: "600" },
  hint: { marginTop: 18, textAlign: "center", color: colors.muted, fontSize: 13 },
});
