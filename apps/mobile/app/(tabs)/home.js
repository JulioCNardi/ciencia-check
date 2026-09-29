import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api } from "../../lib/api";
import { clearSession, loadSession, saveSession } from "../../lib/auth";
import { colors } from "../../constants/theme";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const session = await loadSession();
      if (!session?.student?.id) {
        router.replace("/login");
        return;
      }
      const missions = await api.missions(session.student.id);
      await saveSession({
        ...session,
        student: missions.student,
        className: session.className,
      });
      setData({ ...missions, className: session.className });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  async function handleLogout() {
    await clearSession();
    router.replace("/login");
  }

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const student = data?.student;
  const progress = student?.xpProgress || { current: 0, needed: 100 };
  const pct = Math.min(100, (progress.current / progress.needed) * 100);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.hello}>Olá, {student?.nickname}</Text>
          <Text style={styles.className}>{data?.className || "Turma"}</Text>
        </View>
        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.xpBlock}>
        <View style={styles.xpTop}>
          <Text style={styles.level}>Nível {student?.level || 1}</Text>
          <Text style={styles.xpText}>
            {student?.xp || 0} XP · streak {student?.streak || 0}🔥
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.xpHint}>
          {progress.current}/{progress.needed} XP para o próximo nível
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.section}>Missão do dia</Text>
      {data?.mission ? (
        <Pressable
          style={styles.mission}
          onPress={() => router.push(`/desafio/${data.mission.id}`)}
        >
          <Text style={styles.missionTheme}>{data.mission.theme.toUpperCase()}</Text>
          <Text style={styles.missionTitle}>{data.mission.title}</Text>
          <Text style={styles.missionBody} numberOfLines={3}>
            {data.mission.text}
          </Text>
          <Text style={styles.cta}>Analisar notícia →</Text>
        </Pressable>
      ) : (
        <View style={styles.mission}>
          <Text style={styles.missionTitle}>Missões concluídas</Text>
          <Text style={styles.missionBody}>{data?.message}</Text>
        </View>
      )}

      <Text style={styles.progress}>
        Progresso: {data?.progress?.completed || 0}/{data?.progress?.total || 0} desafios
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  hello: { fontSize: 26, fontWeight: "800", color: colors.ink },
  className: { color: colors.muted, marginTop: 4 },
  logout: { color: colors.primary, fontWeight: "700" },
  xpBlock: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },
  xpTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  level: { fontWeight: "800", color: colors.primary, fontSize: 16 },
  xpText: { color: colors.muted, fontWeight: "600" },
  track: {
    height: 12,
    backgroundColor: colors.track,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: colors.accent },
  xpHint: { marginTop: 8, color: colors.muted, fontSize: 12 },
  section: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: 10,
  },
  mission: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
  },
  missionTheme: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
  },
  missionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 10,
  },
  missionBody: { color: "#D7E8DE", lineHeight: 22 },
  cta: {
    marginTop: 16,
    color: colors.accent,
    fontWeight: "800",
    fontSize: 16,
  },
  progress: { marginTop: 16, color: colors.muted, fontWeight: "600" },
  error: { color: colors.danger, marginBottom: 12, fontWeight: "600" },
});
