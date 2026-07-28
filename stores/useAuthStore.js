import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  signIn as signInRequest,
  signUp as signUpRequest,
  sendOtp as sendOtpRequest,
  verifyOtp as verifyOtpRequest,
  verifyAccountOtp,
  signOut as signOutRequest,
} from "@/lib/api/auth";
import { buildSignupPayload } from "@/lib/signupPayload";
import { getCurrentUser } from "@/lib/api/user";
import { isAuthenticated, resolveInitialRoute } from "@/lib/authRouting";

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
      onboardingComplete: false,
      isLoading: false,
      isProfileLoading: false,
      profileLoaded: false,
      profileError: null,
      error: null,

      setAuthIntent: (authIntent) => set({ authIntent }),
      setPhone: (phone) => set({ phone }),
      setEmail: (email) => set({ email }),
      setOtp: (otp) => set({ otp }),
      clearError: () => set({ error: null }),

      signIn: async (email, password) => {
        set({ isLoading: true, error: null, profileLoaded: false });
        try {
          const response = await signInRequest({ email, password });
          const auth = extractAuthPayload(response);

          set({
            token: auth.token,
            refreshToken: auth.refreshToken,
            user: auth.user,
            email,
            phone: get().phone,
            authIntent: null,
            otpVerified: false,
            onboardingComplete: true,
            isLoading: false,
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
        const { phone, email, otp } = get();
        set({ isLoading: true, error: null, profileLoaded: false });

        try {
          const payload = buildSignupPayload(form, { phone, email });
          const signupResponse = await signUpRequest(payload);

          if (phone && otp) {
            await verifyAccountOtp({ phone, otp });
          }

          const auth = extractAuthPayload(signupResponse);
          const fallbackUser = auth.user ?? {
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

          set({
            token: auth.token,
            refreshToken: auth.refreshToken,
            user,
            email: user?.email || email,
            phone: user?.phone_number || phone,
            authIntent: null,
            otpVerified: false,
            isLoading: false,
            onboardingComplete: true,
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

      completeOnboarding: () => set({ onboardingComplete: true }),

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

      signOut: async () => {
        const { token } = get();
        try {
          if (token) {
            await signOutRequest(token);
          }
        } catch {
          // Ignore network errors during sign out.
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
          onboardingComplete: false,
          isLoading: false,
          isProfileLoading: false,
          profileLoaded: false,
          profileError: null,
          error: null,
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
        onboardingComplete: state.onboardingComplete,
        profileLoaded: state.profileLoaded,
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
