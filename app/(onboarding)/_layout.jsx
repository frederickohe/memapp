import { Stack } from "expo-router";
import { useOnboardingGuard } from "@/hooks/useAuthBootstrap";

export default function OnboardingLayout() {
  useOnboardingGuard();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="stepper" />
      <Stack.Screen
        name="processing"
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="success" />
      <Stack.Screen name="entrance" />
    </Stack>
  );
}
