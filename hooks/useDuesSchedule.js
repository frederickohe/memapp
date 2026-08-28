import { useCallback, useEffect, useState } from "react";
import { getDuesSchedule } from "@/lib/api/payments";
import { useAuthStore } from "@/stores/useAuthStore";

export function useDuesSchedule(year) {
  const token = useAuthStore((state) => state.token);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadSchedule = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await getDuesSchedule(year, token);
        setSchedule(data);
      } catch (err) {
        setError(err.message || "Unable to load dues");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token, year]
  );

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  return {
    schedule,
    isLoading,
    isRefreshing,
    error,
    reload: loadSchedule,
  };
}
