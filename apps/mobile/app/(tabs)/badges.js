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

export default function BadgesScreen() {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const session = await loadSession();
      if (!session?.student?.id) {
        router.replace("/login");
        return;
      }
      const me = await api.me(session.student.id);
      setBadges(me.badges || []);
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

  if (loading && !badges.length) {
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
      <Text style={styles.title}>Seus badges</Text>
      <Text style={styles.subtitle}>
        Conquistas por checagem crítica — não por “acertar o algoritmo”.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {badges.map((b) => (
        <View key={b.id} style={[styles.card, !b.unlocked && styles.locked]}>
          <Text style={styles.icon}>{b.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{b.name}</Text>
            <Text style={styles.desc}>{b.description}</Text>
            <Text style={styles.status}>{b.unlocked ? "Desbloqueado" : "Bloqueado"}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.ink },
  subtitle: { color: colors.muted, marginBottom: 18, marginTop: 4 },
  card: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locked: { opacity: 0.45 },
  icon: { fontSize: 28 },
  name: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  desc: { color: colors.muted, marginTop: 4, lineHeight: 20 },
  status: { marginTop: 8, fontWeight: "700", color: colors.primary, fontSize: 12 },
  error: { color: colors.danger, marginBottom: 12 },
});
