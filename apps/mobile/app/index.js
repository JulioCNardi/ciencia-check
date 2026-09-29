import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { loadSession } from "../lib/auth";
import { colors } from "../constants/theme";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    loadSession().then((s) => {
      setSession(s);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  if (session?.student?.id) {
    return <Redirect href="/(tabs)/home" />;
  }
  return <Redirect href="/login" />;
}
