import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "memapp.auth.session";

/**
 * @typedef {{ loggedIn: boolean, onboardingComplete: boolean }} AuthSession
 */

/** @returns {Promise<AuthSession>} */
export async function getAuthSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) {
      return { loggedIn: false, onboardingComplete: false };
    }
    const parsed = JSON.parse(raw);
    return {
      loggedIn: Boolean(parsed.loggedIn),
      onboardingComplete: Boolean(parsed.onboardingComplete),
    };
  } catch {
    return { loggedIn: false, onboardingComplete: false };
  }
}

/** @param {Partial<AuthSession>} patch */
async function saveAuthSession(patch) {
  const current = await getAuthSession();
  const next = { ...current, ...patch };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export async function markLoggedIn() {
  return saveAuthSession({ loggedIn: true });
}

export async function markOnboardingComplete() {
  return saveAuthSession({ loggedIn: true, onboardingComplete: true });
}

export async function clearAuthSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

/** Route after OTP confirmation based on auth intent. */
export async function getPostAuthRoute(intent) {
  if (intent === "signup") {
    await markLoggedIn();
    return "/(onboarding)/welcome";
  }

  await markOnboardingComplete();
  return "/(tabs)";
}

/** Route for restoring an existing session on app launch. */
export async function getInitialRoute() {
  const session = await getAuthSession();
  if (!session.loggedIn) {
    return "/(auth)/log-or-sign";
  }
  if (session.onboardingComplete) {
    return "/(tabs)";
  }
  return "/(onboarding)/welcome";
}
