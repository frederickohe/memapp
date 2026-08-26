import { useCallback, useEffect, useMemo, useState } from "react";
import {
  browsePublicPrograms,
  getMyPrograms,
  getProgramById,
  selfEnrollInProgram,
} from "@/lib/api/programs";
import { mapProgramItem, uniqueProgramCategories } from "@/lib/programUtils";
import { useAuthStore } from "@/stores/useAuthStore";

export function usePrograms(activeFilter = "All") {
  const token = useAuthStore((state) => state.token);
  const [programs, setPrograms] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPrograms = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await browsePublicPrograms({ page: 1, size: 50 }, token);
        const items = (response?.items || []).map(mapProgramItem);
        setPrograms(items);
        setTotal(response?.total ?? items.length);
      } catch (err) {
        if (__DEV__) {
          console.log("[programs] load error", err);
        }
        setError(err.message || "Unable to load programs");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const categories = useMemo(() => uniqueProgramCategories(programs), [programs]);

  const filteredPrograms = useMemo(() => {
    if (activeFilter === "All" || activeFilter === "Events") return programs;
    return programs.filter((program) => program.category === activeFilter);
  }, [programs, activeFilter]);

  return {
    programs: filteredPrograms,
    allPrograms: programs,
    categories,
    total,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadPrograms({ refreshing: true }),
  };
}

export function useProgram(programId) {
  const token = useAuthStore((state) => state.token);
  const [program, setProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProgram = async () => {
      if (!programId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getProgramById(programId, token);
        if (!cancelled) {
          setProgram(mapProgramItem(response));
        }
      } catch (err) {
        if (__DEV__) {
          console.log("[programs] detail error", err);
        }
        if (!cancelled) {
          setError(err.message || "Unable to load program");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProgram();

    return () => {
      cancelled = true;
    };
  }, [programId, token]);

  return { program, isLoading, error };
}

export function usePublishedProgramsCount() {
  const token = useAuthStore((state) => state.token);
  const [count, setCount] = useState(0);

  const loadCount = useCallback(async () => {
    try {
      const response = await browsePublicPrograms({ page: 1, size: 1 }, token);
      setCount(response?.total ?? 0);
    } catch (err) {
      if (__DEV__) {
        console.log("[programs] count error", err);
      }
      setCount(0);
    }
  }, [token]);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  return count;
}

export function useMyPrograms() {
  const token = useAuthStore((state) => state.token);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await getMyPrograms({ page: 1, size: 50 }, token);
        const items = (response?.programs || response?.items || []).map(mapProgramItem);
        if (!cancelled) setPrograms(items);
      } catch {
        if (!cancelled) setPrograms([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { programs, isLoading };
}

export async function applyToProgram({ programId, userId, formId, formData, notes, token }) {
  return selfEnrollInProgram(
    programId,
    { userId, formId, formData, notes },
    token
  );
}
