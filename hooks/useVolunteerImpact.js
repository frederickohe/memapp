import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getVolunteerImpact } from "@/lib/api/vhs";
import { buildVolunteerImpact } from "@/lib/volunteerUtils";
import { useAuthStore } from "@/stores/useAuthStore";

function fallbackImpact(user) {
  const points = Number(user?.volunteer_points) || 0;
  return buildVolunteerImpact({
    hours: points > 0 ? points / 10 : 0,
    points,
  });
}

export function useVolunteerImpact() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [impact, setImpact] = useState(() => fallbackImpact(user));
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadImpact = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await getVolunteerImpact(token);
        if (data?.milestones?.length) {
          setImpact(data);
        } else {
          setImpact(fallbackImpact(user));
        }
      } catch (err) {
        if (__DEV__) {
          console.log("[volunteer] impact error", err);
        }
        setImpact(fallbackImpact(user));
        setError(null);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token, user]
  );

  useFocusEffect(
    useCallback(() => {
      loadImpact();
    }, [loadImpact])
  );

  return {
    impact,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadImpact({ refreshing: true }),
  };
}
