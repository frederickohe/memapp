import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/stores/useAuthStore";
import { isAuthenticated } from "@/lib/authRouting";
import { navigateToAuthenticatedApp } from "@/lib/authNavigation";

function shouldBlockAuthAccess(state) {
  return (
    isAuthenticated(state) &&
    state.onboardingComplete &&
    !state.localSignedOut &&
    (!state.devicePinEnabled || state.pinUnlocked)
  );
}

/**
 * Redirects authenticated users away from auth screens.
 */
export function useAuthGuard() {
  const router = useRouter();

  const redirectIfAuthenticated = useCallback(() => {
    const state = useAuthStore.getState();
    if (shouldBlockAuthAccess(state)) {
      navigateToAuthenticatedApp(router);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      if (useAuthStore.persist.hasHydrated()) {
        redirectIfAuthenticated();
      } else {
        return useAuthStore.persist.onFinishHydration(redirectIfAuthenticated);
      }
    }, [redirectIfAuthenticated])
  );

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      redirectIfAuthenticated();
      return;
    }

    return useAuthStore.persist.onFinishHydration(redirectIfAuthenticated);
  }, [redirectIfAuthenticated]);
}

/**
 * Prevents hardware back from leaving the main app while logged in.
 */
export function useAppBackGuard() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const state = useAuthStore.getState();
        return shouldBlockAuthAccess(state);
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );
}

/**
 * Redirects away from onboarding when the user already finished it.
 */
export function useOnboardingGuard() {
  const router = useRouter();

  useEffect(() => {
    const guard = () => {
      const state = useAuthStore.getState();
      if (shouldBlockAuthAccess(state)) {
        navigateToAuthenticatedApp(router);
      }
    };

    if (useAuthStore.persist.hasHydrated()) {
      guard();
      return;
    }

    return useAuthStore.persist.onFinishHydration(guard);
  }, [router]);
}
