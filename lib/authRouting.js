export function isAuthenticated(state) {
  return Boolean(state.token);
}

export function resolveInitialRoute(state) {
  const authenticated = isAuthenticated(state);

  if (authenticated && state.onboardingComplete) {
    return "/loading-profile?next=/(tabs)";
  }

  if (authenticated && !state.onboardingComplete) {
    return "/(onboarding)/entrance";
  }

  if (state.signupInProgress && !state.onboardingComplete) {
    return "/(onboarding)/welcome";
  }

  // Resume OTP signup only before the account is created.
  if (state.otpVerified && !state.onboardingComplete && !authenticated) {
    return "/(onboarding)/welcome";
  }

  return "/(auth)/log-or-sign";
}
