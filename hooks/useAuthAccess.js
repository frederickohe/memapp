import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { isAuthenticated } from "@/lib/authRouting";

export function useAuthAccess() {
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const email = useAuthStore((state) => state.email);
  const onboardingComplete = useAuthStore((state) => state.onboardingComplete);
  const otpVerified = useAuthStore((state) => state.otpVerified);
  const signupInProgress = useAuthStore((state) => state.signupInProgress);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const state = {
    token,
    user,
    email,
    onboardingComplete,
    otpVerified,
    signupInProgress,
  };
  const authenticated = isAuthenticated(state);
  const canAccessApp = authenticated && onboardingComplete;
  const canAccessOnboarding =
    !onboardingComplete &&
    (otpVerified || authenticated || signupInProgress);
  const canAccessAuth = !canAccessApp && !canAccessOnboarding;

  return {
    hydrated,
    canAccessApp,
    canAccessOnboarding,
    canAccessAuth,
  };
}
