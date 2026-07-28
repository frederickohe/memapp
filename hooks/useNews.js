import { useCallback, useEffect, useState } from "react";
import { getImpactStories, getNewsById, getPublishedNews } from "@/lib/api/news";
import {
  applyClientFilter,
  filterToApiParams,
  mapNewsItem,
} from "@/lib/newsUtils";
import { useAuthStore } from "@/stores/useAuthStore";

export function useNews(activeFilter = "All") {
  const token = useAuthStore((state) => state.token);
  const [newsList, setNewsList] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadNews = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = {
          page: 1,
          size: 50,
          sort_by: "published_at",
          ...filterToApiParams(activeFilter),
        };

        const response = await getPublishedNews(params, token);

        if (__DEV__) {
          console.log("[news] load response", { params, response });
        }

        let items = (response?.items || []).map(mapNewsItem);
        items = applyClientFilter(items, activeFilter);

        setNewsList(items);
        setTotal(response?.total ?? items.length);
        setLastUpdated(new Date());
      } catch (err) {
        if (__DEV__) {
          console.log("[news] load error", err);
        }
        setError(err.message || "Unable to load news");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [activeFilter, token]
  );

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    newsList,
    total,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => loadNews({ refreshing: true }),
  };
}

export function useNewsArticle(newsId) {
  const token = useAuthStore((state) => state.token);
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadArticle = async () => {
      if (!newsId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getNewsById(newsId, token);

        if (__DEV__) {
          console.log("[news] detail response", { newsId, response });
        }

        if (!cancelled) {
          setArticle(mapNewsItem(response));
        }
      } catch (err) {
        if (__DEV__) {
          console.log("[news] detail error", err);
        }
        if (!cancelled) {
          setError(err.message || "Unable to load article");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [newsId, token]);

  return { article, isLoading, error };
}

function normalizeImpactStoriesResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

export function useImpactStories(limit = 5) {
  const token = useAuthStore((state) => state.token);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadStories = useCallback(
    async ({ refreshing = false } = {}) => {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await getImpactStories(limit, token);

        if (__DEV__) {
          console.log("[news] impact stories response", { limit, response });
        }

        const items = normalizeImpactStoriesResponse(response).map(mapNewsItem);
        setStories(items);
      } catch (err) {
        if (__DEV__) {
          console.log("[news] impact stories error", err);
        }
        setError(err.message || "Unable to load impact stories");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [limit, token]
  );

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  return {
    stories,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadStories({ refreshing: true }),
  };
}

export function usePublishedNewsCount() {
  const token = useAuthStore((state) => state.token);
  const [count, setCount] = useState(0);

  const loadCount = useCallback(async () => {
    try {
      const response = await getPublishedNews(
        { page: 1, size: 1, sort_by: "published_at" },
        token
      );

      if (__DEV__) {
        console.log("[news] count response", { total: response?.total });
      }

      setCount(response?.total ?? 0);
    } catch (err) {
      if (__DEV__) {
        console.log("[news] count error", err);
      }
      setCount(0);
    }
  }, [token]);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  return count;
}
