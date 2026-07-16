export function isAuthenticated(state) {
  return Boolean(
    state.token ||
      state.user?.id ||
      (state.onboardingComplete && (state.user?.email || state.email))
  );
}

export function resolveInitialRoute(state) {
  const authenticated = isAuthenticated(state);

  if (authenticated && state.onboardingComplete) {
    return "/(tabs)";
  }

  if (authenticated && !state.onboardingComplete) {
    return "/(onboarding)/welcome";
  }

  // Resume signup only before the account is created.
  if (state.otpVerified && !state.onboardingComplete && !authenticated) {
    return "/(onboarding)/welcome";
  }

  return "/(auth)/log-or-sign";
}
