import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import ProfileLoadingScreen from "@/components/ProfileLoadingScreen";
import { useAuthStore } from "@/stores/useAuthStore";

const MIN_LOADING_MS = 1800;

export default function LoadingProfileScreen() {
  const router = useRouter();
  const { next = "/(tabs)" } = useLocalSearchParams();
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const profileError = useAuthStore((state) => state.profileError);

  const destination = Array.isArray(next) ? next[0] : next;

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS));
      await Promise.all([fetchProfile(), minDelay]);

      if (!cancelled) {
        router.replace(destination);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [destination, fetchProfile, router]);

  return (
    <ProfileLoadingScreen
      message={profileError ? "Loading your saved profile…" : undefined}
    />
  );
}
