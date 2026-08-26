import { Stack } from "expo-router";

export default function ProgramsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="apply" />
      <Stack.Screen
        name="apply-success"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}
