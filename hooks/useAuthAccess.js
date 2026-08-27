import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { isAuthenticated } from "@/lib/authRouting";

export function useAuthAccess() {
  const [authHydrated, setAuthHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const email = useAuthStore((state) => state.email);
  const onboardingComplete = useAuthStore((state) => state.onboardingComplete);
  const otpVerified = useAuthStore((state) => state.otpVerified);
  const signupInProgress = useAuthStore((state) => state.signupInProgress);
  const devicePinEnabled = useAuthStore((state) => state.devicePinEnabled);
  const pinUnlocked = useAuthStore((state) => state.pinUnlocked);
  const pinReady = useAuthStore((state) => state.pinReady);
  const localSignedOut = useAuthStore((state) => state.localSignedOut);
  const hydrateDevicePin = useAuthStore((state) => state.hydrateDevicePin);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setAuthHydrated(true);
      return;
    }

    return useAuthStore.persist.onFinishHydration(() => setAuthHydrated(true));
  }, []);

  useEffect(() => {
    if (!authHydrated) return;
    hydrateDevicePin();
  }, [authHydrated, hydrateDevicePin]);

  const state = {
    token,
    user,
    email,
    onboardingComplete,
    otpVerified,
    signupInProgress,
  };
  const authenticated = isAuthenticated(state);
  const pinLocked =
    authenticated &&
    onboardingComplete &&
    devicePinEnabled &&
    !pinUnlocked &&
    !localSignedOut;
  const canAccessApp =
    authenticated && onboardingComplete && !localSignedOut && !pinLocked;
  const canAccessPinLock = pinLocked;
  const canAccessOnboarding =
    !onboardingComplete &&
    (otpVerified || authenticated || signupInProgress);
  const canAccessAuth = !canAccessApp && !canAccessOnboarding && !canAccessPinLock;

  return {
    hydrated: authHydrated && pinReady,
    canAccessApp,
    canAccessPinLock,
    canAccessOnboarding,
    canAccessAuth,
  };
}
