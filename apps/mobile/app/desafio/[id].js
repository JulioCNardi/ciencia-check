import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "../../lib/api";
import { loadSession, saveSession } from "../../lib/auth";
import { colors } from "../../constants/theme";

export default function DesafioScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payload, setPayload] = useState(null);
  const [classification, setClassification] = useState(null);
  const [selectedFlags, setSelectedFlags] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .challenge(id)
      .then(setPayload)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleFlag(flagId) {
    setSelectedFlags((prev) =>
      prev.includes(flagId) ? prev.filter((f) => f !== flagId) : [...prev, flagId]
    );
  }

  async function handleSubmit() {
    if (!classification) {
      setError("Escolha uma classificação.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const session = await loadSession();
      const data = await api.submit({
        studentId: session.student.id,
        challengeId: id,
        classification,
        selectedFlags,
      });
      await saveSession({
        ...session,
        student: data.student,
      });
      router.push({
        pathname: "/resultado",
        params: { data: JSON.stringify(data) },
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!payload?.challenge) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Desafio não encontrado."}</Text>
      </View>
    );
  }

  const { challenge, redFlagOptions, classifications } = payload;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.theme}>{challenge.theme.toUpperCase()}</Text>
      <Text style={styles.title}>{challenge.title}</Text>
      <View style={styles.article}>
        <Text style={styles.articleText}>{challenge.text}</Text>
      </View>

      <Text style={styles.section}>Como você classifica?</Text>
      <View style={styles.rowWrap}>
        {classifications.map((c) => {
          const active = classification === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => setClassification(c.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Quais sinais você identificou?</Text>
      <View style={styles.rowWrap}>
        {redFlagOptions.map((f) => {
          const active = selectedFlags.includes(f.id);
          return (
            <Pressable
              key={f.id}
              onPress={() => toggleFlag(f.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, submitting && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.ink} />
        ) : (
          <Text style={styles.buttonText}>Enviar análise</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 48 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  theme: {
    color: colors.accent,
    fontWeight: "800",
    letterSpacing: 1,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
    marginTop: 8,
    marginBottom: 14,
  },
  article: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  articleText: { color: colors.ink, lineHeight: 24, fontSize: 16 },
  section: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { color: colors.ink, fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  button: {
    marginTop: 28,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  error: { color: colors.danger, marginTop: 14, fontWeight: "600" },
});
