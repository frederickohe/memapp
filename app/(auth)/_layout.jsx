import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="log-or-sign" />
      <Stack.Screen name="login" />
      <Stack.Screen name="phone-number" />
      <Stack.Screen name="confirmation-code" />
    </Stack>
  );
}
