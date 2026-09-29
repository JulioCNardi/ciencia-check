import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "../../constants/theme";

function TabIcon({ label, focused }) {
  return (
    <Text style={{ fontSize: 11, fontWeight: focused ? "800" : "600", color: focused ? colors.accent : "#B7C9BE" }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: "#145C45",
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: "#B7C9BE",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Missões",
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Ranking",
          tabBarIcon: ({ focused }) => <TabIcon label="🏆" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: "Badges",
          tabBarIcon: ({ focused }) => <TabIcon label="⭐" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="aprender"
        options={{
          title: "Aprender",
          tabBarIcon: ({ focused }) => <TabIcon label="🧪" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
