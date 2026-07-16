import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { resolveInitialRoute } from "@/lib/authRouting";

/**
 * Restores the correct route once persisted auth state has hydrated.
 */
export function useAuthBootstrap(enabled = true) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    const restoreSession = () => {
      const route = resolveInitialRoute(useAuthStore.getState());
      router.replace(route);
    };

    if (useAuthStore.persist.hasHydrated()) {
      restoreSession();
      return;
    }

    return useAuthStore.persist.onFinishHydration(restoreSession);
  }, [enabled, router]);
}

/**
 * Redirects away from onboarding when the user already finished it.
 */
export function useOnboardingGuard() {
  const router = useRouter();

  useEffect(() => {
    const guard = () => {
      const route = resolveInitialRoute(useAuthStore.getState());
      if (route === "/(tabs)") {
        router.replace(route);
      }
    };

    if (useAuthStore.persist.hasHydrated()) {
      guard();
      return;
    }

    return useAuthStore.persist.onFinishHydration(guard);
  }, [router]);
}
