import { useCallback, useEffect, useMemo, useState } from "react";
import {
  estimateSurveyMinutes,
  getFormById,
  listAvailableSurveys,
  submitFormResponse,
} from "@/lib/api/forms";
import { useAuthStore } from "@/stores/useAuthStore";

function mapSurvey(item) {
  const fields = item.fields || [];
  return {
    ...item,
    fields,
    minutes: estimateSurveyMinutes(fields),
    submitted: Boolean(item.submitted),
    assigned: item.assignment_type === "USER",
  };
}

export function useSurveys() {
  const token = useAuthStore((state) => state.token);
  const [surveys, setSurveys] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const data = await listAvailableSurveys({ page: 1, size: 50 }, token);
        const items = (data?.items || []).map(mapSurvey);
        setSurveys(items);
        setTotal(data?.total ?? items.length);
      } catch (err) {
        setError(err.message || "Unable to load surveys");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    load();
  }, [load]);

  const open = useMemo(() => surveys.filter((item) => !item.submitted), [surveys]);
  const completed = useMemo(() => surveys.filter((item) => item.submitted), [surveys]);
  const assigned = useMemo(
    () => open.filter((item) => item.assigned),
    [open]
  );

  return {
    surveys,
    open,
    completed,
    assigned,
    total,
    openCount: open.length,
    isLoading,
    isRefreshing,
    error,
    refresh: () => load({ refreshing: true }),
  };
}

export function useSurvey(formId) {
  const token = useAuthStore((state) => state.token);
  const [survey, setSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!formId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getFormById(formId, token);
        if (!cancelled) setSurvey(mapSurvey(data));
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load survey");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [formId, token]);

  return { survey, isLoading, error };
}

export function useOpenSurveysCount() {
  const token = useAuthStore((state) => state.token);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await listAvailableSurveys({ page: 1, size: 50 }, token);
        const open = (data?.items || []).filter((item) => !item.submitted).length;
        if (!cancelled) setCount(open);
      } catch {
        if (!cancelled) setCount(0);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return count;
}

export async function submitSurvey(formId, values, token) {
  return submitFormResponse(formId, { data: values }, token);
}
