import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  signIn as signInRequest,
  signUp as signUpRequest,
  sendOtp as sendOtpRequest,
  verifyOtp as verifyOtpRequest,
  signOut as signOutRequest,
  refreshSession as refreshSessionRequest,
} from "@/lib/api/auth";
import { buildSignupPayload } from "@/lib/signupPayload";
import { getCurrentUser, updateCurrentUser } from "@/lib/api/user";
import { isAuthenticated, resolveInitialRoute } from "@/lib/authRouting";
import {
  clearDevicePin,
  getDevicePinRecord,
  pinMatchesAccount,
  saveDevicePin,
  verifyDevicePin,
} from "@/lib/devicePin";
import { loadAppSettings, saveAppSettings } from "@/lib/appSettings";

function extractAuthPayload(response) {
  const data = response?.data ?? response ?? {};

  return {
    token:
      data.access_token ??
      data.accessToken ??
      data.token ??
      response?.access_token ??
      response?.accessToken ??
      response?.token ??
      null,
    refreshToken:
      data.refresh_token ?? data.refreshToken ?? response?.refresh_token ?? null,
    user:
      data.user ??
      response?.user ??
      (data.fullname || data.email ? data : null),
  };
}

async function resolveUser(token, fallbackUser) {
  if (!token) return fallbackUser ?? null;

  try {
    return await getCurrentUser(token);
  } catch {
    return fallbackUser ?? null;
  }
}

function logAuthToken(token, source) {
  if (!__DEV__ || !token) return;

  console.log("[auth] token for Swagger", {
    source,
    token,
    authorizationHeader: `Bearer ${token}`,
  });
}

function accountKeyFromState(state) {
  return String(state?.email || state?.user?.email || "")
    .trim()
    .toLowerCase();
}

async function syncPinForAccount(accountKey) {
  const record = await getDevicePinRecord();
  if (!record) return false;
  if (!accountKey) return true;
  if (!pinMatchesAccount(record, accountKey)) {
    await clearDevicePin();
    return false;
  }
  return true;
}

async function migrateLegacyPin(accountKey) {
  try {
    const prefs = await loadAppSettings();
    if (!prefs?.pin || String(prefs.pin).length < 4) return;
    const existing = await getDevicePinRecord();
    if (!existing) {
      await saveDevicePin(String(prefs.pin), accountKey);
    }
    const { pin, pinEnabled, ...rest } = prefs;
    await saveAppSettings(rest);
  } catch {
    // Ignore migration errors; PIN setup can be repeated locally.
  }
}

export function logCurrentAuthToken() {
  logAuthToken(useAuthStore.getState().token, "manual");
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      authIntent: null,
      phone: "",
      email: "",
      otp: "",
      otpVerified: false,
      signupInProgress: false,
      onboardingComplete: false,
      isLoading: false,
      isProfileLoading: false,
      profileLoaded: false,
      profileError: null,
      error: null,
      devicePinEnabled: false,
      pinUnlocked: false,
      pinReady: false,
      localSignedOut: false,

      setAuthIntent: (authIntent) => set({ authIntent }),
      setPhone: (phone) => set({ phone }),
      setEmail: (email) => set({ email }),
      setOtp: (otp) => set({ otp }),
      setSignupInProgress: (signupInProgress) => set({ signupInProgress }),
      clearError: () => set({ error: null }),

      signIn: async (email, password) => {
        set({ isLoading: true, error: null, profileLoaded: false });
        try {
          const response = await signInRequest({
            email: String(email).trim().toLowerCase(),
            password,
          });
          const auth = extractAuthPayload(response);
          if (!auth.token) {
            throw new Error("Sign in succeeded without a session token");
          }
          const user = await resolveUser(auth.token, auth.user);

          const accountKey = String(email).trim().toLowerCase();
          const devicePinEnabled = await syncPinForAccount(accountKey);

          set({
            token: auth.token,
            refreshToken: auth.refreshToken,
            user,
            email: accountKey,
            phone: user?.phone_number || get().phone,
            authIntent: null,
            otpVerified: false,
            signupInProgress: false,
            onboardingComplete: true,
            isLoading: false,
            devicePinEnabled,
            pinUnlocked: true,
            localSignedOut: false,
          });

          logAuthToken(auth.token, "signIn");

          return { success: true, response };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Unable to sign in",
          });
          return { success: false, error };
        }
      },

      sendOtp: async ({ phone, email }) => {
        set({ isLoading: true, error: null, phone: phone || "", email: email || "" });
        try {
          const response = await sendOtpRequest({ phone, email });
          set({ isLoading: false, otpVerified: false });
          return { success: true, response };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Unable to send verification code",
          });
          return { success: false, error };
        }
      },

      verifyOtpCode: async (otp) => {
        const { phone, email } = get();
        set({ isLoading: true, error: null, otp });
        try {
          const response = await verifyOtpRequest({ phone, email, otp });
          set({ isLoading: false, otpVerified: true, otp });
          return { success: true, response };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Invalid verification code",
          });
          return { success: false, error };
        }
      },

      signUp: async (form) => {
        const { phone, email } = get();
        set({ isLoading: true, error: null, profileLoaded: false });

        try {
          const payload = buildSignupPayload(form, { phone, email });
          const signupResponse = await signUpRequest(payload);
          let auth = extractAuthPayload(signupResponse);

          // Older backends created the user without issuing a session.
          if (!auth.token && payload.email && payload.password) {
            const signinResponse = await signInRequest({
              email: payload.email,
              password: payload.password,
            });
            auth = extractAuthPayload(signinResponse);
          }

          if (!auth.token) {
            throw new Error(
              "Account created, but sign in failed. Please log in with your email and password."
            );
          }

          const fallbackUser = auth.user ?? {
            id: signupResponse?.user_id,
            fullname: payload.fullname,
            email: payload.email,
            phone_number: payload.phone_number,
            nationality: payload.nationality,
            date_of_birth: payload.date_of_birth,
            gender: payload.gender,
            address: payload.address,
            membership_type: payload.membership_type,
            current_branch: payload.current_branch,
            member_id: payload.member_id,
            skills: payload.skills,
            created_at: payload.created_at,
            profile_picture_url: payload.profile_picture_url,
          };
          const user = await resolveUser(auth.token, fallbackUser);

          const nextEmail = user?.email || payload.email || email;
          const devicePinEnabled = await syncPinForAccount(nextEmail);

          set({
            token: auth.token,
            refreshToken: auth.refreshToken,
            user,
            email: nextEmail,
            phone: user?.phone_number || payload.phone_number || phone,
            authIntent: null,
            otpVerified: false,
            isLoading: false,
            signupInProgress: true,
            onboardingComplete: false,
            devicePinEnabled,
            pinUnlocked: true,
            localSignedOut: false,
          });

          logAuthToken(auth.token, "signUp");

          return { success: true, response: signupResponse, needsProfileRefresh: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Unable to complete sign up",
          });
          return { success: false, error };
        }
      },

      completeOnboarding: () =>
        set({ onboardingComplete: true, signupInProgress: false }),

      hydrateDevicePin: async () => {
        const accountKey = accountKeyFromState(get());
        await migrateLegacyPin(accountKey);
        const devicePinEnabled = await syncPinForAccount(accountKey);
        set({
          devicePinEnabled,
          pinUnlocked: devicePinEnabled ? get().pinUnlocked : true,
          pinReady: true,
        });
      },

      saveLocalPin: async (pin) => {
        await saveDevicePin(pin, accountKeyFromState(get()));
        set({ devicePinEnabled: true, pinUnlocked: true, localSignedOut: false });
      },

      disableLocalPin: async () => {
        await clearDevicePin();
        set({ devicePinEnabled: false, pinUnlocked: true });
      },

      unlockWithPin: async (pin) => {
        const matched = await verifyDevicePin(pin);
        if (!matched) return { success: false, reason: "pin" };

        const { refreshToken, email, user } = get();
        if (!refreshToken) {
          return { success: false, reason: "refresh" };
        }

        set({ isLoading: true, error: null });
        try {
          const response = await refreshSessionRequest({
            refresh_token: refreshToken,
            email,
          });
          const auth = extractAuthPayload(response);
          if (!auth.token) {
            throw new Error("Session refresh succeeded without an access token");
          }

          const nextUser = await resolveUser(auth.token, user);
          set({
            token: auth.token,
            refreshToken: auth.refreshToken || refreshToken,
            user: nextUser,
            email: nextUser?.email || email,
            phone: nextUser?.phone_number || get().phone,
            pinUnlocked: true,
            localSignedOut: false,
            isLoading: false,
            error: null,
          });
          logAuthToken(auth.token, "pinRefresh");
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Unable to refresh session",
          });
          return { success: false, reason: "refresh", error };
        }
      },

      lockPin: () => set({ pinUnlocked: false }),

      resumePinLogin: () => set({ localSignedOut: false, pinUnlocked: false }),

      logoutToWelcome: async () => {
        if (get().devicePinEnabled && get().token) {
          set({ localSignedOut: true, pinUnlocked: false });
          return;
        }
        await get().signOut();
      },

      updateProfile: async (payload) => {
        const { token, user: currentUser } = get();
        if (!token) {
          return { success: false, error: new Error("Missing auth token") };
        }

        set({ isLoading: true, error: null });
        try {
          const updated = await updateCurrentUser(payload, token, {
            email: currentUser?.email || get().email,
          });
          const user = updated?.id ? updated : { ...currentUser, ...payload };
          set({
            user,
            email: user?.email || get().email,
            phone: user?.phone_number || get().phone,
            isLoading: false,
          });
          return { success: true, user };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || "Unable to update profile",
          });
          return { success: false, error };
        }
      },

      fetchProfile: async () => {
        const { token, user: currentUser } = get();
        if (!token) {
          return { success: false, error: new Error("Missing auth token") };
        }

        set({ isProfileLoading: true, profileError: null });

        try {
          const user = await getCurrentUser(token);
          set({
            user,
            email: user?.email || get().email,
            phone: user?.phone_number || get().phone,
            isProfileLoading: false,
            profileLoaded: true,
            profileError: null,
          });
          return { success: true, user };
        } catch (error) {
          set({
            isProfileLoading: false,
            profileLoaded: Boolean(currentUser),
            profileError: error.message || "Unable to load profile",
            user: currentUser,
          });
          return { success: false, error, user: currentUser };
        }
      },

      signOut: async ({ clearPin = false } = {}) => {
        const { token } = get();
        try {
          if (token) {
            await signOutRequest(token);
          }
        } catch {
          // Ignore network errors during sign out.
        }

        if (clearPin) {
          await clearDevicePin();
        }

        set({
          token: null,
          refreshToken: null,
          user: null,
          authIntent: null,
          phone: "",
          email: "",
          otp: "",
          otpVerified: false,
          signupInProgress: false,
          onboardingComplete: false,
          isLoading: false,
          isProfileLoading: false,
          profileLoaded: false,
          profileError: null,
          error: null,
          devicePinEnabled: clearPin ? false : get().devicePinEnabled,
          pinUnlocked: false,
          localSignedOut: false,
        });
      },

      getInitialRoute: () => resolveInitialRoute(get()),
    }),
    {
      name: "memapp-auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        phone: state.phone,
        email: state.email,
        otpVerified: state.otpVerified,
        signupInProgress: state.signupInProgress,
        onboardingComplete: state.onboardingComplete,
        profileLoaded: state.profileLoaded,
        localSignedOut: state.localSignedOut,
      }),
      onRehydrateStorage: () => (state) => {
        logAuthToken(state?.token, "persist rehydrate");
      },
    }
  )
);

export function getPostAuthRoute(intent) {
  if (intent === "signup") {
    return "/(onboarding)/welcome";
  }
  return "/loading-profile?next=/(tabs)";
}
