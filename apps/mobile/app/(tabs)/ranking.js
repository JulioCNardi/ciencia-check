import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api } from "../../lib/api";
import { loadSession } from "../../lib/auth";
import { colors } from "../../constants/theme";

export default function RankingScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [myId, setMyId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const session = await loadSession();
      if (!session?.student?.id) {
        router.replace("/login");
        return;
      }
      setMyId(session.student.id);
      const board = await api.leaderboard(session.student.classCode);
      setData(board);
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

  if (loading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <Text style={styles.title}>{data?.className || "Ranking"}</Text>
      <Text style={styles.subtitle}>Top 10 da turma · quem mais checa, sobe</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {(data?.leaderboard || []).map((row) => {
        const isMe = row.studentId === myId;
        return (
          <View key={row.studentId} style={[styles.row, isMe && styles.rowMe]}>
            <Text style={styles.rank}>#{row.rank}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {row.nickname}
                {isMe ? " (você)" : ""}
              </Text>
              <Text style={styles.meta}>
                Nível {row.level} · streak {row.streak} · {row.badgesCount} badges
              </Text>
            </View>
            <Text style={styles.xp}>{row.xp} XP</Text>
          </View>
        );
      })}

      {!data?.leaderboard?.length ? (
        <Text style={styles.empty}>Ainda não há pontuações nesta turma.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.ink },
  subtitle: { color: colors.muted, marginBottom: 18, marginTop: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowMe: { borderColor: colors.accent, backgroundColor: "#FFF8E8" },
  rank: { fontWeight: "800", color: colors.primary, width: 36 },
  name: { fontWeight: "700", color: colors.ink, fontSize: 16 },
  meta: { color: colors.muted, marginTop: 2, fontSize: 12 },
  xp: { fontWeight: "800", color: colors.accent },
  empty: { color: colors.muted, marginTop: 20 },
  error: { color: colors.danger, marginBottom: 12 },
});
