import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "../constants/theme";

export default function ResultadoScreen() {
  const params = useLocalSearchParams();
  const data = useMemo(() => {
    try {
      return JSON.parse(params.data || "{}");
    } catch {
      return {};
    }
  }, [params.data]);

  const result = data.result || {};
  const student = data.student || {};

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.scoreLabel}>Sua pontuação</Text>
      <Text style={styles.score}>{result.score ?? 0}</Text>
      <Text style={styles.xp}>
        +{result.xpEarned ?? 0} XP
        {result.streakBonus ? ` (inclui +${result.streakBonus} de streak)` : ""}
      </Text>
      <Text style={styles.level}>
        Nível {student.level} · {student.xp} XP total · streak {student.streak}
      </Text>

      <View
        style={[
          styles.banner,
          result.classCorrect ? styles.bannerOk : styles.bannerBad,
        ]}
      >
        <Text style={styles.bannerText}>
          {result.classCorrect
            ? "Classificação correta!"
            : `Classificação esperada: ${result.correctClassification}`}
        </Text>
      </View>

      <Text style={styles.section}>Por que isso importa</Text>
      <Text style={styles.body}>{result.explanation}</Text>

      <Text style={styles.section}>Método científico (passo a passo)</Text>
      {(result.scientificMethod || []).map((step, i) => (
        <Text key={i} style={styles.step}>
          {i + 1}. {step}
        </Text>
      ))}

      <Text style={styles.section}>Sinais detectados no texto</Text>
      {(result.heuristics?.alerts || []).length ? (
        result.heuristics.alerts.map((a) => (
          <View key={a.id} style={styles.alert}>
            <Text style={styles.alertTitle}>{a.label}</Text>
            <Text style={styles.alertWhy}>{a.why}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.body}>Poucos sinais automáticos — foque nas fontes e no método.</Text>
      )}

      {(result.unlockedBadges || []).length ? (
        <>
          <Text style={styles.section}>Novos badges</Text>
          {result.unlockedBadges.map((b) => (
            <Text key={b.id} style={styles.badge}>
              {b.icon} {b.name}
            </Text>
          ))}
        </>
      ) : null}

      <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/home")}>
        <Text style={styles.buttonText}>Voltar às missões</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => router.replace("/(tabs)/ranking")}>
        <Text style={styles.secondaryText}>Ver ranking da turma</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 48 },
  scoreLabel: { color: colors.muted, fontWeight: "700" },
  score: {
    fontSize: 64,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 4,
  },
  xp: { fontSize: 18, fontWeight: "800", color: colors.accent },
  level: { color: colors.muted, marginTop: 6, marginBottom: 16 },
  banner: { borderRadius: 14, padding: 14, marginBottom: 18 },
  bannerOk: { backgroundColor: "#D8F3E3" },
  bannerBad: { backgroundColor: "#FCE8E6" },
  bannerText: { fontWeight: "800", color: colors.ink },
  section: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },
  body: { color: colors.ink, lineHeight: 22 },
  step: { color: colors.ink, lineHeight: 22, marginBottom: 6 },
  alert: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertTitle: { fontWeight: "800", color: colors.primary },
  alertWhy: { color: colors.muted, marginTop: 4, lineHeight: 20 },
  badge: { fontSize: 16, fontWeight: "700", marginBottom: 6, color: colors.ink },
  button: {
    marginTop: 28,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  secondary: { marginTop: 12, alignItems: "center", padding: 12 },
  secondaryText: { color: colors.primary, fontWeight: "700" },
});
