import { Stack } from "expo-router";

export default function SocialLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="search" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="compose" />
    </Stack>
  );
}
