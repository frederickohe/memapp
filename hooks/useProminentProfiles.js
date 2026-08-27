import { useCallback, useEffect, useState } from "react";
import { getProminentProfileById, getProminentProfiles } from "@/lib/api/profiles";
import { mapProminentProfile, normalizeProfilesResponse } from "@/lib/profileUtils";
import { useAuthStore } from "@/stores/useAuthStore";

export function useProminentProfiles(limit = 20, category) {
  const token = useAuthStore((state) => state.token);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProfiles = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await getProminentProfiles(limit, token, category);
        setProfiles(normalizeProfilesResponse(response).map(mapProminentProfile));
      } catch (err) {
        if (__DEV__) {
          console.log("[profiles] load error", err);
        }
        setError(err.message || "Unable to load prominent profiles");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [category, limit, token]
  );

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return {
    profiles,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadProfiles({ refreshing: true }),
  };
}

export function useProminentProfile(profileId) {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!profileId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getProminentProfileById(profileId, token);
        if (!cancelled) {
          setProfile(mapProminentProfile(response));
        }
      } catch (err) {
        if (__DEV__) {
          console.log("[profiles] detail error", err);
        }
        if (!cancelled) {
          setError(err.message || "Unable to load profile");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profileId, token]);

  return { profile, isLoading, error };
}
