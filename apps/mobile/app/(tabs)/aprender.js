import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "../../lib/api";
import { colors } from "../../constants/theme";

export default function AprenderScreen() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .learn()
      .then((d) => setCards(d.cards || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Método científico</Text>
      <Text style={styles.subtitle}>
        O app não declara verdade absoluta — ele ensina a investigar.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cards.map((card, index) => (
        <View key={card.id} style={styles.card}>
          <Text style={styles.step}>Passo {index + 1}</Text>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.body}>{card.body}</Text>
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
  subtitle: { color: colors.muted, marginBottom: 18, marginTop: 4, lineHeight: 22 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  step: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 6,
    marginBottom: 8,
  },
  body: { color: colors.ink, lineHeight: 22 },
  error: { color: colors.danger, marginBottom: 12 },
});
