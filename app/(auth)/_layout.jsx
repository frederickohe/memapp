import { Stack } from "expo-router";
import { useAuthGuard } from "@/hooks/useAuthBootstrap";

export default function AuthLayout() {
  useAuthGuard();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="log-or-sign" />
      <Stack.Screen name="login" />
      <Stack.Screen name="phone-number" />
      <Stack.Screen name="confirmation-code" />
    </Stack>
  );
}
